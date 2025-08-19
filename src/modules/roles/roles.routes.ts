import { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import { validateDTO } from "../../middleware/class-validator";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { RoleQueryDTO } from "./dto/role-query.dto";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
  getActiveRoles,
} from "./roles.controller";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - is_active
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           maxLength: 50
 *           description: The name of the role
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: The description of the role
 *         is_active:
 *           type: boolean
 *           description: Whether the role is active
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the role was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the role was last updated
 *     CreateRoleDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: The name of the role
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: The description of the role
 *         is_active:
 *           type: boolean
 *           description: Whether the role is active
 *     UpdateRoleDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: The name of the role
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: The description of the role
 *         is_active:
 *           type: boolean
 *           description: Whether the role is active
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles with pagination and filtering
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for role name or description
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllRoles);

/**
 * @swagger
 * /api/roles/active:
 *   get:
 *     summary: Get all active roles (for dropdowns, etc.)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/active", getActiveRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleDTO'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request - Validation error or role name already exists
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post("/", validateDTO(CreateRoleDTO), createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update an existing role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleDTO'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request - Validation error or role name already exists
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", validateDTO(UpdateRoleDTO), updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - Cannot delete role with associated users
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteRole);

/**
 * @swagger
 * /api/roles/{id}/toggle-status:
 *   patch:
 *     summary: Toggle role status (activate/deactivate)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id/toggle-status", toggleRoleStatus);

export default router;
