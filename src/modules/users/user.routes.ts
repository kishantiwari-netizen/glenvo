import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validation";
import {
  CreateUserDto,
  UpdateUserDto,
  GetUsersQueryDto,
  UserIdParamDto,
} from "./dto/user.dto";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination and filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, email, or company
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: integer
 *         description: Filter by role ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  authenticateToken,
  validateRequest(GetUsersQueryDto, "query"),
  UserController.getUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/:id",
  authenticateToken,
  validateRequest(UserIdParamDto, "params"),
  UserController.getUserById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               companyName:
 *                 type: string
 *                 maxLength: 255
 *               roleId:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Authentication required
 */
router.post(
  "/",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(CreateUserDto),
  UserController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               companyName:
 *                 type: string
 *                 maxLength: 255
 *               roleId:
 *                 type: integer
 *                 minimum: 1
 *               isActive:
 *                 type: boolean
 *               emailVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error or user already exists
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.put(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  validateRequest(UpdateUserDto),
  UserController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete own account
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.deleteUser
);

/**
 * @swagger
 * /api/users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user active status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *       400:
 *         description: Cannot deactivate own account
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.patch(
  "/:id/toggle-status",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.toggleUserStatus
);

/**
 * @swagger
 * /api/users/{id}/shipment-statistics:
 *   get:
 *     summary: Get user shipment statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User shipment statistics retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/:id/shipment-statistics",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.getUserShipmentStatistics
);

/**
 * @swagger
 * /api/users/{id}/shipments/recent:
 *   get:
 *     summary: Get user recent shipments
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of recent shipments to return
 *     responses:
 *       200:
 *         description: User recent shipments retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/:id/shipments/recent",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.getUserRecentShipments
);

/**
 * @swagger
 * /api/users/{id}/audit-log:
 *   get:
 *     summary: Get user audit log
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of audit log entries to return
 *     responses:
 *       200:
 *         description: User audit log retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/:id/audit-log",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.getUserAuditLog
);

/**
 * @swagger
 * /api/users/{id}/reset-password:
 *   post:
 *     summary: Reset user password (admin action)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Password reset initiated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.post(
  "/:id/reset-password",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.resetUserPassword
);

/**
 * @swagger
 * /api/users/{id}/contact:
 *   post:
 *     summary: Contact user (admin action)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
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
 *                 minLength: 1
 *               message:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Contact message sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.post(
  "/:id/contact",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.contactUser
);

/**
 * @swagger
 * /api/users/{id}/login-history:
 *   get:
 *     summary: Get user login history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of login history entries to return
 *     responses:
 *       200:
 *         description: User login history retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/:id/login-history",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(UserIdParamDto, "params"),
  UserController.getUserLoginHistory
);

export default router;
