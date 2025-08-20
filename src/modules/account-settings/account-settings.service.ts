import User from "../../models/User";
import ShippingProfile from "../../models/ShippingProfile";
import { UpdatePersonalInfoDto } from "./dto/personal-info.dto";
import { UpdateBusinessInfoDto } from "./dto/business-info.dto";
import { AccountSettingsResponse } from "./dto/account-settings.dto";
import EasyPostService from "../easypost/easypost.service";

export class AccountSettingsService {
  private easyPostService: EasyPostService;

  constructor() {
    this.easyPostService = new EasyPostService();
  }

  /**
   * Get account settings for a user
   */
  async getAccountSettings(userId: number): Promise<AccountSettingsResponse> {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: ShippingProfile,
          as: "shipping_profile",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const response: AccountSettingsResponse = {
      personal_info: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        full_name: user.fullName,
      },
    };

    // Add business info if user has a business account and shipping profile
    if (user.account_type === "business" && user.shipping_profile) {
      response.business_info = {
        company_name: user.shipping_profile.company_name || "",
        business_type: user.business_type || "Other",
        address_line_1: user.shipping_profile.street_address_line_1 || "",
        address_line_2: user.shipping_profile.street_address_line_2,
        city: user.shipping_profile.city || "",
        state_province: user.shipping_profile.state_province || "",
        postal_code: user.shipping_profile.postal_code || "",
        country: user.shipping_profile.country || "",
      };
    }

    return response;
  }

  /**
   * Update personal information
   */
  async updatePersonalInfo(
    userId: number,
    personalInfo: UpdatePersonalInfoDto
  ): Promise<AccountSettingsResponse> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if email is being changed and if it's already taken
    if (personalInfo.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: personalInfo.email },
      });
      if (existingUser) {
        throw new Error("Email address is already in use");
      }
    }

    // Update user information
    await user.update({
      first_name: personalInfo.first_name,
      last_name: personalInfo.last_name,
      email: personalInfo.email,
      phone_number: personalInfo.phone_number,
    });

    return this.getAccountSettings(userId);
  }

  /**
   * Update business information
   */
  async updateBusinessInfo(
    userId: number,
    businessInfo: UpdateBusinessInfoDto
  ): Promise<AccountSettingsResponse> {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: ShippingProfile,
          as: "shipping_profile",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update user business type
    await user.update({
      account_type: "business",
      business_type: businessInfo.business_type,
    });

    // Update or create shipping profile
    let shippingProfile = user.shipping_profile;

    if (!shippingProfile) {
      shippingProfile = await ShippingProfile.create({
        user_id: userId,
        company_name: businessInfo.company_name,
        street_address_line_1: businessInfo.address_line_1,
        street_address_line_2: businessInfo.address_line_2,
        city: businessInfo.city,
        state_province: businessInfo.state_province,
        postal_code: businessInfo.postal_code,
        country: businessInfo.country,
        is_profile_setup_complete: true,
      });
    } else {
      await shippingProfile.update({
        company_name: businessInfo.company_name,
        street_address_line_1: businessInfo.address_line_1,
        street_address_line_2: businessInfo.address_line_2,
        city: businessInfo.city,
        state_province: businessInfo.state_province,
        postal_code: businessInfo.postal_code,
        country: businessInfo.country,
        is_profile_setup_complete: true,
      });
    }

    // Validate address with EasyPost if API key is available
    if (user.easypost_api_key) {
      try {
        const verifiedAddress = await this.easyPostService.verifyAddress({
          street1: businessInfo.address_line_1,
          street2: businessInfo.address_line_2,
          city: businessInfo.city,
          state: businessInfo.state_province,
          zip: businessInfo.postal_code,
          country: businessInfo.country,
          company: businessInfo.company_name,
        });

        if (verifiedAddress.verified) {
          await shippingProfile.update({
            easypost_address_id: verifiedAddress.id,
            easypost_verified_at: new Date(),
          });
        }
      } catch (error) {
        console.error("Address verification failed:", error);
        // Don't throw error, just log it
      }
    }

    return this.getAccountSettings(userId);
  }

  /**
   * Update both personal and business information
   */
  async updateAccountSettings(
    userId: number,
    personalInfo: UpdatePersonalInfoDto,
    businessInfo?: UpdateBusinessInfoDto
  ): Promise<AccountSettingsResponse> {
    // Update personal info first
    await this.updatePersonalInfo(userId, personalInfo);

    // Update business info if provided
    if (businessInfo) {
      await this.updateBusinessInfo(userId, businessInfo);
    }

    return this.getAccountSettings(userId);
  }
}
