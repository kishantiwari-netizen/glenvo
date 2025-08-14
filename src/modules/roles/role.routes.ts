import { Router } from "express";
import { RoleController } from "./role.controller";
import { authenticateToken, requireRole } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validation";
import {
  CreateRoleDto,
  UpdateRoleDto,
  GetRolesQueryDto,
  RoleIdParamDto,
  AssignPermissionsDto,
  RemovePermissionsDto,
} from "./dto/role.dto";

const router = Router();

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
 *         description: Search term for name or description
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  authenticateToken,
  validateRequest(GetRolesQueryDto, "query"),
  RoleController.getRoles
);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID with permissions and users
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
 *       404:
 *         description: Role not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/:id",
  authenticateToken,
  validateRequest(RoleIdParamDto, "params"),
  RoleController.getRoleById
);

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
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Validation error or role already exists
 *       401:
 *         description: Authentication required
 */
router.post(
  "/",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(CreateRoleDto),
  RoleController.createRole
);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Validation error or role already exists
 *       404:
 *         description: Role not found
 *       401:
 *         description: Authentication required
 */
router.put(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(RoleIdParamDto, "params"),
  validateRequest(UpdateRoleDto),
  RoleController.updateRole
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role
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
 *       400:
 *         description: Cannot delete role with assigned users
 *       404:
 *         description: Role not found
 *       401:
 *         description: Authentication required
 */
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(RoleIdParamDto, "params"),
  RoleController.deleteRole
);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   get:
 *     summary: Get role permissions
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
 *         description: Role permissions retrieved successfully
 *       404:
 *         description: Role not found
 *       401:
 *         description: Authentication required
 */
router.get(
  "/:id/permissions",
  authenticateToken,
  validateRequest(RoleIdParamDto, "params"),
  RoleController.getRolePermissions
);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   post:
 *     summary: Assign permissions to role
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
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *       400:
 *         description: Invalid permission IDs
 *       404:
 *         description: Role not found
 *       401:
 *         description: Authentication required
 */
router.post(
  "/:id/permissions",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(RoleIdParamDto, "params"),
  validateRequest(AssignPermissionsDto),
  RoleController.assignPermissions
);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   delete:
 *     summary: Remove permissions from role
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
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Permissions removed successfully
 *       404:
 *         description: Role not found
 *       401:
 *         description: Authentication required
 */
router.delete(
  "/:id/permissions",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(RoleIdParamDto, "params"),
  validateRequest(RemovePermissionsDto),
  RoleController.removePermissions
);

export default router;
