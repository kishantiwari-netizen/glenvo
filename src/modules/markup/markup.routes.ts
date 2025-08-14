import { Router } from "express";
import { MarkupController } from "./markup.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Markup
 *   description: Markup configuration and calculation endpoints
 */

/**
 * @swagger
 * /api/markup/carriers:
 *   get:
 *     summary: Get carrier markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrier markup configuration retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get(
  "/carriers",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.getMarkupConfig
);

/**
 * @swagger
 * /api/markup/carriers:
 *   post:
 *     summary: Create carrier markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carrier
 *               - baseCurrency
 *               - conversionRate
 *               - markupType
 *               - markupValue
 *             properties:
 *               carrier:
 *                 type: string
 *                 enum: [Canada Post, FedEx, UPS, DHL]
 *               baseCurrency:
 *                 type: string
 *                 enum: [USD, CAD]
 *               conversionRate:
 *                 type: number
 *               markupType:
 *                 type: string
 *                 enum: [Flat, %]
 *               markupValue:
 *                 type: number
 *     responses:
 *       201:
 *         description: Carrier markup configuration created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.post(
  "/carriers",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.addCarrierMarkup
);

/**
 * @swagger
 * /api/markup/carriers/{id}:
 *   put:
 *     summary: Update carrier markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carrier:
 *                 type: string
 *               baseCurrency:
 *                 type: string
 *               conversionRate:
 *                 type: number
 *               markupType:
 *                 type: string
 *               markupValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Carrier markup configuration updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Carrier markup not found
 */
router.put(
  "/carriers/:id",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.updateCarrierMarkup
);

/**
 * @swagger
 * /api/markup/carriers/{id}:
 *   delete:
 *     summary: Delete carrier markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrier markup configuration deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Carrier markup not found
 */
router.delete(
  "/carriers/:id",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.deleteCarrierMarkup
);

/**
 * @swagger
 * /api/markup/pickup:
 *   get:
 *     summary: Get pickup markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pickup markup configuration retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get(
  "/pickup",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.getMarkupConfig
);

/**
 * @swagger
 * /api/markup/pickup:
 *   post:
 *     summary: Create pickup markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carrier
 *               - baseCurrency
 *               - conversionRate
 *               - markupType
 *               - markupValue
 *             properties:
 *               carrier:
 *                 type: string
 *               baseCurrency:
 *                 type: string
 *               conversionRate:
 *                 type: number
 *               markupType:
 *                 type: string
 *               markupValue:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pickup markup configuration created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.post(
  "/pickup",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.addPickupMarkup
);

/**
 * @swagger
 * /api/markup/pickup/{id}:
 *   put:
 *     summary: Update pickup markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carrier:
 *                 type: string
 *               baseCurrency:
 *                 type: string
 *               conversionRate:
 *                 type: number
 *               markupType:
 *                 type: string
 *               markupValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pickup markup configuration updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Pickup markup not found
 */
router.put(
  "/pickup/:id",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.updatePickupMarkup
);

/**
 * @swagger
 * /api/markup/pickup/{id}:
 *   delete:
 *     summary: Delete pickup markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pickup markup configuration deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Pickup markup not found
 */
router.delete(
  "/pickup/:id",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.deletePickupMarkup
);

/**
 * @swagger
 * /api/markup/insurance:
 *   get:
 *     summary: Get global insurance markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Global insurance markup configuration retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get(
  "/insurance",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.getMarkupConfig
);

/**
 * @swagger
 * /api/markup/insurance:
 *   put:
 *     summary: Update global insurance markup configuration
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - markupSource
 *               - type
 *               - conversionRate
 *               - markupPercentage
 *             properties:
 *               markupSource:
 *                 type: string
 *               type:
 *                 type: string
 *               conversionRate:
 *                 type: number
 *               markupPercentage:
 *                 type: number
 *     responses:
 *       200:
 *         description: Global insurance markup configuration updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.put(
  "/insurance",
  authenticateToken,
  requireRole(["admin"]),
  MarkupController.updateMarkupConfig
);

/**
 * @swagger
 * /api/markup/calculate:
 *   post:
 *     summary: Calculate markup fees
 *     tags: [Markup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - baseFee
 *               - baseCurrency
 *               - conversionRate
 *               - carrierMarkup
 *               - declaredValue
 *               - insuranceMarkup
 *               - pickupBaseFee
 *               - pickupMarkup
 *             properties:
 *               baseFee:
 *                 type: number
 *               baseCurrency:
 *                 type: string
 *               conversionRate:
 *                 type: number
 *               carrierMarkup:
 *                 type: number
 *               declaredValue:
 *                 type: number
 *               insuranceMarkup:
 *                 type: number
 *               pickupBaseFee:
 *                 type: number
 *               pickupMarkup:
 *                 type: number
 *     responses:
 *       200:
 *         description: Markup calculation completed successfully
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
 *                   example: Markup calculation completed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     carrierFee:
 *                       type: number
 *                       example: 141.75
 *                     insuranceFee:
 *                       type: number
 *                       example: 6.25
 *                     pickupFee:
 *                       type: number
 *                       example: 37.13
 *                     totalFee:
 *                       type: number
 *                       example: 185.13
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post(
  "/calculate",
  authenticateToken,
  MarkupController.calculateMarkupSimulation
);

export default router;
