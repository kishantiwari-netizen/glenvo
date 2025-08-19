import { Request, Response } from "express";
import { Role, User } from "../../models";
import { Op } from "sequelize";
import { ResponseHandler } from "../../utils/responseHandler";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { RoleQueryDTO } from "./dto/role-query.dto";

export const getAllRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, is_active } = req.query as any;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Active status filter
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const { count, rows } = await Role.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["created_at", "DESC"]],
    });

    ResponseHandler.withPagination(
      res,
      { roles: rows },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      "Roles retrieved successfully"
    );
  } catch (error) {
    console.error("Get all roles error:", error);
    ResponseHandler.error(res, "Failed to retrieve roles");
  }
};

export const getRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      ResponseHandler.notFound(res, "Role not found");
      return;
    }

    ResponseHandler.success(res, { role }, "Role retrieved successfully");
  } catch (error) {
    console.error("Get role by ID error:", error);
    ResponseHandler.error(res, "Failed to retrieve role");
  }
};

export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleData: CreateRoleDTO = req.body;

    // Check if role with same name already exists
    const existingRole = await Role.findOne({
      where: { name: roleData.name },
    });

    if (existingRole) {
      ResponseHandler.badRequest(res, "Role with this name already exists");
      return;
    }

    const role = await Role.create({
      ...roleData,
      is_active: roleData.is_active ?? true,
    });

    ResponseHandler.created(res, { role }, "Role created successfully");
  } catch (error) {
    console.error("Create role error:", error);
    ResponseHandler.error(res, "Failed to create role");
  }
};

export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateRoleDTO = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      ResponseHandler.notFound(res, "Role not found");
      return;
    }

    // Check if name is being updated and if it conflicts with existing role
    if (updateData.name && updateData.name !== role.name) {
      const existingRole = await Role.findOne({
        where: { name: updateData.name, id: { [Op.ne]: id } },
      });

      if (existingRole) {
        ResponseHandler.badRequest(res, "Role with this name already exists");
        return;
      }
    }

    await role.update(updateData);

    ResponseHandler.success(res, { role }, "Role updated successfully");
  } catch (error) {
    console.error("Update role error:", error);
    ResponseHandler.error(res, "Failed to update role");
  }
};

export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id"],
        },
      ],
    });

    if (!role) {
      ResponseHandler.notFound(res, "Role not found");
      return;
    }

    // Check if role has associated users
    if (role.users && role.users.length > 0) {
      ResponseHandler.badRequest(
        res,
        "Cannot delete role that has associated users"
      );
      return;
    }

    await role.destroy();

    ResponseHandler.success(res, {}, "Role deleted successfully");
  } catch (error) {
    console.error("Delete role error:", error);
    ResponseHandler.error(res, "Failed to delete role");
  }
};

export const toggleRoleStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      ResponseHandler.notFound(res, "Role not found");
      return;
    }

    await role.update({ is_active: !role.is_active });

    ResponseHandler.success(
      res,
      { role },
      `Role ${role.is_active ? "activated" : "deactivated"} successfully`
    );
  } catch (error) {
    console.error("Toggle role status error:", error);
    ResponseHandler.error(res, "Failed to toggle role status");
  }
};

export const getActiveRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await Role.findAll({
      where: { is_active: true },
      attributes: ["id", "name", "description"],
      order: [["name", "ASC"]],
    });

    ResponseHandler.success(
      res,
      { roles },
      "Active roles retrieved successfully"
    );
  } catch (error) {
    console.error("Get active roles error:", error);
    ResponseHandler.error(res, "Failed to retrieve active roles");
  }
};
