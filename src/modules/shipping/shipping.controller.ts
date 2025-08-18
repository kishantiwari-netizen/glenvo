import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import Shipment from "../../models/Shipment";
import Package from "../../models/Package";
import ShippingAddress from "../../models/ShippingAddress";
import Carrier from "../../models/Carrier";
import User from "../../models/User";
import ShippingProfile from "../../models/ShippingProfile";
import EasyPostService from "../easypost/easypost.service";
import {
  CreateShipmentDto,
  CarrierSelectionDto,
  AddressValidationDto,
  PickupSchedulingDto,
} from "./dto";

export const createShipment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const shipmentData: CreateShipmentDto = req.body;
    const userId = req.user.id;

    // Auto-detect currency based on sender address country if not provided
    let currency = shipmentData.currency;
    if (!currency) {
      const countryCurrencyMap: { [key: string]: string } = {
        US: "USD",
        CA: "CAD",
        GB: "GBP",
        AU: "AUD",
        EU: "EUR",
      };
      currency =
        countryCurrencyMap[shipmentData.sender_address.country] || "USD";
    }

    // Check if this is an international shipment
    const isInternational =
      shipmentData.sender_address.country !==
      shipmentData.receiver_address.country;

    // Determine insurance amount based on declared value and user preference
    let insuranceAmount = 0;
    const totalDeclaredValue = shipmentData.packages.reduce(
      (sum: number, pkg: any) => sum + pkg.declared_value,
      0
    );

    if (shipmentData.insurance_enabled && totalDeclaredValue > 100) {
      insuranceAmount =
        shipmentData.insurance_amount || totalDeclaredValue * 0.02; // 2% of declared value
    }

    // Create sender address
    const senderAddress = await ShippingAddress.create({
      user_id: userId,
      ...shipmentData.sender_address,
      address_type: "sender",
      is_default: false,
    });

    // Create receiver address
    const receiverAddress = await ShippingAddress.create({
      user_id: userId,
      ...shipmentData.receiver_address,
      address_type: "receiver",
      is_default: false,
    });

    // Create shipment
    const shipment = await Shipment.create({
      user_id: userId,
      sender_address_id: senderAddress.id,
      receiver_address_id: receiverAddress.id,
      status: "draft",
      total_amount: 0, // Will be calculated when carrier is selected
      shipping_fee: 0,
      insurance_fee: insuranceAmount,
      pickup_fee: 0,
      tax_amount: 0,
      currency: currency,
      signature_required: shipmentData.signature_required || false,
      saturday_delivery: shipmentData.saturday_delivery || false,
      is_gift: shipmentData.is_gift || false,
      adult_signature_required: shipmentData.adult_signature_required || false,
      pickup_date: shipmentData.pickup_date
        ? new Date(shipmentData.pickup_date)
        : undefined,
    });

    // Create packages
    const packages = await Promise.all(
      shipmentData.packages.map((pkg: any, index: number) =>
        Package.create({
          shipment_id: shipment.id,
          ...pkg,
          package_number: index + 1,
        })
      )
    );

    ResponseHandler.created(
      res,
      {
        shipment: {
          id: shipment.id,
          status: shipment.status,
          sender_address: senderAddress,
          receiver_address: receiverAddress,
          packages: packages,
          total_declared_value: totalDeclaredValue,
          currency: currency,
          is_international: isInternational,
          insurance_enabled: shipmentData.insurance_enabled,
          insurance_amount: insuranceAmount,
          pickup_intent: shipmentData.pickup_intent,
          requires_customs_form: isInternational,
        },
      },
      "Shipment created successfully"
    );
  } catch (error) {
    console.error("Create shipment error:", error);
    ResponseHandler.error(res, "Failed to create shipment");
  }
};

export const getCarrierRates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shipment_id } = req.params;
    const userId = req.user.id;

    // Get shipment with packages
    const shipment = await Shipment.findOne({
      where: { id: shipment_id, user_id: userId },
      include: [
        {
          model: Package,
          as: "packages",
        },
        {
          model: ShippingAddress,
          as: "sender_address",
        },
        {
          model: ShippingAddress,
          as: "receiver_address",
        },
      ],
    });

    if (!shipment) {
      ResponseHandler.notFound(res, "Shipment not found");
      return;
    }

    // Get user to check if they have EasyPost sub-account
    const user = await User.findByPk(userId);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Check if user has EasyPost setup
    if (!user.easypost_api_key) {
      console.log(
        "User does not have EasyPost setup, falling back to local carrier rates"
      );

      // Fallback to local carrier rates
      const carriers = await Carrier.findAll({
        where: { is_active: true },
      });

      if (carriers.length === 0) {
        ResponseHandler.badRequest(
          res,
          "No carriers available. Please contact support."
        );
        return;
      }

      // Calculate rates for each carrier
      const rates = carriers.map((carrier) => {
        const totalWeight =
          shipment.packages?.reduce(
            (sum: number, pkg: any) => sum + parseFloat(pkg.weight.toString()),
            0
          ) || 0;
        const totalDeclaredValue =
          shipment.packages?.reduce(
            (sum: number, pkg: any) =>
              sum + parseFloat(pkg.declared_value.toString()),
            0
          ) || 0;

        // Calculate fees
        const baseShippingFee = carrier.base_shipping_fee;
        const pickupFee = carrier.pickup_fee;
        const insuranceFee = shipment.insurance_fee || carrier.insurance_fee;
        const fuelSurcharge =
          baseShippingFee * (carrier.fuel_surcharge_rate / 100);
        const weekendDeliveryFee = shipment.saturday_delivery
          ? carrier.weekend_delivery_fee
          : 0;
        const packagingFee = carrier.packaging_fee;
        const subtotal =
          baseShippingFee +
          pickupFee +
          insuranceFee +
          fuelSurcharge +
          weekendDeliveryFee +
          packagingFee;
        const taxAmount = subtotal * (carrier.tax_rate / 100);
        const totalAmount = subtotal + taxAmount;

        // Calculate estimated delivery date
        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(
          estimatedDeliveryDate.getDate() + carrier.estimated_delivery_days
        );

        return {
          carrier: {
            id: carrier.id,
            name: carrier.name,
            code: carrier.code,
            logo_url: carrier.logo_url,
            service_description: carrier.service_description,
          },
          rates: {
            base_shipping_fee: baseShippingFee,
            pickup_fee: pickupFee,
            insurance_fee: insuranceFee,
            fuel_surcharge: fuelSurcharge,
            weekend_delivery_fee: weekendDeliveryFee,
            packaging_fee: packagingFee,
            tax_amount: taxAmount,
            total_amount: totalAmount,
          },
          delivery_info: {
            estimated_delivery_date: estimatedDeliveryDate,
            estimated_delivery_days: carrier.estimated_delivery_days,
          },
          package_info: {
            total_weight: totalWeight,
            total_declared_value: totalDeclaredValue,
            package_count: shipment.packages?.length || 0,
          },
          fallback_rate: true, // Indicate this is a fallback rate
        };
      });

      ResponseHandler.success(
        res,
        {
          shipment_id: shipment.id,
          rates: rates,
          fallback_mode: true,
          message: "Using local carrier rates (EasyPost not configured)",
        },
        "Carrier rates retrieved successfully (fallback mode)"
      );
      return;
    }

    // Initialize EasyPost service
    const easyPostService = new EasyPostService();

    // Prepare addresses for EasyPost
    const fromAddress = {
      street1: shipment.sender_address.address_line_1,
      street2: shipment.sender_address.address_line_2,
      city: shipment.sender_address.city,
      state: shipment.sender_address.state_province,
      zip: shipment.sender_address.postal_code,
      country: shipment.sender_address.country,
      company: shipment.sender_address.company_name,
      name: `${shipment.sender_address.first_name} ${shipment.sender_address.last_name}`,
      phone: shipment.sender_address.phone_number,
    };

    const toAddress = {
      street1: shipment.receiver_address.address_line_1,
      street2: shipment.receiver_address.address_line_2,
      city: shipment.receiver_address.city,
      state: shipment.receiver_address.state_province,
      zip: shipment.receiver_address.postal_code,
      country: shipment.receiver_address.country,
      company: shipment.receiver_address.company_name,
      name: `${shipment.receiver_address.first_name} ${shipment.receiver_address.last_name}`,
      phone: shipment.receiver_address.phone_number,
    };

    // Prepare parcels for EasyPost
    const parcels =
      shipment.packages?.map((pkg) => ({
        length: parseFloat(pkg.length.toString()),
        width: parseFloat(pkg.width.toString()),
        height: parseFloat(pkg.height.toString()),
        weight: parseFloat(pkg.weight.toString()),
      })) || [];

    if (parcels.length === 0) {
      ResponseHandler.badRequest(res, "No packages found for shipment");
      return;
    }

    // Prepare options
    const options: any = {};
    if (shipment.insurance_fee) {
      options.insurance = shipment.insurance_fee;
    }
    if (shipment.saturday_delivery) {
      options.saturday_delivery = true;
    }

    // Get rates from EasyPost using user's sub-account
    const easyPostRates = await easyPostService.createShipmentWithSubAccount(
      user.easypost_api_key,
      fromAddress,
      toAddress,
      parcels,
      options
    );

    // Transform EasyPost rates to our format
    const rates = easyPostRates.rates.map((rate: any) => {
      const totalWeight =
        shipment.packages?.reduce(
          (sum: number, pkg: any) => sum + parseFloat(pkg.weight.toString()),
          0
        ) || 0;
      const totalDeclaredValue =
        shipment.packages?.reduce(
          (sum: number, pkg: any) =>
            sum + parseFloat(pkg.declared_value.toString()),
          0
        ) || 0;

      // Calculate estimated delivery date
      const estimatedDeliveryDate = new Date();
      if (rate.delivery_days) {
        estimatedDeliveryDate.setDate(
          estimatedDeliveryDate.getDate() + rate.delivery_days
        );
      }

      // Map EasyPost carrier names to our local carrier codes
      const carrierCodeMap: { [key: string]: string } = {
        FedEx: "FX",
        UPS: "UPS",
        USPS: "USPS",
        DHL: "DHL",
      };

      const carrierCode = carrierCodeMap[rate.carrier] || rate.carrier;

      return {
        carrier: {
          id: null, // Will be resolved when carrier is selected
          name: rate.carrier,
          code: carrierCode,
          logo_url: null, // EasyPost doesn't provide logo URLs
          service_description: rate.service,
        },
        rates: {
          base_shipping_fee: parseFloat(rate.rate),
          pickup_fee: 0, // EasyPost rates are all-inclusive
          insurance_fee: shipment.insurance_fee || 0,
          fuel_surcharge: 0, // Included in EasyPost rate
          weekend_delivery_fee: shipment.saturday_delivery
            ? parseFloat(rate.rate) * 0.1
            : 0, // Estimate
          packaging_fee: 0, // Included in EasyPost rate
          tax_amount: 0, // EasyPost rates are pre-tax
          total_amount: parseFloat(rate.rate) + (shipment.insurance_fee || 0),
        },
        delivery_info: {
          estimated_delivery_date: estimatedDeliveryDate,
          estimated_delivery_days: rate.delivery_days || 0,
          delivery_date_guaranteed: rate.delivery_date_guaranteed || false,
        },
        package_info: {
          total_weight: totalWeight,
          total_declared_value: totalDeclaredValue,
          package_count: shipment.packages?.length || 0,
        },
        easypost_rate_id: rate.id,
        easypost_shipment_id: easyPostRates.id,
      };
    });

    ResponseHandler.success(
      res,
      {
        shipment_id: shipment.id,
        rates: rates,
        easypost_shipment_id: easyPostRates.id,
      },
      "Carrier rates retrieved successfully"
    );
  } catch (error) {
    console.error("Get carrier rates error:", error);
    ResponseHandler.error(res, "Failed to get carrier rates");
  }
};

export const selectCarrier = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shipment_id } = req.params;
    const carrierData: CarrierSelectionDto = req.body;
    const userId = req.user.id;

    // Get shipment with addresses and packages
    const shipment = await Shipment.findOne({
      where: { id: shipment_id, user_id: userId },
      include: [
        {
          model: Package,
          as: "packages",
        },
        {
          model: ShippingAddress,
          as: "sender_address",
        },
        {
          model: ShippingAddress,
          as: "receiver_address",
        },
      ],
    });

    if (!shipment) {
      ResponseHandler.notFound(res, "Shipment not found");
      return;
    }

    // Get user to check EasyPost setup
    const user = await User.findByPk(userId);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    let selectedCarrier: any;
    let baseShippingFee = 0;
    let pickupFee = 0;
    let insuranceFee = shipment.insurance_fee || 0;
    let fuelSurcharge = 0;
    let weekendDeliveryFee = 0;
    let packagingFee = 0;
    let taxAmount = 0;
    let totalAmount = 0;
    let estimatedDeliveryDate = new Date();
    let easypostRateId = null;
    let easypostShipmentId = null;

    // If EasyPost is configured, use EasyPost rates
    if (user.easypost_api_key && carrierData.easypost_rate_id) {
      const easyPostService = new EasyPostService();

      try {
        // Get the specific rate from EasyPost
        const rate = await easyPostService.getRateById(
          user.easypost_api_key,
          carrierData.easypost_rate_id
        );

        if (rate) {
          // Map EasyPost carrier names to our local carrier codes
          const carrierCodeMap: { [key: string]: string } = {
            FedEx: "FX",
            UPS: "UPS",
            USPS: "USPS",
            DHL: "DHL",
          };

          const carrierCode = carrierCodeMap[rate.carrier] || rate.carrier;

          // Find the local carrier record
          const localCarrier = await Carrier.findOne({
            where: { code: carrierCode },
          });

          selectedCarrier = {
            id: localCarrier?.id || null,
            name: rate.carrier,
            code: carrierCode,
            service_type: rate.service,
          };

          baseShippingFee = parseFloat(rate.rate);
          pickupFee = carrierData.pickup_fee || 0;
          fuelSurcharge = 0; // Included in EasyPost rate
          weekendDeliveryFee = shipment.saturday_delivery
            ? baseShippingFee * 0.1
            : 0;
          packagingFee = 0; // Included in EasyPost rate

          const subtotal =
            baseShippingFee + pickupFee + insuranceFee + weekendDeliveryFee;
          taxAmount = subtotal * 0.13; // 13% tax rate
          totalAmount = subtotal + taxAmount;

          if (rate.delivery_days) {
            estimatedDeliveryDate.setDate(
              estimatedDeliveryDate.getDate() + rate.delivery_days
            );
          }

          easypostRateId = carrierData.easypost_rate_id;
          easypostShipmentId = carrierData.easypost_shipment_id;
        }
      } catch (error) {
        console.error("EasyPost rate retrieval error:", error);
        ResponseHandler.badRequest(res, "Failed to retrieve EasyPost rate");
        return;
      }
    } else {
      // Fallback to local carrier rates
      let carrier;

      // Try to find carrier by ID first, then by code
      if (carrierData.carrier_id) {
        carrier = await Carrier.findByPk(carrierData.carrier_id);
      }

      // If not found by ID, try by code
      if (!carrier && carrierData.carrier_code) {
        carrier = await Carrier.findOne({
          where: { code: carrierData.carrier_code },
        });
      }

      if (!carrier || !carrier.is_active) {
        ResponseHandler.badRequest(res, "Invalid carrier selected");
        return;
      }

      selectedCarrier = {
        id: carrier.id,
        name: carrier.name,
        code: carrier.code,
        service_type: carrierData.service_type,
      };

      baseShippingFee = carrier.base_shipping_fee;
      pickupFee = carrierData.pickup_fee || carrier.pickup_fee;
      fuelSurcharge = baseShippingFee * (carrier.fuel_surcharge_rate / 100);
      weekendDeliveryFee = shipment.saturday_delivery
        ? carrier.weekend_delivery_fee
        : 0;
      packagingFee = carrier.packaging_fee;

      const subtotal =
        baseShippingFee +
        pickupFee +
        insuranceFee +
        fuelSurcharge +
        weekendDeliveryFee +
        packagingFee;
      taxAmount = subtotal * (carrier.tax_rate / 100);
      totalAmount = subtotal + taxAmount;

      estimatedDeliveryDate.setDate(
        estimatedDeliveryDate.getDate() + carrier.estimated_delivery_days
      );
    }

    // Update shipment
    await shipment.update({
      carrier_id: selectedCarrier.id,
      service_type: selectedCarrier.service_type,
      status: "pending",
      total_amount: totalAmount,
      shipping_fee: baseShippingFee,
      insurance_fee: insuranceFee,
      pickup_fee: pickupFee,
      tax_amount: taxAmount,
      estimated_delivery_date: estimatedDeliveryDate,
      pickup_date: carrierData.pickup_date
        ? new Date(carrierData.pickup_date)
        : undefined,
      pickup_time_start: carrierData.pickup_time_start,
      pickup_time_end: carrierData.pickup_time_end,
      pickup_instructions: carrierData.pickup_instructions,
    });

    // Calculate package info
    const totalWeight =
      shipment.packages?.reduce((sum, pkg) => sum + pkg.weight, 0) || 0;
    const totalDeclaredValue =
      shipment.packages?.reduce((sum, pkg) => sum + pkg.declared_value, 0) || 0;

    ResponseHandler.success(
      res,
      {
        shipment: {
          id: shipment.id,
          status: shipment.status,
          carrier: selectedCarrier,
          fees: {
            base_shipping_fee: baseShippingFee,
            pickup_fee: pickupFee,
            insurance_fee: insuranceFee,
            fuel_surcharge: fuelSurcharge,
            weekend_delivery_fee: weekendDeliveryFee,
            packaging_fee: packagingFee,
            tax_amount: taxAmount,
            total_amount_excl_tax: totalAmount - taxAmount,
            total_amount: totalAmount,
          },
          delivery_info: {
            estimated_delivery_date: estimatedDeliveryDate,
            pickup_date: shipment.pickup_date,
            pickup_time_start: shipment.pickup_time_start,
            pickup_time_end: shipment.pickup_time_end,
          },
          package_info: {
            total_weight: totalWeight,
            total_declared_value: totalDeclaredValue,
            package_count: shipment.packages?.length || 0,
          },
          sender_address: {
            name: `${shipment.sender_address.first_name} ${shipment.sender_address.last_name}`,
            address: `${shipment.sender_address.address_line_1}, ${shipment.sender_address.city}, ${shipment.sender_address.state_province} ${shipment.sender_address.postal_code}, ${shipment.sender_address.country}`,
          },
          receiver_address: {
            name: `${shipment.receiver_address.first_name} ${shipment.receiver_address.last_name}`,
            address: `${shipment.receiver_address.address_line_1}, ${shipment.receiver_address.city}, ${shipment.receiver_address.state_province} ${shipment.receiver_address.postal_code}, ${shipment.receiver_address.country}`,
          },
        },
      },
      "Carrier selected successfully"
    );
  } catch (error) {
    console.error("Select carrier error:", error);
    ResponseHandler.error(res, "Failed to select carrier");
  }
};

export const getShipmentDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shipment_id } = req.params;
    const userId = req.user.id;

    const shipment = await Shipment.findOne({
      where: { id: shipment_id, user_id: userId },
      include: [
        {
          model: ShippingAddress,
          as: "sender_address",
        },
        {
          model: ShippingAddress,
          as: "receiver_address",
        },
        {
          model: Package,
          as: "packages",
        },
        {
          model: Carrier,
          as: "carrier",
        },
      ],
    });

    if (!shipment) {
      ResponseHandler.notFound(res, "Shipment not found");
      return;
    }

    ResponseHandler.success(
      res,
      {
        shipment: shipment,
      },
      "Shipment details retrieved successfully"
    );
  } catch (error) {
    console.error("Get shipment details error:", error);
    ResponseHandler.error(res, "Failed to get shipment details");
  }
};

export const getUserShipments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause: any = { user_id: userId };
    if (status) {
      whereClause.status = status;
    }

    const shipments = await Shipment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ShippingAddress,
          as: "sender_address",
          attributes: ["first_name", "last_name", "city", "state_province"],
        },
        {
          model: ShippingAddress,
          as: "receiver_address",
          attributes: ["first_name", "last_name", "city", "state_province"],
        },
        {
          model: Carrier,
          as: "carrier",
          attributes: ["name", "code"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
    });

    ResponseHandler.success(
      res,
      {
        shipments: shipments.rows,
        pagination: {
          total: shipments.count,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total_pages: Math.ceil(shipments.count / parseInt(limit as string)),
        },
      },
      "Shipments retrieved successfully"
    );
  } catch (error) {
    console.error("Get user shipments error:", error);
    ResponseHandler.error(res, "Failed to get shipments");
  }
};

export const cancelShipment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shipment_id } = req.params;
    const userId = req.user.id;

    const shipment = await Shipment.findOne({
      where: { id: shipment_id, user_id: userId },
    });

    if (!shipment) {
      ResponseHandler.notFound(res, "Shipment not found");
      return;
    }

    if (shipment.status === "confirmed" || shipment.status === "in_transit") {
      ResponseHandler.badRequest(
        res,
        "Cannot cancel shipment that is already confirmed or in transit"
      );
      return;
    }

    await shipment.update({ status: "cancelled" });

    ResponseHandler.success(
      res,
      {
        shipment: {
          id: shipment.id,
          status: shipment.status,
        },
      },
      "Shipment cancelled successfully"
    );
  } catch (error) {
    console.error("Cancel shipment error:", error);
    ResponseHandler.error(res, "Failed to cancel shipment");
  }
};

export const getCarriersByCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country_code } = req.params;
    const userId = req.user.id;

    // Validate country code
    if (!country_code || country_code.length !== 2) {
      ResponseHandler.badRequest(
        res,
        "Invalid country code. Please provide a 2-letter ISO country code."
      );
      return;
    }

    // Get user to check if they have EasyPost setup
    const user = await User.findByPk(userId);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Initialize EasyPost service
    const easyPostService = new EasyPostService();

    // Get carriers by country code
    const carriers = await easyPostService.getCarriersByCountry(
      country_code.toUpperCase()
    );

    ResponseHandler.success(
      res,
      {
        country_code: country_code.toUpperCase(),
        carriers: carriers,
        total_carriers: carriers.length,
      },
      "Carriers retrieved successfully"
    );
  } catch (error) {
    console.error("Get carriers by country error:", error);
    ResponseHandler.error(res, "Failed to get carriers by country");
  }
};

export const getAllCarriers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    // Get user to check if they have EasyPost setup
    const user = await User.findByPk(userId);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Initialize EasyPost service
    const easyPostService = new EasyPostService();

    // Get all carriers
    const carriers = await easyPostService.getAllCarriers();

    ResponseHandler.success(
      res,
      {
        carriers: carriers,
        total_carriers: carriers.length,
      },
      "All carriers retrieved successfully"
    );
  } catch (error) {
    console.error("Get all carriers error:", error);
    ResponseHandler.error(res, "Failed to get all carriers");
  }
};

export const validateAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addressData: AddressValidationDto = req.body;
    const userId = req.user.id;

    // Initialize EasyPost service
    const easyPostService = new EasyPostService();

    // Prepare address data for EasyPost
    const easyPostAddressData = {
      street1: addressData.address_line_1,
      street2: addressData.address_line_2,
      city: addressData.city,
      state: addressData.state_province,
      zip: addressData.postal_code,
      country: addressData.country,
      company: addressData.company_name,
      name: `${addressData.first_name} ${addressData.last_name}`,
      phone: addressData.phone_number,
    };

    // Verify address using EasyPost
    const verifiedAddress = await easyPostService.verifyAddress(
      easyPostAddressData
    );

    if (verifiedAddress.verified) {
      ResponseHandler.success(
        res,
        {
          verified_address: {
            ...verifiedAddress,
            first_name: addressData.first_name,
            last_name: addressData.last_name,
            company_name: addressData.company_name,
            phone_number: addressData.phone_number,
            email: addressData.email,
            special_instructions: addressData.special_instructions,
            residential_address:
              addressData.address_type === "receiver" ? true : false,
          },
          validation_status: "valid",
        },
        "Address validated successfully"
      );
    } else {
      ResponseHandler.success(
        res,
        {
          verified_address: null,
          validation_status: "invalid",
          verification_errors: verifiedAddress.verification_errors,
        },
        "Address validation failed"
      );
    }
  } catch (error) {
    console.error("Address validation error:", error);
    ResponseHandler.error(res, "Failed to validate address");
  }
};

export const getDefaultSenderAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    // Get user's shipping profile
    const shippingProfile = await ShippingProfile.findOne({
      where: { user_id: userId, is_active: true },
    });

    if (!shippingProfile || !shippingProfile.is_profile_setup_complete) {
      ResponseHandler.notFound(
        res,
        "No default sender address found. Please complete profile setup."
      );
      return;
    }

    // Get user details
    const user = await User.findByPk(userId);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    const defaultAddress = {
      first_name: user.first_name,
      last_name: user.last_name,
      company_name: shippingProfile.company_name,
      address_line_1: shippingProfile.street_address_line_1,
      address_line_2: shippingProfile.street_address_line_2,
      city: shippingProfile.city,
      state_province: shippingProfile.state_province,
      postal_code: shippingProfile.postal_code,
      country: shippingProfile.country,
      phone_number: user.phone_number,
      email: user.email,
      is_default: true,
      residential_address: false,
    };

    ResponseHandler.success(
      res,
      {
        default_sender_address: defaultAddress,
        currency: shippingProfile.currency || "USD",
      },
      "Default sender address retrieved successfully"
    );
  } catch (error) {
    console.error("Get default sender address error:", error);
    ResponseHandler.error(res, "Failed to get default sender address");
  }
};

export const getPickupRates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shipment_id } = req.params;
    const userId = req.user.id;

    // Get shipment with carrier information
    const shipment = await Shipment.findOne({
      where: { id: shipment_id, user_id: userId },
      include: [
        {
          model: ShippingAddress,
          as: "sender_address",
        },
        {
          model: Carrier,
          as: "carrier",
        },
      ],
    });

    if (!shipment) {
      ResponseHandler.notFound(res, "Shipment not found");
      return;
    }

    if (!shipment.carrier_id) {
      ResponseHandler.badRequest(res, "No carrier selected for this shipment");
      return;
    }

    // Get user to check EasyPost setup
    const user = await User.findByPk(userId);
    if (!user || !user.easypost_api_key) {
      ResponseHandler.badRequest(
        res,
        "EasyPost not configured for pickup scheduling"
      );
      return;
    }

    // Initialize EasyPost service
    const easyPostService = new EasyPostService();

    // Prepare address for pickup
    const pickupAddress = {
      street1: shipment.sender_address.address_line_1,
      street2: shipment.sender_address.address_line_2,
      city: shipment.sender_address.city,
      state: shipment.sender_address.state_province,
      zip: shipment.sender_address.postal_code,
      country: shipment.sender_address.country,
      company: shipment.sender_address.company_name,
      name: `${shipment.sender_address.first_name} ${shipment.sender_address.last_name}`,
      phone: shipment.sender_address.phone_number,
    };

    // Get pickup rates from EasyPost
    const pickupRates = await easyPostService.getPickupRates(
      user.easypost_api_key,
      pickupAddress,
      shipment.carrier_id?.toString() || ""
    );

    ResponseHandler.success(
      res,
      {
        shipment_id: shipment.id,
        pickup_rates: pickupRates,
      },
      "Pickup rates retrieved successfully"
    );
  } catch (error) {
    console.error("Get pickup rates error:", error);
    ResponseHandler.error(res, "Failed to get pickup rates");
  }
};

export const schedulePickup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shipment_id } = req.params;
    const pickupData: PickupSchedulingDto = req.body;
    const userId = req.user.id;

    // Get shipment
    const shipment = await Shipment.findOne({
      where: { id: shipment_id, user_id: userId },
      include: [
        {
          model: Package,
          as: "packages",
        },
        {
          model: ShippingAddress,
          as: "sender_address",
        },
        {
          model: ShippingAddress,
          as: "receiver_address",
        },
        {
          model: Carrier,
          as: "carrier",
        },
      ],
    });

    if (!shipment) {
      ResponseHandler.notFound(res, "Shipment not found");
      return;
    }

    if (!shipment.carrier_id) {
      ResponseHandler.badRequest(res, "No carrier selected for this shipment");
      return;
    }

    // Update shipment with pickup details
    await shipment.update({
      pickup_date: new Date(pickupData.pickup_date),
      pickup_time_start: pickupData.pickup_time_start,
      pickup_time_end: pickupData.pickup_time_end,
      pickup_instructions: pickupData.pickup_instructions,
      pickup_fee: pickupData.pickup_fee,
    });

    // Recalculate total amount with pickup fee
    const baseShippingFee = shipment.shipping_fee;
    const insuranceFee = shipment.insurance_fee || 0;
    const pickupFee = pickupData.pickup_fee;
    const subtotal = baseShippingFee + insuranceFee + pickupFee;
    const taxAmount = subtotal * 0.13; // 13% tax rate
    const totalAmount = subtotal + taxAmount;

    await shipment.update({
      total_amount: totalAmount,
      tax_amount: taxAmount,
    });

    // Calculate package info
    const totalWeight =
      shipment.packages?.reduce((sum, pkg) => sum + pkg.weight, 0) || 0;
    const totalDeclaredValue =
      shipment.packages?.reduce((sum, pkg) => sum + pkg.declared_value, 0) || 0;

    ResponseHandler.success(
      res,
      {
        shipment: {
          id: shipment.id,
          status: shipment.status,
          carrier: {
            id: shipment.carrier?.id,
            name: shipment.carrier?.name,
            code: shipment.carrier?.code,
            service_type: shipment.service_type,
          },
          fees: {
            base_shipping_fee: baseShippingFee,
            pickup_fee: pickupFee,
            insurance_fee: insuranceFee,
            tax_amount: taxAmount,
            total_amount_excl_tax: subtotal,
            total_amount: totalAmount,
          },
          pickup_info: {
            pickup_date: shipment.pickup_date,
            pickup_time_start: shipment.pickup_time_start,
            pickup_time_end: shipment.pickup_time_end,
            pickup_instructions: shipment.pickup_instructions,
            time_slot_id: pickupData.time_slot_id,
          },
          package_info: {
            total_weight: totalWeight,
            total_declared_value: totalDeclaredValue,
            package_count: shipment.packages?.length || 0,
          },
          sender_address: {
            name: `${shipment.sender_address.first_name} ${shipment.sender_address.last_name}`,
            address: `${shipment.sender_address.address_line_1}, ${shipment.sender_address.city}, ${shipment.sender_address.state_province} ${shipment.sender_address.postal_code}, ${shipment.sender_address.country}`,
          },
          receiver_address: {
            name: `${shipment.receiver_address.first_name} ${shipment.receiver_address.last_name}`,
            address: `${shipment.receiver_address.address_line_1}, ${shipment.receiver_address.city}, ${shipment.receiver_address.state_province} ${shipment.receiver_address.postal_code}, ${shipment.receiver_address.country}`,
          },
        },
      },
      "Pickup scheduled successfully"
    );
  } catch (error) {
    console.error("Schedule pickup error:", error);
    ResponseHandler.error(res, "Failed to schedule pickup");
  }
};
