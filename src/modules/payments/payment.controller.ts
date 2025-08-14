import { Request, Response } from "express";
import { User } from "../../../db/models";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class PaymentController {
  /**
   * Get all payment methods for user
   */
  static async getPaymentMethods(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Mock data for payment methods
      const paymentMethods = [
        {
          id: 1,
          type: "card",
          last4: "4242",
          brand: "Visa",
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          cardholderName: "John Doe",
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          type: "card",
          last4: "5555",
          brand: "Mastercard",
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false,
          cardholderName: "John Doe",
          createdAt: "2024-03-20T14:30:00Z",
        },
      ];

      ResponseHandler.success(
        res,
        { paymentMethods },
        "Payment methods retrieved successfully"
      );
    } catch (error) {
      console.error("Get payment methods error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Add new payment method
   */
  static async addPaymentMethod(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const paymentData = req.body;

      // Mock payment method creation
      const newPaymentMethod = {
        id: Date.now(),
        type: "card",
        last4: paymentData.cardNumber.slice(-4),
        brand: "Visa", // In real app, detect from card number
        expiryMonth: paymentData.expiryMonth,
        expiryYear: paymentData.expiryYear,
        isDefault: false,
        cardholderName: paymentData.cardholderName,
        createdAt: new Date().toISOString(),
      };

      ResponseHandler.created(
        res,
        { paymentMethod: newPaymentMethod },
        "Payment method added successfully"
      );
    } catch (error) {
      console.error("Add payment method error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get saved addresses for user
   */
  static async getSavedAddresses(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Mock data for saved addresses
      const savedAddresses = [
        {
          id: 1,
          name: "Home",
          streetAddress: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "Anytown",
          state: "CA",
          zipCode: "90210",
          country: "United States",
          isDefault: true,
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          name: "Work",
          streetAddress: "456 Business Ave",
          streetAddress2: "Suite 100",
          city: "Business City",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          isDefault: false,
          createdAt: "2024-02-10T16:45:00Z",
        },
      ];

      ResponseHandler.success(
        res,
        { savedAddresses },
        "Saved addresses retrieved successfully"
      );
    } catch (error) {
      console.error("Get saved addresses error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Add new saved address
   */
  static async addSavedAddress(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const addressData = req.body;

      // Mock address creation
      const newAddress = {
        id: Date.now(),
        ...addressData,
        isDefault: false,
        createdAt: new Date().toISOString(),
      };

      ResponseHandler.created(
        res,
        { address: newAddress },
        "Address saved successfully"
      );
    } catch (error) {
      console.error("Add saved address error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update saved address
   */
  static async updateSavedAddress(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updateData = req.body;

      // Mock address update
      const updatedAddress = {
        id: Number(id),
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      ResponseHandler.updated(
        res,
        { address: updatedAddress },
        "Address updated successfully"
      );
    } catch (error) {
      console.error("Update saved address error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Delete saved address
   */
  static async deleteSavedAddress(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Mock address deletion
      ResponseHandler.deleted(res, "Address deleted successfully");
    } catch (error) {
      console.error("Delete saved address error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Set default payment method
   */
  static async setDefaultPaymentMethod(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Mock setting default payment method
      ResponseHandler.success(
        res,
        { message: "Default payment method updated" },
        "Default payment method updated successfully"
      );
    } catch (error) {
      console.error("Set default payment method error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Delete payment method
   */
  static async deletePaymentMethod(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Mock payment method deletion
      ResponseHandler.deleted(res, "Payment method deleted successfully");
    } catch (error) {
      console.error("Delete payment method error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get billing information for user
   */
  static async getBillingInformation(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Mock billing information data
      const billingInfo = {
        companyName: "Merchant Dashboard Inc.",
        taxId: "US123456789",
        address: {
          line1: "123 Commerce St",
          line2: "Suite 500",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "United States",
        },
        lastUpdated: "2024-07-28T10:30:00Z",
      };

      ResponseHandler.success(
        res,
        { billingInfo },
        "Billing information retrieved successfully"
      );
    } catch (error) {
      console.error("Get billing information error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update billing information
   */
  static async updateBillingInformation(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const billingData = req.body;

      // Mock billing information update
      const updatedBillingInfo = {
        ...billingData,
        lastUpdated: new Date().toISOString(),
      };

      ResponseHandler.updated(
        res,
        { billingInfo: updatedBillingInfo },
        "Billing information updated successfully"
      );
    } catch (error) {
      console.error("Update billing information error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Set payment method as primary
   */
  static async setPrimaryPaymentMethod(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Mock setting primary payment method
      ResponseHandler.success(
        res,
        { 
          message: "Payment method set as primary",
          paymentMethodId: id,
        },
        "Payment method set as primary successfully"
      );
    } catch (error) {
      console.error("Set primary payment method error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
