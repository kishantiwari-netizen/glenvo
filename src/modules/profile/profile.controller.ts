import { Request, Response } from "express";
import { User } from "../../../db/models";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class ProfileController {
  /**
   * Get shipping profile for user
   */
  static async getShippingProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Mock shipping profile data
      const shippingProfile = {
        personalInfo: {
          fullName: "John Doe",
          email: "john.doe@example.com",
          companyName: "Smart Merchant Inc.",
          phoneNumber: "+1 (555) 123-4567",
          country: "United States",
          currency: "USD",
        },
        shippingAddress: {
          streetAddress1: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "Springfield",
          state: "IL",
          postalCode: "62704",
        },
        accountType: "merchant",
        businessType: "eCommerce Retailer",
        carriers: {
          usa: ["UPS", "FedEx", "USPS", "DHL"],
          canada: ["UPS", "FedEx", "Canada Post", "DHL"],
        },
      };

      ResponseHandler.success(
        res,
        { shippingProfile },
        "Shipping profile retrieved successfully"
      );
    } catch (error) {
      console.error("Get shipping profile error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update shipping profile
   */
  static async updateShippingProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const profileData = req.body;

      // Mock profile update
      const updatedProfile = {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      ResponseHandler.updated(
        res,
        { shippingProfile: updatedProfile },
        "Shipping profile updated successfully"
      );
    } catch (error) {
      console.error("Update shipping profile error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Create EasyPost sub-account
   */
  static async createEasyPostSubAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userData = req.body;

      // Mock EasyPost sub-account creation
      const subAccount = {
        id: `user_${Date.now()}`,
        userId: userId,
        apiKey: `ep_test_${Math.random().toString(36).substr(2, 20)}`,
        webhookUrl: "https://glenvoship.com/api/webhooks/easypost",
        status: "active",
        createdAt: new Date().toISOString(),
        settings: {
          billingCycle: "monthly",
          autoCharge: true,
          notifications: {
            shipmentCreated: true,
            shipmentUpdated: true,
            trackerUpdated: true,
          },
        },
      };

      ResponseHandler.created(
        res,
        {
          subAccount,
          message:
            "EasyPost sub-account created successfully. Webhook configured for real-time updates.",
        },
        "EasyPost sub-account created successfully"
      );
    } catch (error) {
      console.error("Create EasyPost sub-account error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get available carriers by country
   */
  static async getAvailableCarriers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { country } = req.query;

      // Mock carriers data
      const carriers = {
        usa: [
          {
            name: "UPS",
            code: "ups",
            services: ["Ground", "2nd Day Air", "Next Day Air"],
          },
          {
            name: "FedEx",
            code: "fedex",
            services: ["Ground", "2Day", "Overnight"],
          },
          {
            name: "USPS",
            code: "usps",
            services: ["Priority Mail", "First Class", "Media Mail"],
          },
          { name: "DHL", code: "dhl", services: ["Express", "Ground"] },
        ],
        canada: [
          {
            name: "UPS",
            code: "ups",
            services: ["Standard", "Express", "Expedited"],
          },
          {
            name: "FedEx",
            code: "fedex",
            services: ["Ground", "Express", "Priority"],
          },
          {
            name: "Canada Post",
            code: "canada_post",
            services: ["Regular", "Expedited", "Xpresspost"],
          },
          { name: "DHL", code: "dhl", services: ["Express", "Ground"] },
        ],
      };

      const availableCarriers = country
        ? carriers[country as keyof typeof carriers]
        : carriers;

      ResponseHandler.success(
        res,
        { carriers: availableCarriers },
        "Available carriers retrieved successfully"
      );
    } catch (error) {
      console.error("Get available carriers error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get business types
   */
  static async getBusinessTypes(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // Mock business types
      const businessTypes = [
        "eCommerce Retailer",
        "Wholesaler",
        "3PL / Fulfillment Center",
        "Marketplace Seller (e.g., Etsy, Amazon)",
        "Home Business",
        "Local Store / Brick & Mortar",
        "Dropshipper",
        "Other",
      ];

      ResponseHandler.success(
        res,
        { businessTypes },
        "Business types retrieved successfully"
      );
    } catch (error) {
      console.error("Get business types error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Validate address via EasyPost API
   */
  static async validateAddress(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { address } = req.body;

      // Mock address validation
      const validatedAddress = {
        original: address,
        validated: {
          streetAddress1: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "Springfield",
          state: "IL",
          postalCode: "62704",
          country: "US",
        },
        isValid: true,
        suggestions: [],
        confidence: 0.95,
      };

      ResponseHandler.success(
        res,
        { address: validatedAddress },
        "Address validated successfully"
      );
    } catch (error) {
      console.error("Validate address error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get currency by country
   */
  static async getCurrencyByCountry(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { country } = req.query;

      // Mock currency mapping
      const currencyMap = {
        "United States": "USD",
        Canada: "CAD",
        "United Kingdom": "GBP",
        Australia: "AUD",
        Germany: "EUR",
        France: "EUR",
        Japan: "JPY",
      };

      const currency =
        currencyMap[country as keyof typeof currencyMap] || "USD";

      ResponseHandler.success(
        res,
        { currency },
        "Currency retrieved successfully"
      );
    } catch (error) {
      console.error("Get currency by country error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
