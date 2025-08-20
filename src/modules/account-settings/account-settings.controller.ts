import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { AccountSettingsService } from "./account-settings.service";
import { UpdatePersonalInfoDto } from "./dto/personal-info.dto";
import { UpdateBusinessInfoDto } from "./dto/business-info.dto";

export class AccountSettingsController {
  private accountSettingsService: AccountSettingsService;

  constructor() {
    this.accountSettingsService = new AccountSettingsService();
  }

  /**
   * Get account settings
   */
  getAccountSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const accountSettings =
        await this.accountSettingsService.getAccountSettings(userId);

      ResponseHandler.success(
        res,
        accountSettings,
        "Account settings retrieved successfully"
      );
    } catch (error) {
      console.error("Get account settings error:", error);
      ResponseHandler.error(res, "Failed to retrieve account settings");
    }
  };

  /**
   * Update personal information
   */
  updatePersonalInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const personalInfo: UpdatePersonalInfoDto = req.body;

      const updatedSettings =
        await this.accountSettingsService.updatePersonalInfo(
          userId,
          personalInfo
        );

      ResponseHandler.success(
        res,
        updatedSettings,
        "Personal information updated successfully"
      );
    } catch (error) {
      console.error("Update personal info error:", error);

      if (error instanceof Error) {
        if (error.message === "Email address is already in use") {
          ResponseHandler.badRequest(res, error.message);
          return;
        }
        if (error.message === "User not found") {
          ResponseHandler.notFound(res, error.message);
          return;
        }
      }

      ResponseHandler.error(res, "Failed to update personal information");
    }
  };

  /**
   * Update business information
   */
  updateBusinessInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const businessInfo: UpdateBusinessInfoDto = req.body;

      const updatedSettings =
        await this.accountSettingsService.updateBusinessInfo(
          userId,
          businessInfo
        );

      ResponseHandler.success(
        res,
        updatedSettings,
        "Business information updated successfully"
      );
    } catch (error) {
      console.error("Update business info error:", error);

      if (error instanceof Error) {
        if (error.message === "User not found") {
          ResponseHandler.notFound(res, error.message);
          return;
        }
      }

      ResponseHandler.error(res, "Failed to update business information");
    }
  };

  /**
   * Update both personal and business information
   */
  updateAccountSettings = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user.id;
      const { personal_info, business_info } = req.body;

      const updatedSettings =
        await this.accountSettingsService.updateAccountSettings(
          userId,
          personal_info,
          business_info
        );

      ResponseHandler.success(
        res,
        updatedSettings,
        "Account settings updated successfully"
      );
    } catch (error) {
      console.error("Update account settings error:", error);

      if (error instanceof Error) {
        if (error.message === "Email address is already in use") {
          ResponseHandler.badRequest(res, error.message);
          return;
        }
        if (error.message === "User not found") {
          ResponseHandler.notFound(res, error.message);
          return;
        }
      }

      ResponseHandler.error(res, "Failed to update account settings");
    }
  };
}
