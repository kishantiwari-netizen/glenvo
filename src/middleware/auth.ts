import { Request, Response, NextFunction } from "express";
import { JWTService } from "../utils/jwt";
import { User, Role } from "../../db/models";
import {
  UserWithRole,
  AuthenticatedRequest as AuthRequest,
} from "../../db/types";

interface AuthenticatedRequest extends Request, AuthRequest {}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    const decoded = JWTService.verifyToken(token);

    // Check if user still exists and is active
    const user = (await User.findByPk(decoded.userId, {
      include: [
        {
          model: Role,
          as: "role",
          where: { isActive: true },
        },
      ],
    })) as UserWithRole | null;

    if (!user || !user.isActive || !user.role) {
      res.status(401).json({
        success: false,
        message: "User not found, inactive, or has no valid role",
      });
      return;
    }

    // Get user permissions
    const userPermissions = await (
      await import("../utils/roleService")
    ).RoleService.getUserPermissions(decoded.userId);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId,
      roleName: user.role.name,
      permissions: userPermissions.map((p) => p.name),
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!req.user.roleName || !roles.includes(req.user.roleName)) {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(["admin"]);
export const requireMerchant = requireRole(["admin", "merchant"]);
export const requirePersonalShipper = requireRole([
  "admin",
  "merchant",
  "personal_shipper",
]);
