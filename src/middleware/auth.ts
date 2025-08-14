import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, Role, Permission } from "../models";

interface JwtPayload {
  user_id: number;
  email: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userRoles?: string[];
      userPermissions?: string[];
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ message: "Access token required" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key_here"
    ) as JwtPayload;

    // Get user with role and permissions
    const user = await User.findByPk(decoded.user_id, {
      include: [
        {
          model: Role,
          as: "role",
          include: [
            {
              model: Permission,
              as: "permissions",
              required: false,
            },
          ],
          required: false,
        },
      ],
    });

    if (!user || !user.is_active) {
      res.status(401).json({ message: "Invalid token or user not found" });
      return;
    }

    // Extract roles and permissions (filter for active ones)
    const userRoles = user.role?.is_active ? [user.role.name] : [];
    const userPermissions =
      user.role?.is_active
        ? user.role.permissions?.filter((permission: any) => permission.is_active)?.map((permission: any) => permission.name) || []
        : [];

    req.user = user;
    req.userRoles = userRoles;
    req.userPermissions = [...new Set(userPermissions)] as string[]; // Remove duplicates

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(500).json({ message: "Authentication error" });
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const hasRole = req.userRoles?.some((role) => roles.includes(role));

    if (!hasRole) {
      res.status(403).json({ message: "Insufficient role permissions" });
      return;
    }

    next();
  };
};

export const requirePermission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const hasPermission = req.userPermissions?.some((permission) =>
      permissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    next();
  };
};

export const requireResourcePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const requiredPermission = `${resource}_${action}`;
    const hasPermission = req.userPermissions?.includes(requiredPermission);

    if (!hasPermission) {
      res.status(403).json({
        message: `Insufficient permissions for ${resource} ${action}`,
      });
      return;
    }

    next();
  };
};
