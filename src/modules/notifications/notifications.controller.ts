import { Request, Response } from "express";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class NotificationsController {
  /**
   * Get notification configuration
   */
  static async getNotificationConfig(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const notificationConfig = {
        alertConfiguration: {
          communicationChannels: {
            enableEmailAlerts: true,
            enableSmsAlerts: false,
          },
          alertRecipients: [
            { id: 1, name: "John Doe", role: "Admin", selected: true },
            { id: 2, name: "Jane Smith", role: "Support", selected: false },
            { id: 3, name: "Mark Lee", role: "Operations", selected: true },
            { id: 4, name: "Sarah Chen", role: "Sales", selected: false },
            { id: 5, name: "David Kim", role: "Manager", selected: true },
            { id: 6, name: "Emily White", role: "Logistics", selected: false },
          ],
          footerText: "selected roles and enabled alert types.",
        },
        notificationActivity: {
          description: "Volume and status over the last 12 months.",
          chartData: {
            labels: ["Feb", "Apr", "Jun", "Aug", "Oct", "Dec"],
            datasets: [
              {
                label: "Successful",
                data: [3000, 4500, 5000, 4800, 5200, 5500],
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
              },
              {
                label: "Failed",
                data: [500, 800, 1200, 1000, 1500, 1800],
                borderColor: "#EF4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              },
            ],
          },
        },
        deliverySummary: {
          successful: 9876,
          failed: 123,
          pending: 45,
        },
      };

      ResponseHandler.success(
        res,
        { notificationConfig },
        "Notification configuration retrieved successfully"
      );
    } catch (error) {
      console.error("Get notification config error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update notification configuration
   */
  static async updateNotificationConfig(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { alertConfiguration } = req.body;

      // In a real app, this would be saved to a database
      const updatedConfig = {
        alertConfiguration: alertConfiguration || {
          communicationChannels: {
            enableEmailAlerts: true,
            enableSmsAlerts: false,
          },
          alertRecipients: [],
        },
      };

      ResponseHandler.updated(
        res,
        { notificationConfig: updatedConfig },
        "Notification configuration updated successfully"
      );
    } catch (error) {
      console.error("Update notification config error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get user notification settings
   */
  static async getUserNotificationSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userNotificationSettings = {
        notificationEvents: [
          {
            event: "Shipment Created",
            email: { enabled: false, icon: "X" },
            sms: { enabled: false, icon: "-", note: "not applicable" },
            inApp: { enabled: true, icon: "✓" },
            notes: "Shipment label created",
          },
          {
            event: "Shipment Delivered",
            email: { enabled: true, icon: "✓" },
            sms: { enabled: false, icon: "-", note: "not applicable" },
            inApp: { enabled: true, icon: "✓" },
            notes: "Delivery confirmation",
          },
          {
            event: "Pickup Scheduled",
            email: { enabled: false, icon: "X" },
            sms: { enabled: false, icon: "-", note: "not applicable" },
            inApp: { enabled: true, icon: "✓" },
            notes: "Pickup successfully booked",
          },
          {
            event: "Password Reset",
            email: { enabled: true, icon: "✓" },
            sms: { enabled: false, icon: "-", note: "not applicable" },
            inApp: { enabled: false, icon: "X" },
            notes: "Not needed at MVP",
          },
          {
            event: "Failed Delivery Attempt",
            email: { enabled: false, icon: "🔒", note: "future/disabled" },
            sms: { enabled: false, icon: "🔒", note: "future/disabled" },
            inApp: { enabled: false, icon: "🔒", note: "future/disabled" },
            notes: "Future feature",
          },
          {
            event: "Payment Received",
            email: { enabled: false, icon: "-", note: "not applicable" },
            sms: { enabled: false, icon: "-", note: "not applicable" },
            inApp: { enabled: false, icon: "-", note: "not applicable" },
            notes: "Not needed at MVP",
          },
        ],
      };

      ResponseHandler.success(
        res,
        { userNotificationSettings },
        "User notification settings retrieved successfully"
      );
    } catch (error) {
      console.error("Get user notification settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update user notification settings
   */
  static async updateUserNotificationSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { notificationEvents } = req.body;

      // In a real app, this would be saved to a database
      const updatedSettings = {
        notificationEvents: notificationEvents || [],
      };

      ResponseHandler.updated(
        res,
        { userNotificationSettings: updatedSettings },
        "User notification settings updated successfully"
      );
    } catch (error) {
      console.error("Update user notification settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get admin notification settings
   */
  static async getAdminNotificationSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const adminNotificationSettings = {
        notificationEvents: [
          {
            event: "New User Sign-up (Merchant)",
            email: { enabled: false, icon: "X" },
            inApp: { enabled: true, icon: "✓" },
          },
          {
            event: "Pickup Request Error",
            email: { enabled: true, icon: "✓" },
            inApp: { enabled: true, icon: "✓" },
          },
          {
            event: "Bulk Import Failed (future)",
            email: { enabled: false, icon: "🔒" },
            inApp: { enabled: false, icon: "🔒" },
          },
          {
            event: "Payment Dispute Raised (future)",
            email: { enabled: false, icon: "🔒" },
            inApp: { enabled: false, icon: "🔒" },
          },
          {
            event: "Shipment Delivered/Status Update",
            email: { enabled: false, icon: "X" },
            inApp: { enabled: true, icon: "✓" },
          },
          {
            event: "New Pickup Request Submitted",
            email: { enabled: false, icon: "X" },
            inApp: { enabled: true, icon: "✓" },
          },
          {
            event: "Label Failed / Shipment Error",
            email: { enabled: true, icon: "✓" },
            inApp: { enabled: true, icon: "✓" },
          },
        ],
      };

      ResponseHandler.success(
        res,
        { adminNotificationSettings },
        "Admin notification settings retrieved successfully"
      );
    } catch (error) {
      console.error("Get admin notification settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update admin notification settings
   */
  static async updateAdminNotificationSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { notificationEvents } = req.body;

      // In a real app, this would be saved to a database
      const updatedSettings = {
        notificationEvents: notificationEvents || [],
      };

      ResponseHandler.updated(
        res,
        { adminNotificationSettings: updatedSettings },
        "Admin notification settings updated successfully"
      );
    } catch (error) {
      console.error("Update admin notification settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get notification activity data
   */
  static async getNotificationActivityData(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { period = "12months" } = req.query;

      const activityData = {
        period,
        chartData: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Successful",
              data: [
                2500, 3000, 3500, 4500, 5000, 4800, 5200, 5500, 5800, 6000,
                6200, 6500,
              ],
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
            },
            {
              label: "Failed",
              data: [
                200, 500, 800, 1200, 1000, 1500, 1800, 1600, 1400, 1200, 1000,
                800,
              ],
              borderColor: "#EF4444",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
            },
          ],
        },
      };

      ResponseHandler.success(
        res,
        { activityData },
        "Notification activity data retrieved successfully"
      );
    } catch (error) {
      console.error("Get notification activity data error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get delivery summary
   */
  static async getDeliverySummary(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const deliverySummary = {
        successful: 9876,
        failed: 123,
        pending: 45,
        total: 10044,
        successRate: 98.33,
      };

      ResponseHandler.success(
        res,
        { deliverySummary },
        "Delivery summary retrieved successfully"
      );
    } catch (error) {
      console.error("Get delivery summary error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get users for recipient selection
   */
  static async getUsersForRecipients(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const recipients = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Admin",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "Support",
        },
        {
          id: 3,
          name: "Mark Lee",
          email: "mark.lee@example.com",
          role: "Operations",
        },
        {
          id: 4,
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          role: "Sales",
        },
        {
          id: 5,
          name: "David Kim",
          email: "david.kim@example.com",
          role: "Manager",
        },
        {
          id: 6,
          name: "Emily White",
          email: "emily.white@example.com",
          role: "Logistics",
        },
      ];

      ResponseHandler.success(
        res,
        { recipients },
        "Recipients list retrieved successfully"
      );
    } catch (error) {
      console.error("Get users for recipients error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
