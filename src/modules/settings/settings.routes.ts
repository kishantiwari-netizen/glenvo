import { Router } from "express";
import { SettingsController } from "./settings.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System settings and configuration endpoints
 */

/**
 * @swagger
 * /api/settings/security:
 *   get:
 *     summary: Get security settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Security settings retrieved successfully
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
 *                   example: Security settings retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     securitySettings:
 *                       type: object
 *                       properties:
 *                         authentication:
 *                           type: object
 *                           properties:
 *                             requireLogin:
 *                               type: boolean
 *                             description:
 *                               type: string
 *                         passwordPolicy:
 *                           type: object
 *                           properties:
 *                             minLength:
 *                               type: integer
 *                             requireNumbers:
 *                               type: boolean
 *                             description:
 *                               type: string
 *                         twoFactorAuth:
 *                           type: object
 *                           properties:
 *                             enabled:
 *                               type: boolean
 *                             description:
 *                               type: string
 *                         sessionTimeout:
 *                           type: object
 *                           properties:
 *                             duration:
 *                               type: integer
 *                             description:
 *                               type: string
 *                         emailSecurityFooter:
 *                           type: object
 *                           properties:
 *                             enabled:
 *                               type: boolean
 *                             content:
 *                               type: string
 *                             description:
 *                               type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/security",
  authenticateToken,
  requireRole(["admin"]),
  SettingsController.getSecuritySettings
);

/**
 * @swagger
 * /api/settings/security:
 *   put:
 *     summary: Update security settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authentication:
 *                 type: object
 *                 properties:
 *                   requireLogin:
 *                     type: boolean
 *               passwordPolicy:
 *                 type: object
 *                 properties:
 *                   minLength:
 *                     type: integer
 *                   requireNumbers:
 *                     type: boolean
 *               twoFactorAuth:
 *                 type: object
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *               sessionTimeout:
 *                 type: object
 *                 properties:
 *                   duration:
 *                     type: integer
 *               emailSecurityFooter:
 *                 type: object
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                   content:
 *                     type: string
 *     responses:
 *       200:
 *         description: Security settings updated successfully
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
  "/security",
  authenticateToken,
  requireRole(["admin"]),
  SettingsController.updateSecuritySettings
);

/**
 * @swagger
 * /api/settings/company-profile:
 *   get:
 *     summary: Get company profile settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company profile settings retrieved successfully
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
 *                   example: Company profile settings retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     companySettings:
 *                       type: object
 *                       properties:
 *                         companyInfo:
 *                           type: object
 *                           properties:
 *                             platformName:
 *                               type: string
 *                             supportEmail:
 *                               type: string
 *                             supportPhone:
 *                               type: string
 *                         preferences:
 *                           type: object
 *                           properties:
 *                             timezone:
 *                               type: string
 *                             dateFormat:
 *                               type: string
 *                             currency:
 *                               type: string
 *                         notificationPreferences:
 *                           type: object
 *                           properties:
 *                             emailNotifications:
 *                               type: boolean
 *                             smsNotifications:
 *                               type: boolean
 *                             inAppNotifications:
 *                               type: boolean
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/company-profile",
  authenticateToken,
  requireRole(["admin"]),
  SettingsController.getCompanyProfileSettings
);

/**
 * @swagger
 * /api/settings/company-profile:
 *   put:
 *     summary: Update company profile settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyInfo:
 *                 type: object
 *                 properties:
 *                   platformName:
 *                     type: string
 *                   supportEmail:
 *                     type: string
 *                   supportPhone:
 *                     type: string
 *               preferences:
 *                 type: object
 *                 properties:
 *                   timezone:
 *                     type: string
 *                   dateFormat:
 *                     type: string
 *                   currency:
 *                     type: string
 *               notificationPreferences:
 *                 type: object
 *                 properties:
 *                   emailNotifications:
 *                     type: boolean
 *                   smsNotifications:
 *                     type: boolean
 *                   inAppNotifications:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Company profile settings updated successfully
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
  "/company-profile",
  authenticateToken,
  requireRole(["admin"]),
  SettingsController.updateCompanyProfileSettings
);

/**
 * @swagger
 * /api/settings/integrations:
 *   get:
 *     summary: Get integration settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Integration settings retrieved successfully
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
 *                   example: Integration settings retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     integrationSettings:
 *                       type: object
 *                       properties:
 *                         easyPost:
 *                           type: object
 *                           properties:
 *                             testApiKey:
 *                               type: string
 *                             liveApiKey:
 *                               type: string
 *                             webhookUrl:
 *                               type: string
 *                             status:
 *                               type: string
 *                         stripe:
 *                           type: object
 *                           properties:
 *                             testApiKey:
 *                               type: string
 *                             liveApiKey:
 *                               type: string
 *                             webhookUrl:
 *                               type: string
 *                             status:
 *                               type: string
 *                             billingCycle:
 *                               type: string
 *                             enablePayments:
 *                               type: boolean
 *                         sendGrid:
 *                           type: object
 *                           properties:
 *                             testApiKey:
 *                               type: string
 *                             liveApiKey:
 *                               type: string
 *                             webhookUrl:
 *                               type: string
 *                             status:
 *                               type: string
 *                         directCarriers:
 *                           type: object
 *                           properties:
 *                             available:
 *                               type: boolean
 *                             description:
 *                               type: string
 *                             availability:
 *                               type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
  "/integrations",
  authenticateToken,
  requireRole(["admin"]),
  SettingsController.getIntegrationSettings
);

/**
 * @swagger
 * /api/settings/integrations:
 *   put:
 *     summary: Update integration settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               easyPost:
 *                 type: object
 *                 properties:
 *                   testApiKey:
 *                     type: string
 *                   liveApiKey:
 *                     type: string
 *                   webhookUrl:
 *                     type: string
 *               stripe:
 *                 type: object
 *                 properties:
 *                   testApiKey:
 *                     type: string
 *                   liveApiKey:
 *                     type: string
 *                   webhookUrl:
 *                     type: string
 *                   billingCycle:
 *                     type: string
 *                   enablePayments:
 *                     type: boolean
 *               sendGrid:
 *                 type: object
 *                 properties:
 *                   testApiKey:
 *                     type: string
 *                   liveApiKey:
 *                     type: string
 *                   webhookUrl:
 *                     type: string
 *     responses:
 *       200:
 *         description: Integration settings updated successfully
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
  "/integrations",
  authenticateToken,
  requireRole(["admin"]),
  SettingsController.updateIntegrationSettings
);

/**
 * @swagger
 * /api/settings/integrations/{integrationType}/test:
 *   post:
 *     summary: Test integration connection
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: integrationType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [easyPost, stripe, sendGrid]
 *         description: Type of integration to test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: API key to test
 *     responses:
 *       200:
 *         description: Integration connection test completed
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
 *                   example: EasyPost connection test completed
 *                 data:
 *                   type: object
 *                   properties:
 *                     testResults:
 *                       type: object
 *                       properties:
 *                         integrationType:
 *                           type: string
 *                         status:
 *                           type: string
 *                         message:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *       401:
 *         $ref: '#/components/schemas/Unauthorized'
 *       403:
 *         $ref: '#/components/schemas/Forbidden'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
router.post(
  "/integrations/:integrationType/test",
  authenticateToken,
  requireRole(["admin"]),
  SettingsController.testIntegrationConnection
);

export default router;
