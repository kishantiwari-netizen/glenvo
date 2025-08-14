import { Request, Response } from "express";
import { User, Role } from "../../models";
import { Op } from "sequelize";
import { ResponseHandler } from "../../utils/responseHandler";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const is_active = req.query.is_active as string;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Search filter
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Active status filter
    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    const includeOptions: any = [
      {
        model: Role,
        as: "role",
        where: { is_active: true },
        required: false,
      },
    ];

    // Role filter
    if (role) {
      includeOptions[0].where = { ...includeOptions[0].where, name: role };
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: includeOptions,
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    const users = rows.map((user: any) => ({
      ...user.toJSON(),
      role: user.role?.name || null,
    }));

    ResponseHandler.withPagination(
      res,
      { users },
      {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      "Users retrieved successfully"
    );
  } catch (error) {
    console.error("Get all users error:", error);
    ResponseHandler.error(res, "Failed to retrieve users");
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { is_active: true },
          required: false,
        },
      ],
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });

    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    const role = user.role?.name || null;

    ResponseHandler.success(
      res,
      {
        user: {
          ...user.toJSON(),
          role,
        },
      },
      "User retrieved successfully"
    );
  } catch (error) {
    console.error("Get user by ID error:", error);
    ResponseHandler.error(res, "Failed to retrieve user");
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      date_of_birth,
      account_type,
      agreement_acceptance,
      marketing_opt_in,
      social_media_acceptance,
      role_id,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      ResponseHandler.conflict(res, "User with this email already exists");
      return;
    }

    // Create user
    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
      account_type: account_type || "individual",
      agreement_acceptance: agreement_acceptance || false,
      marketing_opt_in: marketing_opt_in || false,
      social_media_acceptance: social_media_acceptance || false,
    });

    // Assign role if provided
    if (role_id) {
      const role = await Role.findOne({
        where: { id: role_id, is_active: true },
      });
      if (role) {
        await user.update({ role_id: role.id });
      }
    } else {
      // Assign default user role
      const defaultRole = await Role.findOne({ where: { name: "user" } });
      if (defaultRole) {
        await user.update({ role_id: defaultRole.id });
      }
    }

    // Get user with role
    const userWithRole = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { is_active: true },
          required: false,
        },
      ],
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });

    const role = userWithRole?.role?.name || null;

    ResponseHandler.created(
      res,
      {
        user: {
          ...userWithRole?.toJSON(),
          role,
        },
      },
      "User created successfully"
    );
  } catch (error) {
    console.error("Create user error:", error);
    ResponseHandler.error(res, "Failed to create user");
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      is_active,
      role_id,
    } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        ResponseHandler.conflict(res, "User with this email already exists");
        return;
      }
    }

    // Update user
    await user.update({
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      email: email || user.email,
      phone_number: phone_number || user.phone_number,
      date_of_birth: date_of_birth
        ? new Date(date_of_birth)
        : user.date_of_birth,
      is_active: is_active !== undefined ? is_active : user.is_active,
    });

    // Update role if provided
    if (role_id !== undefined) {
      if (role_id) {
        const role = await Role.findOne({
          where: { id: role_id, is_active: true },
        });
        if (role) {
          await user.update({ role_id: role.id });
        }
      } else {
        await user.update({ role_id: undefined });
      }
    }

    // Get updated user with role
    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { is_active: true },
          required: false,
        },
      ],
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });

    const role = updatedUser?.role?.name || null;

    ResponseHandler.success(
      res,
      {
        user: {
          ...updatedUser?.toJSON(),
          role,
        },
      },
      "User updated successfully"
    );
  } catch (error) {
    console.error("Update user error:", error);
    ResponseHandler.error(res, "Failed to update user");
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Soft delete - set is_active to false
    await user.update({ is_active: false });

    ResponseHandler.success(res, null, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    ResponseHandler.error(res, "Failed to delete user");
  }
};

export const assignRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Assign new role
    if (role_id) {
      const role = await Role.findOne({
        where: { id: role_id, is_active: true },
      });
      if (role) {
        await user.update({ role_id: role.id });
      }
    } else {
      await user.update({ role_id: undefined });
    }

    // Get updated user with role
    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { is_active: true },
          required: false,
        },
      ],
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });

    const role = updatedUser?.role?.name || null;

    ResponseHandler.success(
      res,
      {
        user: {
          ...updatedUser?.toJSON(),
          role,
        },
      },
      "Role assigned successfully"
    );
  } catch (error) {
    console.error("Assign roles error:", error);
    ResponseHandler.error(res, "Failed to assign roles");
  }
};
