import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import EasyPostSubAccountService from "../easypost/easypost-subaccount.service";

const subAccountService = new EasyPostSubAccountService();

export const getAllSubAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subAccounts = await subAccountService.getAllSubAccounts();

    ResponseHandler.success(
      res,
      {
        sub_accounts: subAccounts,
        count: subAccounts.length,
      },
      "Sub-accounts retrieved successfully"
    );
  } catch (error) {
    console.error("Get all sub-accounts error:", error);
    ResponseHandler.error(res, "Failed to retrieve sub-accounts");
  }
};

export const getSubAccountByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      ResponseHandler.badRequest(res, "Invalid user ID");
      return;
    }

    const subAccount = await subAccountService.getSubAccountByUserId(userId);

    if (!subAccount) {
      ResponseHandler.notFound(res, "Sub-account not found for this user");
      return;
    }

    ResponseHandler.success(
      res,
      {
        sub_account: subAccount,
      },
      "Sub-account retrieved successfully"
    );
  } catch (error) {
    console.error("Get sub-account error:", error);
    ResponseHandler.error(res, "Failed to retrieve sub-account");
  }
};

export const createOrRecreateSubAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      ResponseHandler.badRequest(res, "Invalid user ID");
      return;
    }

    const subAccount = await subAccountService.createOrRecreateSubAccount(
      userId
    );

    ResponseHandler.success(
      res,
      {
        sub_account: subAccount,
      },
      "Sub-account created/recreated successfully"
    );
  } catch (error) {
    console.error("Create/recreate sub-account error:", error);
    ResponseHandler.error(res, "Failed to create/recreate sub-account");
  }
};

export const getSubAccountStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await subAccountService.getSubAccountStats();

    ResponseHandler.success(
      res,
      {
        stats: stats,
      },
      "Sub-account statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Get sub-account stats error:", error);
    ResponseHandler.error(res, "Failed to retrieve sub-account statistics");
  }
};

export const validateSubAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      ResponseHandler.badRequest(res, "Invalid user ID");
      return;
    }

    const validation = await subAccountService.validateSubAccount(userId);

    ResponseHandler.success(
      res,
      {
        validation: validation,
      },
      validation.is_valid
        ? "Sub-account validation successful"
        : "Sub-account validation failed"
    );
  } catch (error) {
    console.error("Validate sub-account error:", error);
    ResponseHandler.error(res, "Failed to validate sub-account");
  }
};
