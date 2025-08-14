import { Role, Permission, RolePermission } from "../../db/models";
import { RoleWithPermissions } from "../../db/types";

export interface PermissionInfo {
  resource: string;
  action: string;
  scope?: string;
}

export class RoleService {
  /**
   * Get role by name
   */
  static async getRoleByName(name: string): Promise<Role | null> {
    return await Role.findOne({
      where: { name, isActive: true },
    });
  }

  /**
   * Get role by ID
   */
  static async getRoleById(id: number): Promise<Role | null> {
    return await Role.findByPk(id);
  }

  /**
   * Get all active roles
   */
  static async getAllRoles(): Promise<Role[]> {
    return await Role.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });
  }

  /**
   * Get role with permissions
   */
  static async getRoleWithPermissions(
    roleId: number
  ): Promise<RoleWithPermissions | null> {
    return (await Role.findByPk(roleId, {
      include: [
        {
          model: Permission,
          as: "permissions",
          where: { isActive: true },
          required: false,
        },
      ],
    })) as RoleWithPermissions | null;
  }

  /**
   * Get role permissions
   */
  static async getRolePermissions(roleId: number): Promise<Permission[]> {
    const role = await this.getRoleWithPermissions(roleId);
    return role?.permissions || [];
  }

  /**
   * Get user permissions
   */
  static async getUserPermissions(userId: number): Promise<Permission[]> {
    const user = await (
      await import("../../db/models")
    ).User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: "role",
          include: [
            {
              model: Permission,
              as: "permissions",
              where: { isActive: true },
              required: false,
            },
          ],
        },
      ],
    });

    return user?.role?.permissions || [];
  }

  /**
   * Check if user has permission
   */
  static hasPermission(
    userPermissions: Permission[],
    requiredPermission: string
  ): boolean {
    return userPermissions.some(
      (permission) => permission.name === requiredPermission
    );
  }

  /**
   * Check if user has any of the required permissions
   */
  static hasAnyPermission(
    userPermissions: Permission[],
    requiredPermissions: string[]
  ): boolean {
    return requiredPermissions.some((permission) =>
      userPermissions.some((userPerm) => userPerm.name === permission)
    );
  }

  /**
   * Check if user has all required permissions
   */
  static hasAllPermissions(
    userPermissions: Permission[],
    requiredPermissions: string[]
  ): boolean {
    return requiredPermissions.every((permission) =>
      userPermissions.some((userPerm) => userPerm.name === permission)
    );
  }

  /**
   * Check if user has resource permission
   */
  static hasResourcePermission(
    userPermissions: Permission[],
    resource: string,
    action: string,
    scope?: string
  ): boolean {
    return userPermissions.some(
      (permission) =>
        permission.resource === resource &&
        permission.action === action &&
        (!scope || permission.scope === scope)
    );
  }

  /**
   * Parse permission string to object
   */
  static parsePermission(permissionString: string): PermissionInfo {
    const [resource, action, scope] = permissionString.split(":");
    return {
      resource,
      action,
      scope,
    };
  }

  /**
   * Create permission string
   */
  static createPermission(
    resource: string,
    action: string,
    scope?: string
  ): string {
    return scope ? `${resource}:${action}:${scope}` : `${resource}:${action}`;
  }

  /**
   * Assign permission to role
   */
  static async assignPermissionToRole(
    roleId: number,
    permissionId: number
  ): Promise<void> {
    await RolePermission.create({ roleId, permissionId });
  }

  /**
   * Remove permission from role
   */
  static async removePermissionFromRole(
    roleId: number,
    permissionId: number
  ): Promise<void> {
    await RolePermission.destroy({ where: { roleId, permissionId } });
  }

  /**
   * Get permission by name
   */
  static async getPermissionByName(name: string): Promise<Permission | null> {
    return await Permission.findOne({ where: { name, isActive: true } });
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions(): Promise<Permission[]> {
    return await Permission.findAll({ where: { isActive: true } });
  }

  /**
   * Get default roles for new installations
   */
  static getDefaultRoles() {
    return [
      {
        name: "admin",
        description: "Administrator with full system access",
      },
      {
        name: "manager",
        description: "Manager with limited administrative access",
      },
      {
        name: "user",
        description: "Regular user with basic access",
      },
      {
        name: "guest",
        description: "Guest user with read-only access",
      },
    ];
  }
}
