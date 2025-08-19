import { Request, Response } from "express";
import { User, Role, ShippingProfile } from "../../models";
import { generateToken } from "../../utils/jwt";
import { ResponseHandler } from "../../utils/responseHandler";
import EasyPostService from "../easypost/easypost.service";
import EmailService from "../../utils/emailService";
import crypto from "crypto";

export const register = async (req: Request, res: Response): Promise<void> => {
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
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      ResponseHandler.conflict(res, "User with this email already exists");
      return;
    }

    // Create new user
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

    // Create EasyPost sub-account for the user
    try {
      const easyPostService = new EasyPostService();
      const webhookUrl = `${
        process.env.API_BASE_URL || "http://localhost:3000"
      }/api/webhooks/easypost`;

      const subAccount = await easyPostService.createSubAccount({
        name: `${first_name} ${last_name}`,
        email: email,
        phone_number: phone_number,
        company_name:
          account_type === "business"
            ? `${first_name} ${last_name} Business`
            : undefined,
      });
      console.log(
        "-------------------subAccount------------------->",
        subAccount
      );
      // Create webhook subscription for the sub-account
      const webhook = await easyPostService.createWebhookSubscription(
        subAccount.api_key || "",
        webhookUrl,
        process.env.NODE_ENV === "production" ? "production" : "test"
      );

      // Update user with EasyPost sub-account information
      await user.update({
        easypost_user_id: subAccount.id,
        easypost_api_key: subAccount.api_key,
        easypost_webhook_url: webhook.url,
      });

      console.log(
        `EasyPost sub-account created for user ${user.id}: ${subAccount.id}`
      );
    } catch (error) {
      console.error("Failed to create EasyPost sub-account:", error);
      // Don't fail registration if EasyPost sub-account creation fails
      // The user can still use the system, but shipping features may be limited
    }

    // Assign default user role
    const defaultRole = await Role.findOne({ where: { name: "user" } });
    if (defaultRole) {
      await user.update({ role_id: defaultRole.id });
    }

    // Get user role for token
    const userWithRole = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { is_active: true },
          required: false,
        },
      ],
    });

    const roles = userWithRole?.role ? [userWithRole.role.name] : [];

    // Generate token
    const token = generateToken(user, roles);

    // Update last login
    await user.update({ last_login_at: new Date() });

    ResponseHandler.created(
      res,
      {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          date_of_birth: user.date_of_birth,
          account_type: user.account_type,
          agreement_acceptance: user.agreement_acceptance,
          marketing_opt_in: user.marketing_opt_in,
          social_media_acceptance: user.social_media_acceptance,
          is_email_verified: user.is_email_verified,
          is_active: user.is_active,
          roles: roles,
        },
        token,
      },
      "User registered successfully"
    );
  } catch (error) {
    console.error("Registration error:", error);
    ResponseHandler.error(res, "Registration failed");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with role
    const user = await User.findOne({
      where: { email, is_active: true },
      include: [
        {
          model: Role,
          as: "role",
          where: { is_active: true },
          required: false,
        },
        {
          model: ShippingProfile,
          as: "shipping_profile",
          where: { is_active: true },
          required: false,
        },
      ],
    });

    if (!user) {
      ResponseHandler.unauthorized(res, "Invalid email or password");
      return;
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    console.log({ isValidPassword });
    if (!isValidPassword) {
      ResponseHandler.unauthorized(res, "Invalid email or password");
      return;
    }

    // Get user role
    const roles = user.role ? [user.role.name] : [];

    // Generate token
    const token = generateToken(user, roles);

    // Update last login
    await user.update({ last_login_at: new Date() });

    ResponseHandler.success(
      res,
      {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          date_of_birth: user.date_of_birth,
          profile_picture: user.profile_picture,
          is_email_verified: user.is_email_verified,
          is_active: user.is_active,
          last_login_at: user.last_login_at,
          is_profile_setup_complete:
            user.shipping_profile?.is_profile_setup_complete,
          roles: roles,
        },
        token,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    ResponseHandler.error(res, "Login failed");
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { is_active: true },
          required: false,
          include: [
            {
              model: (await import("../../models")).Permission,
              as: "permissions",
              where: { is_active: true },
              required: false,
            },
          ],
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

    const roles = user.role ? [user.role.name] : [];
    const permissions =
      user.role?.permissions?.map((permission: any) => permission.name) || [];

    ResponseHandler.success(
      res,
      {
        user: {
          ...user.toJSON(),
          roles: roles,
          permissions: [...new Set(permissions)], // Remove duplicates
        },
      },
      "Profile retrieved successfully"
    );
  } catch (error) {
    console.error("Get profile error:", error);
    ResponseHandler.error(res, "Failed to retrieve profile");
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      date_of_birth,
      profile_picture,
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Update user
    await user.update({
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      phone_number: phone_number || user.phone_number,
      date_of_birth: date_of_birth
        ? new Date(date_of_birth)
        : user.date_of_birth,
      profile_picture: profile_picture || user.profile_picture,
    });

    ResponseHandler.success(
      res,
      {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          date_of_birth: user.date_of_birth,
          profile_picture: user.profile_picture,
          is_email_verified: user.is_email_verified,
          is_active: user.is_active,
          last_login_at: user.last_login_at,
        },
      },
      "Profile updated successfully"
    );
  } catch (error) {
    console.error("Update profile error:", error);
    ResponseHandler.error(res, "Failed to update profile");
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { current_password, new_password } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(current_password);
    if (!isValidPassword) {
      ResponseHandler.badRequest(res, "Current password is incorrect");
      return;
    }

    // Update password
    await user.update({ password: new_password });

    ResponseHandler.success(res, null, "Password changed successfully");
  } catch (error) {
    console.error("Change password error:", error);
    ResponseHandler.error(res, "Failed to change password");
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email, is_active: true } });
    if (!user) {
      ResponseHandler.success(res, null, "Password reset link has been sent");
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      password_reset_token: resetToken,
      password_reset_expires: resetTokenExpiry,
    });

    // Send email
    try {
      const emailService = new EmailService();
      await emailService.sendPasswordResetEmail(
        email,
        resetToken,
        user.first_name
      );

      ResponseHandler.success(
        res,
        null,
        "Password reset link has been sent to your email"
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // Clear the reset token if email fails
      await user.update({
        password_reset_token: null as any,
        password_reset_expires: null as any,
      });

      ResponseHandler.error(res, "Failed to send password reset email");
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    ResponseHandler.error(res, "Failed to process password reset request");
  }
};

export const verifyResetToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reset_token } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        password_reset_token: reset_token,
        password_reset_expires: {
          [require("sequelize").Op.gt]: new Date(),
        },
        is_active: true,
      },
    });

    if (!user) {
      ResponseHandler.badRequest(res, "Invalid or expired reset token");
      return;
    }

    ResponseHandler.success(res, null, "Reset token is valid");
  } catch (error) {
    console.error("Verify reset token error:", error);
    ResponseHandler.error(res, "Failed to verify reset token");
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reset_token, password, confirm_password } = req.body;

    // Validate password confirmation
    if (password !== confirm_password) {
      ResponseHandler.badRequest(res, "Passwords do not match");
      return;
    }

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        password_reset_token: reset_token,
        password_reset_expires: {
          [require("sequelize").Op.gt]: new Date(),
        },
        is_active: true,
      },
    });

    if (!user) {
      ResponseHandler.badRequest(res, "Invalid or expired reset token");
      return;
    }

    // Update password and clear reset token
    await user.update({
      password: password,
      password_reset_token: null as any,
      password_reset_expires: null as any,
    });

    ResponseHandler.success(res, null, "Password has been reset successfully");
  } catch (error) {
    console.error("Reset password error:", error);
    ResponseHandler.error(res, "Failed to reset password");
  }
};
