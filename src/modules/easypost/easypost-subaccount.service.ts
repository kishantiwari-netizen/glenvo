import { User } from "../../models";
import EasyPostService from "./easypost.service";

interface SubAccountInfo {
  user_id: number;
  easypost_user_id: string;
  easypost_api_key?: string;
  easypost_webhook_url?: string;
  user_name: string;
  user_email: string;
  account_type: string;
  is_active: boolean;
}

class EasyPostSubAccountService {
  private easyPostService: EasyPostService;

  constructor() {
    this.easyPostService = new EasyPostService();
  }

  /**
   * Get all EasyPost sub-accounts for centralized management
   */
  async getAllSubAccounts(): Promise<SubAccountInfo[]> {
    try {
      const users = await User.findAll({
        where: {
          easypost_user_id: {
            [require("sequelize").Op.not]: null,
          },
        },
        attributes: [
          "id",
          "easypost_user_id",
          "easypost_api_key",
          "easypost_webhook_url",
          "first_name",
          "last_name",
          "email",
          "account_type",
          "is_active",
        ],
      });

      return users.map((user) => ({
        user_id: user.id,
        easypost_user_id: user.easypost_user_id!,
        easypost_api_key: user.easypost_api_key,
        easypost_webhook_url: user.easypost_webhook_url,
        user_name: `${user.first_name} ${user.last_name}`,
        user_email: user.email,
        account_type: user.account_type,
        is_active: user.is_active,
      }));
    } catch (error) {
      console.error("Error fetching sub-accounts:", error);
      throw new Error("Failed to fetch sub-accounts");
    }
  }

  /**
   * Get sub-account information for a specific user
   */
  async getSubAccountByUserId(userId: number): Promise<SubAccountInfo | null> {
    try {
      const user = await User.findByPk(userId, {
        attributes: [
          "id",
          "easypost_user_id",
          "easypost_api_key",
          "easypost_webhook_url",
          "first_name",
          "last_name",
          "email",
          "account_type",
          "is_active",
        ],
      });

      if (!user || !user.easypost_user_id) {
        return null;
      }

      return {
        user_id: user.id,
        easypost_user_id: user.easypost_user_id,
        easypost_api_key: user.easypost_api_key,
        easypost_webhook_url: user.easypost_webhook_url,
        user_name: `${user.first_name} ${user.last_name}`,
        user_email: user.email,
        account_type: user.account_type,
        is_active: user.is_active,
      };
    } catch (error) {
      console.error("Error fetching sub-account:", error);
      throw new Error("Failed to fetch sub-account");
    }
  }

  /**
   * Create or recreate EasyPost sub-account for a user
   */
  async createOrRecreateSubAccount(userId: number): Promise<SubAccountInfo> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const webhookUrl = `${
        process.env.API_BASE_URL || "http://localhost:3000"
      }/api/webhooks/easypost`;

      const subAccount = await this.easyPostService.createSubAccount({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number,
        company_name:
          user.account_type === "business"
            ? `${user.first_name} ${user.last_name} Business`
            : undefined,
      });

      // Create webhook subscription for the sub-account
      const webhook = await this.easyPostService.createWebhookSubscription(
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
        `EasyPost sub-account created/recreated for user ${user.id}: ${subAccount.id}`
      );

      return {
        user_id: user.id,
        easypost_user_id: subAccount.id,
        easypost_api_key: subAccount.api_key,
        easypost_webhook_url: webhook.url,
        user_name: `${user.first_name} ${user.last_name}`,
        user_email: user.email,
        account_type: user.account_type,
        is_active: user.is_active,
      };
    } catch (error) {
      console.error("Error creating/recreating sub-account:", error);
      throw new Error("Failed to create/recreate sub-account");
    }
  }

  /**
   * Get sub-account statistics for centralized management
   */
  async getSubAccountStats(): Promise<{
    total_sub_accounts: number;
    active_sub_accounts: number;
    business_accounts: number;
    individual_accounts: number;
  }> {
    try {
      const users = await User.findAll({
        where: {
          easypost_user_id: {
            [require("sequelize").Op.not]: null,
          },
        },
        attributes: ["account_type", "is_active"],
      });

      const total = users.length;
      const active = users.filter((user) => user.is_active).length;
      const business = users.filter(
        (user) => user.account_type === "business"
      ).length;
      const individual = users.filter(
        (user) => user.account_type === "individual"
      ).length;

      return {
        total_sub_accounts: total,
        active_sub_accounts: active,
        business_accounts: business,
        individual_accounts: individual,
      };
    } catch (error) {
      console.error("Error fetching sub-account stats:", error);
      throw new Error("Failed to fetch sub-account statistics");
    }
  }

  /**
   * Validate sub-account connectivity
   */
  async validateSubAccount(userId: number): Promise<{
    is_valid: boolean;
    error?: string;
    sub_account_info?: any;
  }> {
    try {
      const user = await User.findByPk(userId);
      if (!user || !user.easypost_user_id) {
        return {
          is_valid: false,
          error: "User has no EasyPost sub-account",
        };
      }

      // Try to retrieve the sub-account from EasyPost
      const subAccountInfo = await this.easyPostService.getSubAccount(
        user.easypost_user_id
      );

      return {
        is_valid: true,
        sub_account_info: subAccountInfo,
      };
    } catch (error: any) {
      return {
        is_valid: false,
        error: error.message,
      };
    }
  }
}

export default EasyPostSubAccountService;
