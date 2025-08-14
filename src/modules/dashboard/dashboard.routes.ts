import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and insights
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get summary statistics for the dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Operation completed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAccounts:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: integer
 *                           example: 8500
 *                         change:
 *                           type: string
 *                           example: "+10% from last month"
 *                     activeMerchants:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: integer
 *                           example: 6000
 *                         change:
 *                           type: string
 *                           example: "+5% from last month"
 *                     personalShippers:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: integer
 *                           example: 2500
 *                         change:
 *                           type: string
 *                           example: "+8% in new sign-ups"
 *                     totalRevenue:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: string
 *                           example: "$1.2M"
 *                         change:
 *                           type: string
 *                           example: "+15% year-to-date"
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/summary",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.getSummaryStatistics
);

/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Get admin dashboard metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard metrics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalShipments:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: integer
 *                           example: 12450
 *                         change:
 *                           type: string
 *                           example: "+12% vs last month"
 *                     pickupRequests:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: integer
 *                           example: 8001
 *                         change:
 *                           type: string
 *                           example: "+5% vs last month"
 *                     revenueFromMarkups:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 85780
 *                         change:
 *                           type: string
 *                           example: "+8.2% vs last month"
 *                     openAlerts:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: integer
 *                           example: 7
 *                         newToday:
 *                           type: integer
 *                           example: 2
 *                     shipmentsToday:
 *                       type: integer
 *                       example: 38
 *                     newUsersToday:
 *                       type: integer
 *                       example: 14
 *                     revenueToday:
 *                       type: number
 *                       example: 1154.00
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/metrics",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.getAdminDashboardOverview
);

/**
 * @swagger
 * /api/dashboard/charts/revenue:
 *   get:
 *     summary: Get revenue chart data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue chart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Revenue chart data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chartData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "Jan"
 *                           revenue:
 *                             type: number
 *                             example: 50000
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/charts/revenue",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.getRevenueChartData
);

/**
 * @swagger
 * /api/dashboard/charts/shipment-volume:
 *   get:
 *     summary: Get shipment volume chart data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shipment volume chart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Shipment volume chart data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chartData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "Jan"
 *                           volume:
 *                             type: number
 *                             example: 7000
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/charts/shipment-volume",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.getShipmentVolumeChartData
);

/**
 * @swagger
 * /api/dashboard/charts/pickup-requests:
 *   get:
 *     summary: Get pickup requests chart data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pickup requests chart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pickup requests chart data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chartData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "Jan"
 *                           requests:
 *                             type: number
 *                             example: 10000
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/charts/pickup-requests",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.getPickupRequestsChartData
);

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get recent alerts
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of alerts to return
 *     responses:
 *       200:
 *         description: Recent alerts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recent alerts retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     alerts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           message:
 *                             type: string
 *                           timestamp:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [warning, info, error]
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/alerts",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.getRecentAlerts
);

/**
 * @swagger
 * /api/activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of activities to return
 *     responses:
 *       200:
 *         description: Recent activity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recent activity retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           type:
 *                             type: string
 *                           description:
 *                             type: string
 *                           timestamp:
 *                             type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/activity",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.getRecentActivity
);

/**
 * @swagger
 * /api/dashboard/welcome:
 *   get:
 *     summary: Get welcome dashboard data for merchant
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome dashboard data retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/welcome",
  authenticateToken,
  DashboardController.getWelcomeDashboard
);

/**
 * @swagger
 * /api/dashboard/help-support:
 *   get:
 *     summary: Get help and support information
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Help and support information retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/help-support",
  authenticateToken,
  DashboardController.getHelpSupport
);

/**
 * @swagger
 * /api/shipments/track/{id}:
 *   get:
 *     summary: Track a shipment
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     responses:
 *       200:
 *         description: Shipment tracking information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Shipment tracking information retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         status:
 *                           type: string
 *                         origin:
 *                           type: string
 *                         destination:
 *                           type: string
 *                         trackingHistory:
 *                           type: array
 *                           items:
 *                             type: object
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       404:
 *         $ref: '#/components/schemas/NotFound'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/shipments/track/:id",
  authenticateToken,
  requireRole(["admin"]),
  DashboardController.trackShipment
);

export default router;
