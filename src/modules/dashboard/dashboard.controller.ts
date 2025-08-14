import { Request, Response } from "express";
import { User, Role } from "../../../db/models";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";
import { Op } from "sequelize";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class DashboardController {
  /**
   * Get summary statistics for the dashboard
   */
  static async getSummaryStatistics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // Total Accounts
      const totalAccounts = await User.count();

      // Active Merchants
      const merchantRole = await Role.findOne({ where: { name: "merchant" } });
      let activeMerchants = 0;
      if (merchantRole) {
        activeMerchants = await User.count({
          where: {
            roleId: merchantRole.id,
            isActive: true,
          },
        });
      }

      // Personal Shippers
      const personalRole = await Role.findOne({ where: { name: "user" } });
      let personalShippers = 0;
      if (personalRole) {
        personalShippers = await User.count({
          where: {
            roleId: personalRole.id,
            isActive: true,
          },
        });
      }

      // Total Revenue (Placeholder - requires a Transaction/Shipment model)
      const totalRevenue = 1200000; // $1.2M

      // Calculate trends (Placeholder)
      const totalAccountsLastMonth = 7727;
      const activeMerchantsLastMonth = 5714;
      const personalShippersNewSignupsLastPeriod = 2315;

      const totalAccountsChange =
        ((totalAccounts - totalAccountsLastMonth) / totalAccountsLastMonth) *
        100;
      const activeMerchantsChange =
        ((activeMerchants - activeMerchantsLastMonth) /
          activeMerchantsLastMonth) *
        100;
      const personalShippersChange =
        ((personalShippers - personalShippersNewSignupsLastPeriod) /
          personalShippersNewSignupsLastPeriod) *
        100;
      const totalRevenueChange = 15;

      ResponseHandler.success(
        res,
        {
          totalAccounts: {
            value: totalAccounts,
            change: `${totalAccountsChange.toFixed(0)}% from last month`,
          },
          activeMerchants: {
            value: activeMerchants,
            change: `${activeMerchantsChange.toFixed(0)}% from last month`,
          },
          personalShippers: {
            value: personalShippers,
            change: `${personalShippersChange.toFixed(0)}% in new sign-ups`,
          },
          totalRevenue: {
            value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
            change: `${totalRevenueChange}% year-to-date`,
          },
        },
        ResponseMessage.SUCCESS
      );
    } catch (error) {
      console.error("Get summary statistics error:", error);
      ResponseHandler.error(res, ResponseMessage.INTERNAL_ERROR);
    }
  }

  /**
   * Get admin dashboard overview
   */
  static async getAdminDashboardOverview(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const dashboardOverview = {
        keyMetrics: {
          totalShipments: {
            value: 12450,
            change: "+12% vs last month",
            icon: "📦",
          },
          pickupRequests: {
            value: 8001,
            change: "+5% vs last month",
            icon: "🚚",
          },
          revenueFromMarkups: {
            value: "$85,780",
            change: "+8.2% vs last month",
            icon: "💰",
          },
          openAlerts: {
            value: 7,
            change: "2 new today",
            icon: "⚠️",
          },
        },
        quickInsights: {
          shipmentsToday: {
            title: "Shipments Today",
            description:
              "Total shipments created today (outbound + returns) - 38",
            action: "View all shipments",
          },
          newUsersToday: {
            title: "New Users Today",
            description: "Merchants or personal accounts created today - 14",
          },
          revenueToday: {
            title: "Revenue Today",
            description: "Total revenue from markups - $1,154.00",
          },
        },
      };

      ResponseHandler.success(
        res,
        { dashboardOverview },
        "Admin dashboard overview retrieved successfully"
      );
    } catch (error) {
      console.error("Get admin dashboard overview error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get revenue chart data
   */
  static async getRevenueChartData(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { period = "6months" } = req.query;

      const revenueData = {
        period,
        title: "Monthly revenue generated from shipping markups",
        chartData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Revenue (CAD)",
              data: [45000, 52000, 58000, 62000, 68000, 72000],
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              fill: true,
            },
          ],
        },
        yAxis: {
          min: 0,
          max: 100000,
          stepSize: 20000,
        },
      };

      ResponseHandler.success(
        res,
        { revenueData },
        "Revenue chart data retrieved successfully"
      );
    } catch (error) {
      console.error("Get revenue chart data error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get shipment volume chart data
   */
  static async getShipmentVolumeChartData(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { period = "6months" } = req.query;

      const shipmentData = {
        period,
        title: "Total shipments processed over time",
        chartData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Shipments",
              data: [8500, 9200, 9800, 10500, 11200, 11800],
              borderColor: "#EC4899",
              backgroundColor: "rgba(236, 72, 153, 0.2)",
              fill: true,
            },
          ],
        },
        yAxis: {
          min: 0,
          max: 14000,
          stepSize: 2000,
        },
      };

      ResponseHandler.success(
        res,
        { shipmentData },
        "Shipment volume chart data retrieved successfully"
      );
    } catch (error) {
      console.error("Get shipment volume chart data error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get pickup requests chart data
   */
  static async getPickupRequestsChartData(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { period = "8months" } = req.query;

      const pickupData = {
        period,
        title: "Total pickup requests overtime",
        chartData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Pickup Requests",
              data: [12000, 13500, 14600, 15800, 14200, 16500, 17200, 18000],
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: false,
            },
          ],
        },
        yAxis: {
          min: 0,
          max: 17500,
          stepSize: 2500,
        },
      };

      ResponseHandler.success(
        res,
        { pickupData },
        "Pickup requests chart data retrieved successfully"
      );
    } catch (error) {
      console.error("Get pickup requests chart data error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get recent alerts
   */
  static async getRecentAlerts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const recentAlerts = [
        {
          id: 1,
          message: "Label generation failed for shipment GLV7890",
          timestamp: "2 hours ago",
          type: "warning",
          icon: "⚠️",
        },
        {
          id: 2,
          message: "Payment processing delayed for vendor account 123",
          timestamp: "5 hours ago",
          type: "info",
          icon: "ℹ️",
        },
        {
          id: 3,
          message: "New tracking update available for shipment GLV7891",
          timestamp: "1 day ago",
          type: "info",
          icon: "ℹ️",
        },
        {
          id: 4,
          message: "High volume alert: East warehouse",
          timestamp: "1 day ago",
          type: "warning",
          icon: "⚠️",
        },
      ];

      ResponseHandler.success(
        res,
        { recentAlerts },
        "Recent alerts retrieved successfully"
      );
    } catch (error) {
      console.error("Get recent alerts error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const recentActivity = [
        {
          id: 1,
          type: "shipment_delivered",
          message: "Shipment GLV9001 delivered to client Alpha",
          timestamp: "2 mins ago",
          icon: "✅",
          color: "green",
        },
        {
          id: 2,
          type: "label_failed",
          message: "Automated label for GLV9002 failed generation",
          timestamp: "15 mins ago",
          icon: "❌",
          color: "red",
        },
        {
          id: 3,
          type: "payment_processed",
          message: "Received payment for invoice INV2024-005 from Beta Corp",
          timestamp: "30 mins ago",
          icon: "📄",
          color: "blue",
        },
        {
          id: 4,
          type: "new_shipment",
          message: "New express shipment GLV9003 created",
          timestamp: "1 hour ago",
          icon: "📦",
          color: "purple",
        },
        {
          id: 5,
          type: "customer_feedback",
          message: "Customer feedback received",
          timestamp: "2 hours ago",
          icon: "💬",
          color: "orange",
        },
      ];

      ResponseHandler.success(
        res,
        { recentActivity },
        "Recent activity retrieved successfully"
      );
    } catch (error) {
      console.error("Get recent activity error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Track shipment
   */
  static async trackShipment(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { shipmentId } = req.body;

      // In a real app, this would query the shipment tracking system
      const trackingInfo = {
        shipmentId,
        status: "In Transit",
        currentLocation: "Toronto, ON",
        estimatedDelivery: "2024-01-15",
        trackingHistory: [
          {
            timestamp: "2024-01-10 14:30",
            location: "Vancouver, BC",
            status: "Picked up",
            description: "Package picked up from sender",
          },
          {
            timestamp: "2024-01-11 09:15",
            location: "Vancouver, BC",
            status: "In Transit",
            description: "Package departed from origin facility",
          },
          {
            timestamp: "2024-01-12 16:45",
            location: "Toronto, ON",
            status: "In Transit",
            description: "Package arrived at destination facility",
          },
        ],
      };

      ResponseHandler.success(
        res,
        { trackingInfo },
        "Shipment tracking information retrieved successfully"
      );
    } catch (error) {
      console.error("Track shipment error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get audit logs
   */
  static async getAuditLogs(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        userId,
        eventType,
      } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      // In a real app, this would query an audit logs table
      const auditLogs = [
        {
          id: 1,
          timestamp: "2025-07-29 10:15 AM",
          event: "User Alice updated security preferences",
          user: "Alice",
          eventType: "security_update",
        },
        {
          id: 2,
          timestamp: "2025-07-29 08:30 AM",
          event: "Successful login from IP 203.0.113.45",
          user: "Admin John",
          eventType: "login",
        },
        {
          id: 3,
          timestamp: "2025-07-28 11:45 AM",
          event: "Password changed by user Jane",
          user: "Jane",
          eventType: "password_change",
        },
        {
          id: 4,
          timestamp: "2025-07-28 09:00 AM",
          event: "System audit initiated by Admin",
          user: "System",
          eventType: "system_audit",
        },
        {
          id: 5,
          timestamp: "2025-07-27 16:20 PM",
          event: "Two-factor authentication disabled",
          user: "Admin Bob",
          eventType: "security_update",
        },
        {
          id: 6,
          timestamp: "2025-07-27 10:05 AM",
          event: "Failed login attempt from IP 198.51.100.22",
          user: "Guest",
          eventType: "failed_login",
        },
        {
          id: 7,
          timestamp: "2025-07-26 14:00 PM",
          event: "New IP address added to whitelist",
          user: "Admin Alice",
          eventType: "security_update",
        },
      ];

      const total = auditLogs.length;
      const paginatedLogs = auditLogs.slice(offset, offset + Number(limit));

      const meta = ResponseHandler.calculatePaginationMeta(
        Number(page),
        Number(limit),
        total
      );

      ResponseHandler.paginated(
        res,
        paginatedLogs,
        meta,
        "Audit logs retrieved successfully"
      );
    } catch (error) {
      console.error("Get audit logs error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get welcome dashboard data for merchant
   */
  static async getWelcomeDashboard(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "role" }],
      });

      if (!user) {
        ResponseHandler.notFound(res, ResponseMessage.NOT_FOUND);
        return;
      }

      const firstName = user.fullName.split(" ")[0];

      // Mock welcome dashboard data
      const welcomeDashboard = {
        user: {
          firstName,
          fullName: user.fullName,
          companyName: user.companyName,
        },
        welcomeMessage: `Welcome to GlenvoShip, ${firstName}`,
        description:
          "Ready to manage your shipments? Easily create, track, and schedule pickups — all from one place. Enjoy exclusive discounted rates and start saving on every shipment.",
        kpis: {
          shipmentsToday: {
            value: 1234,
            change: "+15% from last month",
            trend: "positive",
            icon: "📦",
          },
          pendingShipments: {
            value: 23,
            change: "-5% from last week",
            trend: "negative",
            icon: "⏰",
          },
        },
        recentShipments: [
          {
            trackingId: "TRK1001",
            destination: "New York, USA",
            status: "Delivered",
            date: "2024-07-28",
            cost: 45.0,
          },
          {
            trackingId: "TRK1002",
            destination: "Los Angeles, USA",
            status: "In Transit",
            date: "2024-07-28",
            cost: 32.5,
          },
          {
            trackingId: "TRK1003",
            destination: "Chicago, USA",
            status: "Pending",
            date: "2024-07-28",
            cost: 28.75,
          },
          {
            trackingId: "TRK1004",
            destination: "Miami, USA",
            status: "Exception",
            date: "2024-07-28",
            cost: 55.0,
          },
          {
            trackingId: "TRK1005",
            destination: "Seattle, USA",
            status: "Delivered",
            date: "2024-07-28",
            cost: 41.25,
          },
          {
            trackingId: "TRK1006",
            destination: "Denver, USA",
            status: "In Transit",
            date: "2024-07-28",
            cost: 38.9,
          },
        ],
        quickActions: [
          "Account Settings",
          "Payment information",
          "Create Shipments",
          "Manage Shipments",
          "Help & Support",
        ],
      };

      ResponseHandler.success(
        res,
        { welcomeDashboard },
        "Welcome dashboard data retrieved successfully"
      );
    } catch (error) {
      console.error("Get welcome dashboard error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get help and support information
   */
  static async getHelpSupport(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const helpSupport = {
        faqUrl: "https://www.glenvoship.com/support",
        supportEmail: "support@glenvoship.com",
        contactOptions: [
          {
            type: "FAQ",
            description: "Frequently Asked Questions",
            url: "https://www.glenvoship.com/support",
          },
          {
            type: "Email Support",
            description: "Send an email to support",
            email: "support@glenvoship.com",
          },
        ],
        developerNote:
          "When a user clicks the Help & Support tab in the dashboard and selects FAQ option, redirect them to: https://www.glenvoship.com/support This will serve as the central FAQ and support resource, hosted on the WordPress landing page.",
      };

      ResponseHandler.success(
        res,
        { helpSupport },
        "Help and support information retrieved successfully"
      );
    } catch (error) {
      console.error("Get help support error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
