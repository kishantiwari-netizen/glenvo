import { Request, Response } from "express";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class MarkupController {
  /**
   * Get markup configuration
   */
  static async getMarkupConfig(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const markupConfig = {
        formula: "Final Fee = (Base Fee CAD × (1 + Percentage)) + Flat Amount",
        carrierMarkups: [
          {
            id: 1,
            carrier: "Canada Post",
            baseCurrency: "USD",
            conversionRate: 1.35,
            markupType: "Flat",
            markupValue: 3.5,
            formulaGuide: "Base + $3.5",
          },
          {
            id: 2,
            carrier: "FedEx",
            baseCurrency: "CAD",
            conversionRate: 1,
            markupType: "%",
            markupValue: 5,
            formulaGuide: "Base × (1 + 5%)",
          },
          {
            id: 3,
            carrier: "UPS",
            baseCurrency: "CAD",
            conversionRate: 1,
            markupType: "%",
            markupValue: 10,
            formulaGuide: "Base × (1 + 10%)",
          },
          {
            id: 4,
            carrier: "DHL",
            baseCurrency: "USD",
            conversionRate: 1.4,
            markupType: "Flat",
            markupValue: 2.5,
            formulaGuide: "Base + $2.5",
          },
        ],
        pickupMarkups: [
          {
            id: 1,
            carrier: "Canada Post",
            baseCurrency: "USD",
            conversionRate: 1.35,
            markupType: "%",
            markupValue: 10,
            formulaGuide: "Base × (1 + 10%)",
          },
          {
            id: 2,
            carrier: "UPS",
            baseCurrency: "CAD",
            conversionRate: 1,
            markupType: "%",
            markupValue: 5,
            formulaGuide: "Base × (1 + 5%)",
          },
          {
            id: 3,
            carrier: "FedEx",
            baseCurrency: "USD",
            conversionRate: 1.4,
            markupType: "%",
            markupValue: 8,
            formulaGuide: "Base × (1 + 8%)",
          },
        ],
        globalInsurance: {
          markupSource: "Global Insurance Default",
          type: "Default",
          conversionRate: 1.5,
          markupPercentage: 1.25,
        },
      };

      ResponseHandler.success(
        res,
        { markupConfig },
        "Markup configuration retrieved successfully"
      );
    } catch (error) {
      console.error("Get markup config error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update markup configuration
   */
  static async updateMarkupConfig(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { carrierMarkups, pickupMarkups, globalInsurance } = req.body;

      // In a real app, this would be saved to a database
      const updatedConfig = {
        carrierMarkups: carrierMarkups || [],
        pickupMarkups: pickupMarkups || [],
        globalInsurance: globalInsurance || {},
      };

      ResponseHandler.updated(
        res,
        { markupConfig: updatedConfig },
        "Markup configuration updated successfully"
      );
    } catch (error) {
      console.error("Update markup config error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Calculate markup simulation
   */
  static async calculateMarkupSimulation(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        baseFee,
        baseCurrency,
        conversionRate,
        carrierMarkup,
        declaredValue,
        insuranceMarkup,
        pickupBaseFee,
        pickupMarkup,
      } = req.body;

      // Convert base fee to CAD
      const baseFeeCAD = baseFee * conversionRate;

      // Calculate carrier fee
      const carrierFeeCAD =
        carrierMarkup.type === "Flat"
          ? baseFeeCAD + carrierMarkup.value
          : baseFeeCAD * (1 + carrierMarkup.value / 100);

      // Calculate insurance fee
      const insuranceFeeCAD =
        (declaredValue * conversionRate * insuranceMarkup) / 100;

      // Calculate pickup fee
      const pickupFeeCAD = pickupBaseFee * (1 + pickupMarkup / 100);

      // Calculate total
      const totalFeeCAD = carrierFeeCAD + insuranceFeeCAD + pickupFeeCAD;

      const calculationResults = {
        inputs: {
          baseFee,
          baseCurrency,
          conversionRate,
          carrierMarkup,
          declaredValue,
          insuranceMarkup,
          pickupBaseFee,
          pickupMarkup,
        },
        calculations: {
          carrierFeeCAD: parseFloat(carrierFeeCAD.toFixed(2)),
          insuranceFeeCAD: parseFloat(insuranceFeeCAD.toFixed(2)),
          pickupFeeCAD: parseFloat(pickupFeeCAD.toFixed(2)),
          totalEstimatedFeeCAD: parseFloat(totalFeeCAD.toFixed(2)),
        },
        summary: {
          finalPostageFeeCAD: parseFloat(carrierFeeCAD.toFixed(2)),
          finalInsuranceFeeCAD: parseFloat(insuranceFeeCAD.toFixed(2)),
          finalPickupFeeCAD: parseFloat(pickupFeeCAD.toFixed(2)),
          totalEstimatedFeeCAD: parseFloat(totalFeeCAD.toFixed(2)),
        },
      };

      ResponseHandler.success(
        res,
        { calculationResults },
        "Markup calculation completed successfully"
      );
    } catch (error) {
      console.error("Calculate markup simulation error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get available carriers
   */
  static async getAvailableCarriers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const carriers = [
        { id: 1, name: "Canada Post", code: "canada_post" },
        { id: 2, name: "FedEx", code: "fedex" },
        { id: 3, name: "UPS", code: "ups" },
        { id: 4, name: "DHL", code: "dhl" },
      ];

      ResponseHandler.success(
        res,
        { carriers },
        "Available carriers retrieved successfully"
      );
    } catch (error) {
      console.error("Get available carriers error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get available currencies
   */
  static async getAvailableCurrencies(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const currencies = [
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
        { code: "EUR", name: "Euro", symbol: "€" },
        { code: "GBP", name: "British Pound", symbol: "£" },
      ];

      ResponseHandler.success(
        res,
        { currencies },
        "Available currencies retrieved successfully"
      );
    } catch (error) {
      console.error("Get available currencies error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get markup types
   */
  static async getMarkupTypes(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const markupTypes = [
        {
          id: "flat",
          name: "Flat",
          description: "Fixed amount added to base fee",
        },
        {
          id: "percentage",
          name: "Percentage",
          description: "Percentage markup applied to base fee",
        },
      ];

      ResponseHandler.success(
        res,
        { markupTypes },
        "Markup types retrieved successfully"
      );
    } catch (error) {
      console.error("Get markup types error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Add carrier markup
   */
  static async addCarrierMarkup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { carrier, baseCurrency, conversionRate, markupType, markupValue } =
        req.body;

      // In a real app, this would be saved to a database
      const newMarkup = {
        id: Date.now(), // Generate unique ID
        carrier,
        baseCurrency,
        conversionRate,
        markupType,
        markupValue,
        formulaGuide:
          markupType === "Flat"
            ? `Base + $${markupValue}`
            : `Base × (1 + ${markupValue}%)`,
      };

      ResponseHandler.created(
        res,
        { markup: newMarkup },
        "Carrier markup added successfully"
      );
    } catch (error) {
      console.error("Add carrier markup error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update carrier markup
   */
  static async updateCarrierMarkup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // In a real app, this would update the database
      const updatedMarkup = {
        id: parseInt(id),
        ...updateData,
        formulaGuide:
          updateData.markupType === "Flat"
            ? `Base + $${updateData.markupValue}`
            : `Base × (1 + ${updateData.markupValue}%)`,
      };

      ResponseHandler.updated(
        res,
        { markup: updatedMarkup },
        "Carrier markup updated successfully"
      );
    } catch (error) {
      console.error("Update carrier markup error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Delete carrier markup
   */
  static async deleteCarrierMarkup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      // In a real app, this would delete from the database
      ResponseHandler.deleted(res, "Carrier markup deleted successfully");
    } catch (error) {
      console.error("Delete carrier markup error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Add pickup markup
   */
  static async addPickupMarkup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { carrier, baseCurrency, conversionRate, markupType, markupValue } =
        req.body;

      // In a real app, this would be saved to a database
      const newMarkup = {
        id: Date.now(), // Generate unique ID
        carrier,
        baseCurrency,
        conversionRate,
        markupType,
        markupValue,
        formulaGuide: `Base × (1 + ${markupValue}%)`,
      };

      ResponseHandler.created(
        res,
        { markup: newMarkup },
        "Pickup markup added successfully"
      );
    } catch (error) {
      console.error("Add pickup markup error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update pickup markup
   */
  static async updatePickupMarkup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // In a real app, this would update the database
      const updatedMarkup = {
        id: parseInt(id),
        ...updateData,
        formulaGuide: `Base × (1 + ${updateData.markupValue}%)`,
      };

      ResponseHandler.updated(
        res,
        { markup: updatedMarkup },
        "Pickup markup updated successfully"
      );
    } catch (error) {
      console.error("Update pickup markup error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Delete pickup markup
   */
  static async deletePickupMarkup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      // In a real app, this would delete from the database
      ResponseHandler.deleted(res, "Pickup markup deleted successfully");
    } catch (error) {
      console.error("Delete pickup markup error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
