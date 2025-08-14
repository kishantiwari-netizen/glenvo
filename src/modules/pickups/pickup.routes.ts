import { Router } from "express";
import { PickupController } from "./pickup.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pickups
 *   description: Pickup requests management
 */

/**
 * @swagger
 * /api/pickups:
 *   get:
 *     summary: Get all pickup requests with pagination and filtering
 *     tags: [Pickups]
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
 *         name: dateRange
 *         schema:
 *           type: string
 *         description: Date range filter
 *       - in: query
 *         name: carrier
 *         schema:
 *           type: string
 *         description: Filter by carrier
 *       - in: query
 *         name: merchant
 *         schema:
 *           type: string
 *         description: Filter by merchant
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by pickup ID, tracking number, or merchant name
 *     responses:
 *       200:
 *         description: Pickup requests retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/", authenticateToken, PickupController.getPickups);

/**
 * @swagger
 * /api/pickups/{id}:
 *   get:
 *     summary: Get pickup request by ID
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pickup ID
 *     responses:
 *       200:
 *         description: Pickup request retrieved successfully
 *       404:
 *         description: Pickup request not found
 *       401:
 *         description: Authentication required
 */
router.get("/:id", authenticateToken, PickupController.getPickupById);

/**
 * @swagger
 * /api/pickups:
 *   post:
 *     summary: Create new pickup request
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchant
 *               - carrier
 *               - pickupDate
 *               - pickupTime
 *               - location
 *             properties:
 *               merchant:
 *                 type: string
 *               carrier:
 *                 type: string
 *               pickupDate:
 *                 type: string
 *                 format: date
 *               pickupTime:
 *                 type: string
 *               location:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               specialInstructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pickup request created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/", authenticateToken, PickupController.createPickup);

/**
 * @swagger
 * /api/pickups/{id}:
 *   put:
 *     summary: Update pickup request
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pickup ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pickup request updated successfully
 *       404:
 *         description: Pickup request not found
 *       401:
 *         description: Authentication required
 */
router.put("/:id", authenticateToken, PickupController.updatePickup);

/**
 * @swagger
 * /api/pickups/{id}:
 *   delete:
 *     summary: Delete pickup request
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pickup ID
 *     responses:
 *       200:
 *         description: Pickup request deleted successfully
 *       404:
 *         description: Pickup request not found
 *       401:
 *         description: Authentication required
 */
router.delete("/:id", authenticateToken, PickupController.deletePickup);

/**
 * @swagger
 * /api/pickups/refresh:
 *   post:
 *     summary: Refresh pickup data from EasyPost
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pickup data refreshed successfully
 *       401:
 *         description: Authentication required
 */
router.post(
  "/refresh",
  authenticateToken,
  requireRole(["admin"]),
  PickupController.refreshPickupData
);

/**
 * @swagger
 * /api/pickups/statistics:
 *   get:
 *     summary: Get pickup statistics
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pickup statistics retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/statistics",
  authenticateToken,
  requireRole(["admin"]),
  PickupController.getPickupStatistics
);

export default router;
