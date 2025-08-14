import { Request, Response } from "express";
import { User, RefreshToken, Role, models } from "../../../db/models";
import { JWTService } from "../../utils/jwt";
import { RoleService } from "../../utils/roleService";
import { AuthenticatedRequest as AuthRequest } from "../../../db/types";
import { ResponseHandler, ResponseMessage } from "../../utils/responseHandler";

interface AuthenticatedRequest extends Request, AuthRequest {}

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, password, companyName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        ResponseHandler.badRequest(res, ResponseMessage.USER_EXISTS);
        return;
      }

      // Get default user role
      const defaultRole = await RoleService.getRoleByName("user");
      if (!defaultRole) {
        ResponseHandler.notFound(res, ResponseMessage.DEFAULT_ROLE_NOT_FOUND);
        return;
      }

      // Create new user
      const user = await User.create({
        fullName,
        email,
        password,
        companyName,
        roleId: defaultRole.id,
      });

      // Generate tokens
      const tokens = JWTService.generateTokens({
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
      });

      // Save refresh token
      await RefreshToken.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: JWTService.getRefreshTokenExpiry(),
      });

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      const responseData = {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          companyName: user.companyName,
          role: defaultRole.name,
          roleId: user.roleId,
          emailVerified: user.emailVerified,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
        },
      };

      ResponseHandler.registerSuccess(res, responseData);
    } catch (error) {
      console.error("Registration error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email with role
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: "role" }],
      });

      if (!user) {
        ResponseHandler.unauthorized(res, ResponseMessage.INVALID_CREDENTIALS);
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        ResponseHandler.unauthorized(res, ResponseMessage.ACCOUNT_DEACTIVATED);
        return;
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        ResponseHandler.unauthorized(res, ResponseMessage.INVALID_CREDENTIALS);
        return;
      }

      // Generate tokens
      const tokens = JWTService.generateTokens({
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
      });

      // Save refresh token
      await RefreshToken.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: JWTService.getRefreshTokenExpiry(),
      });

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      const responseData = {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          companyName: user.companyName,
          role: (user as any).role?.name || "user",
          roleId: user.roleId,
          emailVerified: user.emailVerified,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
        },
      };

      ResponseHandler.loginSuccess(res, responseData);
    } catch (error) {
      console.error("Login error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Find refresh token
      const tokenRecord = await RefreshToken.findOne({
        where: { token: refreshToken },
        include: [{ model: User, as: "user" }],
      });

      if (
        !tokenRecord ||
        tokenRecord.isRevoked ||
        tokenRecord.expiresAt < new Date()
      ) {
        ResponseHandler.unauthorized(
          res,
          ResponseMessage.REFRESH_TOKEN_INVALID
        );
        return;
      }

      // Generate new tokens
      const tokens = JWTService.generateTokens({
        userId: tokenRecord.user.id,
        email: tokenRecord.user.email,
        roleId: tokenRecord.user.roleId,
      });

      // Revoke old refresh token
      await tokenRecord.update({ isRevoked: true });

      // Save new refresh token
      await RefreshToken.create({
        token: tokens.refreshToken,
        userId: tokenRecord.user.id,
        expiresAt: JWTService.getRefreshTokenExpiry(),
      });

      const responseData = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      };

      ResponseHandler.tokenRefreshed(res, responseData);
    } catch (error) {
      console.error("Refresh token error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Logout user
   */
  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      // Revoke refresh token
      await RefreshToken.update(
        { isRevoked: true },
        { where: { token: refreshToken, userId } }
      );

      ResponseHandler.logoutSuccess(res);
    } catch (error) {
      console.error("Logout error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "role" }],
      });

      if (!user) {
        ResponseHandler.notFound(res, ResponseMessage.NOT_FOUND);
        return;
      }

      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: (user as any).role?.name || "user",
        roleId: user.roleId,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
      };

      ResponseHandler.success(res, { user: userData });
    } catch (error) {
      console.error("Get profile error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { fullName, companyName } = req.body;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        ResponseHandler.notFound(res, ResponseMessage.NOT_FOUND);
        return;
      }

      // Update user
      await user.update({ fullName, companyName });

      // Get updated user with role
      const userWithRole = await User.findByPk(userId, {
        include: [{ model: Role, as: "role" }],
      });

      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: (userWithRole as any)?.role?.name || "user",
        roleId: user.roleId,
        emailVerified: user.emailVerified,
      };

      ResponseHandler.profileUpdated(res, { user: userData });
    } catch (error) {
      console.error("Update profile error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        ResponseHandler.notFound(res, ResponseMessage.NOT_FOUND);
        return;
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        ResponseHandler.badRequest(
          res,
          ResponseMessage.CURRENT_PASSWORD_INCORRECT
        );
        return;
      }

      // Update password
      await user.update({ password: newPassword });

      ResponseHandler.passwordChanged(res);
    } catch (error) {
      console.error("Change password error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Get comprehensive account settings
   */
  static async getAccountSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "role" }],
      });

      if (!user) {
        ResponseHandler.notFound(res, ResponseMessage.NOT_FOUND);
        return;
      }

      // Mock business information data
      const businessInfo = {
        companyName: "Global Logistics Solutions Inc.",
        businessType: "eCommerce Retailer",
        addressLine1: "123 Commerce St, Suite 100",
        city: "Metropolis",
        state: "CA",
        zipCode: "90210",
        country: "United States",
      };

      const accountSettings = {
        personalInfo: {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: "+1 (555) 123-4567", // Mock data
        },
        businessInfo,
        lastUpdated: user.updatedAt,
      };

      ResponseHandler.success(
        res,
        { accountSettings },
        "Account settings retrieved successfully"
      );
    } catch (error) {
      console.error("Get account settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Update account settings
   */
  static async updateAccountSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { personalInfo, businessInfo } = req.body;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        ResponseHandler.notFound(res, ResponseMessage.NOT_FOUND);
        return;
      }

      // Update personal information
      if (personalInfo) {
        await user.update({
          fullName: personalInfo.fullName || user.fullName,
          companyName: businessInfo?.companyName || user.companyName,
        });
      }

      // Mock address validation
      const addressValidation = {
        isValid: true,
        validatedAddress: businessInfo?.addressLine1
          ? {
              streetAddress1: businessInfo.addressLine1,
              city: businessInfo.city,
              state: businessInfo.state,
              zipCode: businessInfo.zipCode,
              country: businessInfo.country,
            }
          : null,
        confidence: 0.95,
      };

      ResponseHandler.updated(
        res,
        {
          message: "Account settings updated successfully",
          addressValidation,
        },
        "Account settings updated successfully"
      );
    } catch (error) {
      console.error("Update account settings error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }

  /**
   * Handle post-login redirection to welcome page
   */
  static async postLoginRedirect(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        ResponseHandler.unauthorized(res, ResponseMessage.UNAUTHORIZED);
        return;
      }

      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "role" }],
      });

      if (!user) {
        ResponseHandler.notFound(res, ResponseMessage.NOT_FOUND);
        return;
      }

      // Get user's first name for welcome message
      const firstName = user.fullName.split(" ")[0];

      // Mock welcome page data
      const welcomeData = {
        user: {
          id: user.id,
          fullName: user.fullName,
          firstName,
          email: user.email,
          companyName: user.companyName,
          role: (user as any)?.role?.name || "user",
        },
        redirectUrl: "/welcome", // Frontend route for welcome page
        message: `Welcome to GlenvoShip, ${firstName}!`,
        onboardingComplete: user.emailVerified,
        nextSteps: [
          "Complete your shipping profile",
          "Add payment methods",
          "Create your first shipment",
        ],
      };

      ResponseHandler.success(
        res,
        { welcomeData },
        "Login successful, redirecting to welcome page"
      );
    } catch (error) {
      console.error("Post login redirect error:", error);
      ResponseHandler.error(res, "Internal server error");
    }
  }
}
