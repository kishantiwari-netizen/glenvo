import { Request, Response } from "express";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class SettingsController {
  /**
   * Get security settings
   */
  static async getSecuritySettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // In a real app, these would come from a database
      const securitySettings = {
        authentication: {
          requireLogin: true,
          description:
            "Require login for authentication and creating a session",
        },
        passwordPolicy: {
          minLength: 8,
          requireNumbers: true,
          requireSpecialChars: false,
          description: "Minimum 8 characters, atleast 1 number",
        },
        twoFactorAuth: {
          enabled: true,
          description: "Enable two-factor authentication for enhanced security",
        },
        sessionTimeout: {
          duration: 3600, // 1 hour in seconds
          description: "Automatically log out users after inactivity.",
        },
        emailSecurityFooter: {
          enabled: false,
          content:
            "You are receiving this email because you are a registered user of GlenvoShip. Never share your password with anyone. Contact support if you suspect any unauthorized activity",
          description: "Enable footer in all system emails",
        },
      };

      ResponseHandler.success(
        res,
        { securitySettings },
        "Security settings retrieved successfully"
      );
    } catch (error) {
      console.error("Get security settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update security settings
   */
  static async updateSecuritySettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        authentication,
        passwordPolicy,
        twoFactorAuth,
        sessionTimeout,
        emailSecurityFooter,
      } = req.body;

      // In a real app, these would be saved to a database
      const updatedSettings = {
        authentication: authentication || { requireLogin: true },
        passwordPolicy: passwordPolicy || {
          minLength: 8,
          requireNumbers: true,
        },
        twoFactorAuth: twoFactorAuth || { enabled: true },
        sessionTimeout: sessionTimeout || { duration: 3600 },
        emailSecurityFooter: emailSecurityFooter || { enabled: false },
      };

      ResponseHandler.updated(
        res,
        { securitySettings: updatedSettings },
        "Security settings updated successfully"
      );
    } catch (error) {
      console.error("Update security settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get company profile settings
   */
  static async getCompanyProfileSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const companySettings = {
        companyInfo: {
          platformName: "GlenvoShip",
          supportEmail: "support@glenvoship.com",
          supportPhone: "+1234 567 890",
        },
        preferences: {
          timezone: "UTC-4 (Eastern Daylight Time)",
          dateFormat: "MM/DD/YYYY",
          currency: "USD - US Dollar",
        },
        notificationPreferences: {
          emailNotifications: true,
          smsNotifications: false,
          inAppNotifications: true,
        },
      };

      ResponseHandler.success(
        res,
        { companySettings },
        "Company profile settings retrieved successfully"
      );
    } catch (error) {
      console.error("Get company profile settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update company profile settings
   */
  static async updateCompanyProfileSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { companyInfo, preferences, notificationPreferences } = req.body;

      const updatedSettings = {
        companyInfo: companyInfo || {},
        preferences: preferences || {},
        notificationPreferences: notificationPreferences || {},
      };

      ResponseHandler.updated(
        res,
        { companySettings: updatedSettings },
        "Company profile settings updated successfully"
      );
    } catch (error) {
      console.error("Update company profile settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get integration settings
   */
  static async getIntegrationSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const integrationSettings = {
        easyPost: {
          testApiKey: "ep_test_****************",
          liveApiKey: "ep_live_****************",
          webhookUrl: "https://glenvoship.com/webhook",
          status: "Connected",
        },
        stripe: {
          testApiKey: "sk_test_*****",
          liveApiKey: "sk_live_*****",
          webhookUrl: "https://glenvoship.com/stripe-webhook",
          status: "Connected",
          billingCycle: "Monthly",
          enablePayments: true,
        },
        sendGrid: {
          testApiKey: "SG.test_api_key_12345",
          liveApiKey: "SG.live_api_key_67890",
          webhookUrl: "https://glenvoship.com/integrations",
          status: "Connected",
        },
        directCarriers: {
          available: false,
          description:
            "This feature will allow direct API connections to major carriers like FedEx, UPS, DHL, or Canada Post.",
          availability: "Available in Phase 2",
        },
      };

      ResponseHandler.success(
        res,
        { integrationSettings },
        "Integration settings retrieved successfully"
      );
    } catch (error) {
      console.error("Get integration settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update integration settings
   */
  static async updateIntegrationSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { easyPost, stripe, sendGrid } = req.body;

      const updatedSettings = {
        easyPost: easyPost || {},
        stripe: stripe || {},
        sendGrid: sendGrid || {},
      };

      ResponseHandler.updated(
        res,
        { integrationSettings: updatedSettings },
        "Integration settings updated successfully"
      );
    } catch (error) {
      console.error("Update integration settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Test integration connection
   */
  static async testIntegrationConnection(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { integrationType } = req.params;
      const { apiKey } = req.body;

      // In a real app, this would actually test the API connection
      const testResults = {
        integrationType,
        status: "Connected",
        message: `${integrationType} connection test successful`,
        timestamp: new Date().toISOString(),
      };

      ResponseHandler.success(
        res,
        { testResults },
        `${integrationType} connection test completed`
      );
    } catch (error) {
      console.error("Test integration connection error:", error);
      ResponseHandler.error(res, "Integration connection test failed");
    }
  }
}
