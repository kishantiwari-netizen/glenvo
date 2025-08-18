import { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import {
  getAllSubAccounts,
  getSubAccountByUserId,
  createOrRecreateSubAccount,
  getSubAccountStats,
  validateSubAccount,
} from "./admin.controller";

const router = Router();

/**
 * @swagger
 * /api/admin/sub-accounts:
 *   get:
 *     summary: Get all EasyPost sub-accounts
 *     description: Retrieve all EasyPost sub-accounts for centralized management
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sub-accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     sub_accounts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                           easypost_user_id:
 *                             type: string
 *                           user_name:
 *                             type: string
 *                           user_email:
 *                             type: string
 *                           account_type:
 *                             type: string
 *                           is_active:
 *                             type: boolean
 *                     count:
 *                       type: integer
 *                 message:
 *                   type: string
 */
router.get("/sub-accounts", authenticateToken, getAllSubAccounts);

/**
 * @swagger
 * /api/admin/sub-accounts/stats:
 *   get:
 *     summary: Get sub-account statistics
 *     description: Retrieve statistics about EasyPost sub-accounts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total_sub_accounts:
 *                           type: integer
 *                         active_sub_accounts:
 *                           type: integer
 *                         business_accounts:
 *                           type: integer
 *                         individual_accounts:
 *                           type: integer
 *                 message:
 *                   type: string
 */
router.get("/sub-accounts/stats", authenticateToken, getSubAccountStats);

/**
 * @swagger
 * /api/admin/sub-accounts/{userId}:
 *   get:
 *     summary: Get sub-account by user ID
 *     description: Retrieve EasyPost sub-account information for a specific user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Sub-account retrieved successfully
 *       404:
 *         description: Sub-account not found
 */
router.get("/sub-accounts/:userId", authenticateToken, getSubAccountByUserId);

/**
 * @swagger
 * /api/admin/sub-accounts/{userId}/validate:
 *   get:
 *     summary: Validate sub-account
 *     description: Validate EasyPost sub-account connectivity for a specific user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Validation completed
 */
router.get(
  "/sub-accounts/:userId/validate",
  authenticateToken,
  validateSubAccount
);

/**
 * @swagger
 * /api/admin/sub-accounts/{userId}/recreate:
 *   post:
 *     summary: Create or recreate sub-account
 *     description: Create or recreate EasyPost sub-account for a specific user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Sub-account created/recreated successfully
 */
router.post(
  "/sub-accounts/:userId/recreate",
  authenticateToken,
  createOrRecreateSubAccount
);

export default router;
