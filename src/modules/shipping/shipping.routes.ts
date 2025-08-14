import { Router } from "express";
import { ShippingController } from "./shipping.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Shipment and return management
 */

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments with pagination and filtering
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, outbound, return]
 *         description: Filter by shipment type
 *       - in: query
 *         name: carrier
 *         schema:
 *           type: string
 *         description: Filter by carrier
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: outboundId
 *         schema:
 *           type: string
 *         description: Filter by outbound shipment ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by shipment ID or tracking number
 *     responses:
 *       200:
 *         description: Shipments retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/", authenticateToken, ShippingController.getShipments);

/**
 * @swagger
 * /api/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipping]
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
 *         description: Shipment retrieved successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Authentication required
 */
router.get("/:id", authenticateToken, ShippingController.getShipmentById);

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create new shipment
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - package
 *             properties:
 *               origin:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               destination:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               package:
 *                 type: object
 *                 properties:
 *                   weight:
 *                     type: number
 *                   dimensions:
 *                     type: string
 *                   contents:
 *                     type: string
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/", authenticateToken, ShippingController.createShipment);

/**
 * @swagger
 * /api/shipments/{id}:
 *   put:
 *     summary: Update shipment
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Shipment updated successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Authentication required
 */
router.put("/:id", authenticateToken, ShippingController.updateShipment);

/**
 * @swagger
 * /api/shipments/{id}:
 *   delete:
 *     summary: Delete shipment
 *     tags: [Shipping]
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
 *         description: Shipment deleted successfully
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Authentication required
 */
router.delete("/:id", authenticateToken, ShippingController.deleteShipment);

/**
 * @swagger
 * /api/returns:
 *   get:
 *     summary: Get all returns
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Returns retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/returns", authenticateToken, ShippingController.getReturns);

/**
 * @swagger
 * /api/returns/{id}/original-shipment:
 *   get:
 *     summary: Get original shipment for return
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Return ID
 *     responses:
 *       200:
 *         description: Original shipment retrieved successfully
 *       404:
 *         description: Return not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/returns/:id/original-shipment",
  authenticateToken,
  ShippingController.getOriginalShipmentForReturn
);

/**
 * @swagger
 * /api/returns:
 *   post:
 *     summary: Create return shipment
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalShipmentId
 *               - reason
 *               - declaredValue
 *             properties:
 *               originalShipmentId:
 *                 type: string
 *               reason:
 *                 type: string
 *               declaredValue:
 *                 type: number
 *               package:
 *                 type: object
 *               insurance:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Return created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/returns", authenticateToken, ShippingController.createReturn);

/**
 * @swagger
 * /api/returns/rates:
 *   get:
 *     summary: Get return rates
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: declaredValue
 *         schema:
 *           type: number
 *         description: Declared value of the return
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         description: Origin address
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Destination address
 *     responses:
 *       200:
 *         description: Return rates retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/returns/rates",
  authenticateToken,
  ShippingController.getReturnRates
);

/**
 * @swagger
 * /api/shipments/{id}/tracking:
 *   get:
 *     summary: Get detailed shipment tracking information
 *     tags: [Shipping]
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
 *         description: Shipment tracking details retrieved successfully
 *       404:
 *         description: Shipment not found
 */
router.get(
  "/:id/tracking",
  authenticateToken,
  ShippingController.getShipmentTrackingDetails
);

/**
 * @swagger
 * /api/shipments/statistics:
 *   get:
 *     summary: Get shipment statistics and distribution
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shipment statistics retrieved successfully
 */
router.get(
  "/statistics",
  authenticateToken,
  ShippingController.getShipmentStatistics
);

/**
 * @swagger
 * /api/shipments/rates:
 *   post:
 *     summary: Calculate shipping rates
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - package
 *             properties:
 *               origin:
 *                 type: object
 *               destination:
 *                 type: object
 *               package:
 *                 type: object
 *               declaredValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Shipping rates calculated successfully
 */
router.post(
  "/rates",
  authenticateToken,
  ShippingController.calculateShippingRates
);

/**
 * @swagger
 * /api/shipments/payment:
 *   post:
 *     summary: Process payment and create label
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipmentData
 *               - paymentData
 *             properties:
 *               shipmentData:
 *                 type: object
 *               paymentData:
 *                 type: object
 *     responses:
 *       201:
 *         description: Payment processed and label created successfully
 */
router.post(
  "/payment",
  authenticateToken,
  ShippingController.processPaymentAndCreateLabel
);

/**
 * @swagger
 * /api/shipments/validate-address:
 *   post:
 *     summary: Validate address via EasyPost
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: object
 *     responses:
 *       200:
 *         description: Address validated successfully
 */
router.post(
  "/validate-address",
  authenticateToken,
  ShippingController.validateAddress
);

/**
 * @swagger
 * /api/shipments/support:
 *   post:
 *     summary: Contact support
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               shipmentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Support ticket created successfully
 */
router.post("/support", authenticateToken, ShippingController.contactSupport);

/**
 * @swagger
 * /api/shipments/carrier-options:
 *   get:
 *     summary: Get available carriers with rates and pickup options
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: object
 *         description: Origin address
 *       - in: query
 *         name: destination
 *         schema:
 *           type: object
 *         description: Destination address
 *       - in: query
 *         name: packageData
 *         schema:
 *           type: object
 *         description: Package information
 *     responses:
 *       200:
 *         description: Carrier options retrieved successfully
 */
router.get(
  "/carrier-options",
  authenticateToken,
  ShippingController.getCarrierOptions
);

/**
 * @swagger
 * /api/shipments/pickup:
 *   post:
 *     summary: Schedule pickup for shipment
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipmentId
 *               - pickupDate
 *               - pickupTimeSlot
 *             properties:
 *               shipmentId:
 *                 type: string
 *               pickupDate:
 *                 type: string
 *               pickupTimeSlot:
 *                 type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pickup scheduled successfully
 */
router.post(
  "/pickup",
  authenticateToken,
  ShippingController.schedulePickup
);

/**
 * @swagger
 * /api/shipments/{shipmentId}/success:
 *   get:
 *     summary: Get shipment success confirmation and label
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     responses:
 *       200:
 *         description: Shipment success details retrieved successfully
 */
router.get(
  "/:shipmentId/success",
  authenticateToken,
  ShippingController.getShipmentSuccess
);

/**
 * @swagger
 * /api/shipments/{shipmentId}/label:
 *   get:
 *     summary: Download shipment label
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           default: pdf
 *         description: Label format (pdf, png, etc.)
 *     responses:
 *       200:
 *         description: Label download URL generated successfully
 */
router.get(
  "/:shipmentId/label",
  authenticateToken,
  ShippingController.downloadShipmentLabel
);

export default router;
