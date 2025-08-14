import { Router } from "express";
import { NotificationsController } from "./notifications.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification preferences and delivery management endpoints
 */

/**
 * @swagger
 * /api/notifications/config:
 *   get:
 *     summary: Get notification configuration
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification configuration retrieved successfully
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
 *                   example: Notification configuration retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     notificationConfig:
 *                       type: object
 *                       properties:
 *                         alertConfiguration:
 *                           type: object
 *                           properties:
 *                             communicationChannels:
 *                               type: object
 *                               properties:
 *                                 enableEmailAlerts:
 *                                   type: boolean
 *                                 enableSmsAlerts:
 *                                   type: boolean
 *                             alertRecipients:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   name:
 *                                     type: string
 *                                   role:
 *                                     type: string
 *                                   selected:
 *                                     type: boolean
 *                         notificationActivity:
 *                           type: object
 *                           properties:
 *                             description:
 *                               type: string
 *                             chartData:
 *                               type: object
 *                         deliverySummary:
 *                           type: object
 *                           properties:
 *                             successful:
 *                               type: integer
 *                             failed:
 *                               type: integer
 *                             pending:
 *                               type: integer
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/config",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.getNotificationConfig
);

/**
 * @swagger
 * /api/notifications/config:
 *   put:
 *     summary: Update notification configuration
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alertConfiguration:
 *                 type: object
 *                 properties:
 *                   communicationChannels:
 *                     type: object
 *                     properties:
 *                       enableEmailAlerts:
 *                         type: boolean
 *                       enableSmsAlerts:
 *                         type: boolean
 *                   alertRecipients:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         selected:
 *                           type: boolean
 *     responses:
 *       200:
 *         description: Notification configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Updated'
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.put(
  "/config",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.updateNotificationConfig
);

/**
 * @swagger
 * /api/notifications/user-settings:
 *   get:
 *     summary: Get user notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User notification settings retrieved successfully
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
 *                   example: User notification settings retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userNotificationSettings:
 *                       type: object
 *                       properties:
 *                         notificationEvents:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               event:
 *                                 type: string
 *                               email:
 *                                 type: object
 *                                 properties:
 *                                   enabled:
 *                                     type: boolean
 *                                   icon:
 *                                     type: string
 *                               sms:
 *                                 type: object
 *                                 properties:
 *                                   enabled:
 *                                     type: boolean
 *                                   icon:
 *                                     type: string
 *                                   note:
 *                                     type: string
 *                               inApp:
 *                                 type: object
 *                                 properties:
 *                                   enabled:
 *                                     type: boolean
 *                                   icon:
 *                                     type: string
 *                               notes:
 *                                 type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/user-settings",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.getUserNotificationSettings
);

/**
 * @swagger
 * /api/notifications/user-settings:
 *   put:
 *     summary: Update user notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationEvents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: string
 *                     email:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *                     sms:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *                     inApp:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *     responses:
 *       200:
 *         description: User notification settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Updated'
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.put(
  "/user-settings",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.updateUserNotificationSettings
);

/**
 * @swagger
 * /api/notifications/admin-settings:
 *   get:
 *     summary: Get admin notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin notification settings retrieved successfully
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
 *                   example: Admin notification settings retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     adminNotificationSettings:
 *                       type: object
 *                       properties:
 *                         notificationEvents:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               event:
 *                                 type: string
 *                               email:
 *                                 type: object
 *                                 properties:
 *                                   enabled:
 *                                     type: boolean
 *                                   icon:
 *                                     type: string
 *                               inApp:
 *                                 type: object
 *                                 properties:
 *                                   enabled:
 *                                     type: boolean
 *                                   icon:
 *                                     type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/admin-settings",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.getAdminNotificationSettings
);

/**
 * @swagger
 * /api/notifications/admin-settings:
 *   put:
 *     summary: Update admin notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationEvents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: string
 *                     email:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *                     inApp:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *     responses:
 *       200:
 *         description: Admin notification settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Updated'
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.put(
  "/admin-settings",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.updateAdminNotificationSettings
);

/**
 * @swagger
 * /api/notifications/activity-data:
 *   get:
 *     summary: Get notification activity data
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           default: "12months"
 *           enum: [1month, 3months, 6months, 12months]
 *         description: Time period for activity data
 *     responses:
 *       200:
 *         description: Notification activity data retrieved successfully
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
 *                   example: Notification activity data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     activityData:
 *                       type: object
 *                       properties:
 *                         period:
 *                           type: string
 *                         chartData:
 *                           type: object
 *                           properties:
 *                             labels:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             datasets:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   label:
 *                                     type: string
 *                                   data:
 *                                     type: array
 *                                     items:
 *                                       type: integer
 *                                   borderColor:
 *                                     type: string
 *                                   backgroundColor:
 *                                     type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/activity-data",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.getNotificationActivityData
);

/**
 * @swagger
 * /api/notifications/delivery-summary:
 *   get:
 *     summary: Get delivery summary
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery summary retrieved successfully
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
 *                   example: Delivery summary retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     deliverySummary:
 *                       type: object
 *                       properties:
 *                         successful:
 *                           type: integer
 *                           example: 9876
 *                         failed:
 *                           type: integer
 *                           example: 123
 *                         pending:
 *                           type: integer
 *                           example: 45
 *                         total:
 *                           type: integer
 *                           example: 10044
 *                         successRate:
 *                           type: number
 *                           example: 98.33
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/delivery-summary",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.getDeliverySummary
);

/**
 * @swagger
 * /api/notifications/recipients:
 *   get:
 *     summary: Get users for recipient selection
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recipients list retrieved successfully
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
 *                   example: Recipients list retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/recipients",
  authenticateToken,
  requireRole(["admin"]),
  NotificationsController.getUsersForRecipients
);

export default router;
