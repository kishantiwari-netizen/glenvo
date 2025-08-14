import { Request, Response } from "express";
import { Role, Permission, User } from "../../../db/models";
import { RoleService } from "../../utils/roleService";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { Op } from "sequelize";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class RoleController {
  /**
   * Get all roles with pagination and filtering
   */
  static async getRoles(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { page = 1, limit = 10, search, isActive } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      // Build where clause
      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }
      if (isActive !== undefined) whereClause.isActive = isActive;

      // Get roles with permissions and user count
      const { count, rows: roles } = await Role.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Permission,
            as: "permissions",
            through: { attributes: [] }, // Don't include junction table attributes
          },
          {
            model: User,
            as: "users",
            attributes: [], // Only count users, don't include user data
          },
        ],
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      const rolesData = roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        permissionsCount: (role as any).permissions?.length || 0,
        usersCount: (role as any).users?.length || 0,
        permissions:
          (role as any).permissions?.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            resource: p.resource,
            action: p.action,
            scope: p.scope,
          })) || [],
        createdAt: role.createdAt,
      }));

      const meta = ResponseHandler.calculatePaginationMeta(
        Number(page),
        Number(limit),
        count
      );

      ResponseHandler.paginated(
        res,
        rolesData,
        meta,
        "Roles retrieved successfully"
      );
    } catch (error) {
      console.error("Get roles error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get role by ID with permissions
   */
  static async getRoleById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id, {
        include: [
          {
            model: Permission,
            as: "permissions",
            through: { attributes: [] },
          },
          {
            model: User,
            as: "users",
            attributes: ["id", "fullName", "email", "isActive"],
          },
        ],
      });

      if (!role) {
        ResponseHandler.notFound(res, "Role not found");
        return;
      }

      const roleData = {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        permissions:
          (role as any).permissions?.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            resource: p.resource,
            action: p.action,
            scope: p.scope,
          })) || [],
        users: (role as any).users || [],
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };

      ResponseHandler.success(
        res,
        { role: roleData },
        "Role retrieved successfully"
      );
    } catch (error) {
      console.error("Get role by ID error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Create new role
   */
  static async createRole(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name, description, isActive = true } = req.body;

      // Check if role already exists
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        ResponseHandler.badRequest(res, "Role with this name already exists");
        return;
      }

      // Create role
      const role = await Role.create({
        name,
        description,
        isActive,
      });

      const roleData = {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        createdAt: role.createdAt,
      };

      ResponseHandler.created(
        res,
        { role: roleData },
        "Role created successfully"
      );
    } catch (error) {
      console.error("Create role error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update role
   */
  static async updateRole(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        ResponseHandler.notFound(res, "Role not found");
        return;
      }

      // Check if name is being updated and if it already exists
      if (updateData.name && updateData.name !== role.name) {
        const existingRole = await Role.findOne({
          where: { name: updateData.name },
        });
        if (existingRole) {
          ResponseHandler.badRequest(res, "Role with this name already exists");
          return;
        }
      }

      // Update role
      await role.update(updateData);

      const roleData = {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        updatedAt: role.updatedAt,
      };

      ResponseHandler.updated(
        res,
        { role: roleData },
        "Role updated successfully"
      );
    } catch (error) {
      console.error("Update role error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Delete role
   */
  static async deleteRole(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id, {
        include: [{ model: User, as: "users" }],
      });

      if (!role) {
        ResponseHandler.notFound(res, "Role not found");
        return;
      }

      // Check if role has users
      if ((role as any).users?.length > 0) {
        ResponseHandler.badRequest(
          res,
          "Cannot delete role that has assigned users"
        );
        return;
      }

      // Delete role
      await role.destroy();

      ResponseHandler.deleted(res, "Role deleted successfully");
    } catch (error) {
      console.error("Delete role error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Assign permissions to role
   */
  static async assignPermissions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        ResponseHandler.notFound(res, "Role not found");
        return;
      }

      // Verify all permissions exist
      const permissions = await Permission.findAll({
        where: { id: permissionIds },
      });

      if (permissions.length !== permissionIds.length) {
        ResponseHandler.badRequest(
          res,
          "One or more permission IDs are invalid"
        );
        return;
      }

      // Assign permissions
      for (const permissionId of permissionIds) {
        await RoleService.assignPermissionToRole(Number(id), permissionId);
      }

      ResponseHandler.success(
        res,
        undefined,
        "Permissions assigned successfully"
      );
    } catch (error) {
      console.error("Assign permissions error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Remove permissions from role
   */
  static async removePermissions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        ResponseHandler.notFound(res, "Role not found");
        return;
      }

      // Remove permissions
      for (const permissionId of permissionIds) {
        await RoleService.removePermissionFromRole(Number(id), permissionId);
      }

      ResponseHandler.success(
        res,
        undefined,
        "Permissions removed successfully"
      );
    } catch (error) {
      console.error("Remove permissions error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get role permissions
   */
  static async getRolePermissions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id);
      if (!role) {
        ResponseHandler.notFound(res, "Role not found");
        return;
      }

      const permissions = await RoleService.getRolePermissions(Number(id));

      const permissionsData = permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
        scope: permission.scope,
      }));

      ResponseHandler.success(
        res,
        { permissions: permissionsData },
        "Role permissions retrieved successfully"
      );
    } catch (error) {
      console.error("Get role permissions error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
