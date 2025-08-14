import { Request, Response } from "express";
import { User, Role } from "../../../db/models";
import { RoleService } from "../../utils/roleService";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";
import { Op } from "sequelize";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class UserController {
  /**
   * Get all users with pagination and filtering
   */
  static async getUsers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { page = 1, limit = 10, search, roleId, isActive } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      // Build where clause
      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { companyName: { [Op.iLike]: `%${search}%` } },
        ];
      }
      if (roleId) whereClause.roleId = roleId;
      if (isActive !== undefined) whereClause.isActive = isActive;

      // Get users with role information
      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        include: [{ model: Role, as: "role" }],
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(count / Number(limit));

      const usersData = users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: (user as any).role?.name || "user",
        roleId: user.roleId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      }));

      const meta = ResponseHandler.calculatePaginationMeta(
        Number(page),
        Number(limit),
        count
      );

      ResponseHandler.paginated(
        res,
        usersData,
        meta,
        "Users retrieved successfully"
      );
    } catch (error) {
      console.error("Get users error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [{ model: Role, as: "role" }],
      });

      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: (user as any).role?.name || "user",
        roleId: user.roleId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      ResponseHandler.success(
        res,
        { user: userData },
        "User retrieved successfully"
      );
    } catch (error) {
      console.error("Get user by ID error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Create new user
   */
  static async createUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { fullName, email, password, companyName, roleId } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        ResponseHandler.badRequest(res, ResponseMessage.USER_EXISTS);
        return;
      }

      // Verify role exists
      const role = await RoleService.getRoleById(roleId);
      if (!role) {
        ResponseHandler.badRequest(res, "Invalid role ID");
        return;
      }

      // Create user
      const user = await User.create({
        fullName,
        email,
        password,
        companyName,
        roleId,
      });

      // Get user with role
      const userWithRole = await User.findByPk(user.id, {
        include: [{ model: Role, as: "role" }],
      });

      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: (userWithRole as any)?.role?.name || "user",
        roleId: user.roleId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      };

      ResponseHandler.created(
        res,
        { user: userData },
        "User created successfully"
      );
    } catch (error) {
      console.error("Create user error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update user
   */
  static async updateUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Check if email is being updated and if it already exists
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({
          where: { email: updateData.email },
        });
        if (existingUser) {
          ResponseHandler.badRequest(res, ResponseMessage.USER_EXISTS);
          return;
        }
      }

      // Verify role exists if being updated
      if (updateData.roleId) {
        const role = await RoleService.getRoleById(updateData.roleId);
        if (!role) {
          ResponseHandler.badRequest(res, "Invalid role ID");
          return;
        }
      }

      // Update user
      await user.update(updateData);

      // Get updated user with role
      const userWithRole = await User.findByPk(id, {
        include: [{ model: Role, as: "role" }],
      });

      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: (userWithRole as any)?.role?.name || "user",
        roleId: user.roleId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        updatedAt: user.updatedAt,
      };

      ResponseHandler.updated(
        res,
        { user: userData },
        "User updated successfully"
      );
    } catch (error) {
      console.error("Update user error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Check if user is trying to delete themselves
      const currentUserId = req.user?.userId;
      if (currentUserId && Number(id) === currentUserId) {
        ResponseHandler.badRequest(res, "Cannot delete your own account");
        return;
      }

      // Delete user
      await user.destroy();

      ResponseHandler.deleted(res, "User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Toggle user active status
   */
  static async toggleUserStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Check if user is trying to deactivate themselves
      const currentUserId = req.user?.userId;
      if (currentUserId && Number(id) === currentUserId) {
        ResponseHandler.badRequest(res, "Cannot deactivate your own account");
        return;
      }

      // Toggle status
      await user.update({ isActive: !user.isActive });

      const message = `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`;
      ResponseHandler.success(res, { isActive: user.isActive }, message);
    } catch (error) {
      console.error("Toggle user status error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get user shipment statistics
   */
  static async getUserShipmentStatistics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Mock data for shipment statistics
      // In a real app, this would query shipment tables
      const shipmentStats = {
        totalShipments: 187,
        shipmentTrend: [
          { month: "Jan", count: 25 },
          { month: "Feb", count: 28 },
          { month: "Mar", count: 32 },
          { month: "Apr", count: 30 },
          { month: "May", count: 27 },
          { month: "Jun", count: 29 },
          { month: "Jul", count: 16 },
        ],
      };

      ResponseHandler.success(
        res,
        { shipmentStats },
        "User shipment statistics retrieved successfully"
      );
    } catch (error) {
      console.error("Get user shipment statistics error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get user recent shipments
   */
  static async getUserRecentShipments(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { limit = 5 } = req.query;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Mock data for recent shipments
      // In a real app, this would query shipment tables
      const recentShipments = [
        {
          id: "2024-07-25",
          status: "Delivered",
          createdAt: "2024-07-25T10:00:00Z",
        },
        {
          id: "2024-07-20",
          status: "In Transit",
          createdAt: "2024-07-20T14:30:00Z",
        },
        {
          id: "2024-07-18",
          status: "Delivered",
          createdAt: "2024-07-18T09:15:00Z",
        },
        {
          id: "2024-07-10",
          status: "Pending",
          createdAt: "2024-07-10T16:45:00Z",
        },
        {
          id: "2024-07-05",
          status: "Cancelled",
          createdAt: "2024-07-05T11:20:00Z",
        },
      ].slice(0, Number(limit));

      ResponseHandler.success(
        res,
        { recentShipments },
        "User recent shipments retrieved successfully"
      );
    } catch (error) {
      console.error("Get user recent shipments error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get user audit log
   */
  static async getUserAuditLog(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { limit = 10 } = req.query;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Mock data for audit log
      // In a real app, this would query audit log tables
      const auditLog = [
        {
          id: 1,
          action: "Account Type Updated",
          timestamp: "2024-07-20T10:00:00Z",
          adminName: "Admin A",
          details: "Changed from Personal to Merchant",
        },
        {
          id: 2,
          action: "Payment Method Removed",
          timestamp: "2024-06-15T11:30:00Z",
          adminName: "Admin B",
          details: "Removed expired credit card",
        },
        {
          id: 3,
          action: "Email Address Changed",
          timestamp: "2024-05-10T09:00:00Z",
          adminName: "Admin A",
          details: "Updated from old@email.com to new@email.com",
        },
      ].slice(0, Number(limit));

      ResponseHandler.success(
        res,
        { auditLog },
        "User audit log retrieved successfully"
      );
    } catch (error) {
      console.error("Get user audit log error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Reset user password (admin action)
   */
  static async resetUserPassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // In a real app, you would hash this password and update the user
      // For now, we'll just return a success message

      ResponseHandler.success(
        res,
        {
          message: "Password reset initiated",
          tempPassword: tempPassword, // In production, this would be sent via email
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        },
        "Password reset initiated successfully"
      );
    } catch (error) {
      console.error("Reset user password error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Contact user (admin action)
   */
  static async contactUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { subject, message } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // In a real app, this would send an email to the user
      // For now, we'll just return a success message

      ResponseHandler.success(
        res,
        {
          message: "Contact message sent",
          recipient: user.email,
          subject,
          sentAt: new Date().toISOString(),
        },
        "Contact message sent successfully"
      );
    } catch (error) {
      console.error("Contact user error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get user login history
   */
  static async getUserLoginHistory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { limit = 10 } = req.query;

      const user = await User.findByPk(id);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      // Mock data for login history
      // In a real app, this would query login history tables
      const loginHistory = [
        {
          id: 1,
          timestamp: "2024-07-27T09:10:00Z",
          ipAddress: "198.51.100.12",
          device: "Mobile - Safari",
          location: "Toronto, Canada",
          success: true,
        },
        {
          id: 2,
          timestamp: "2024-07-26T18:00:00Z",
          ipAddress: "203.0.113.45",
          device: "Desktop - Edge",
          location: "Vancouver, Canada",
          success: true,
        },
        {
          id: 3,
          timestamp: "2024-07-25T14:30:00Z",
          ipAddress: "192.168.1.100",
          device: "Desktop - Chrome",
          location: "Montreal, Canada",
          success: false,
        },
      ].slice(0, Number(limit));

      ResponseHandler.success(
        res,
        { loginHistory },
        "User login history retrieved successfully"
      );
    } catch (error) {
      console.error("Get user login history error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
