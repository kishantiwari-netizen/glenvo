import { Request, Response } from "express";
import { User, ShippingProfile } from "../../models";
import { ResponseHandler } from "../../utils/responseHandler";
import EasyPostService from "../easypost/easypost.service";
import { ProfileSetupDto, AddressVerificationDto } from "./dto";

export const setupProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const profileData: ProfileSetupDto = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    // Verify address using EasyPost
    // const easyPostService = new EasyPostService();
    // const addressData = {
    //   street1: profileData.street_address_line_1,
    //   street2: profileData.street_address_line_2,
    //   city: profileData.city,
    //   state: profileData.state_province,
    //   zip: profileData.postal_code,
    //   country: profileData.country,
    //   company: profileData.company_name,
    //   name: `${user.first_name} ${user.last_name}`,
    //   phone: profileData.phone_number,
    // };

    // const verifiedAddress = await easyPostService.verifyAddress(addressData);

    // if (!verifiedAddress.verified) {
    //   ResponseHandler.error(
    //     res,
    //     "Address verification failed",
    //     400,
    //     JSON.stringify({
    //       verification_errors: verifiedAddress.verification_errors,
    //     })
    //   );
    //   return;
    // }

    // Update user profile with phone number and account type
    await user.update({
      phone_number: profileData.phone_number,
      account_type: profileData.account_type,
    });

    // Create or update shipping profile
    const [shippingProfile, created] = await ShippingProfile.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        company_name: profileData.company_name,
        country: profileData.country,
        currency: profileData.currency,
        // street_address_line_1: verifiedAddress.street1,
        // street_address_line_2: verifiedAddress.street2,
        // city: verifiedAddress.city,
        // state_province: verifiedAddress.state,
        // postal_code: verifiedAddress.zip,
        street_address_line_1: profileData.street_address_line_1,
        street_address_line_2: profileData.street_address_line_2,
        city: profileData.city,
        state_province: profileData.state,
        postal_code: profileData.postal_code,
        is_profile_setup_complete: true,
        // easypost_address_id: verifiedAddress.id,
        easypost_verified_at: new Date(),
      },
    });

    if (!created) {
      await shippingProfile.update({
        company_name: profileData.company_name,
        country: profileData.country,
        currency: profileData.currency,
        // street_address_line_1: verifiedAddress.street1,
        // street_address_line_2: verifiedAddress.street2,
        // city: verifiedAddress.city,
        // state_province: verifiedAddress.state,
        // postal_code: verifiedAddress.zip,
        is_profile_setup_complete: true,
        // easypost_address_id: verifiedAddress.id,
        easypost_verified_at: new Date(),
      });
    }

    ResponseHandler.success(
      res,
      {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          account_type: user.account_type,
        },
        shipping_profile: {
          id: shippingProfile.id,
          company_name: shippingProfile.company_name,
          country: shippingProfile.country,
          currency: shippingProfile.currency,
          street_address_line_1: shippingProfile.street_address_line_1,
          street_address_line_2: shippingProfile.street_address_line_2,
          city: shippingProfile.city,
          state_province: shippingProfile.state_province,
          postal_code: shippingProfile.postal_code,
          is_profile_setup_complete: shippingProfile.is_profile_setup_complete,
          easypost_address_id: shippingProfile.easypost_address_id,
          easypost_verified_at: shippingProfile.easypost_verified_at,
        },
        // verified_address: {
        //   id: verifiedAddress.id,
        //   verified: verifiedAddress.verified,
        // },
      },
      "Profile setup completed successfully"
    );
  } catch (error) {
    console.error("Profile setup error:", error);
    ResponseHandler.error(res, "Profile setup failed");
  }
};

export const verifyAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addressData: AddressVerificationDto = req.body;

    const easyPostService = new EasyPostService();
    const verifiedAddress = await easyPostService.verifyAddress(addressData);

    ResponseHandler.success(
      res,
      {
        verified_address: verifiedAddress,
      },
      verifiedAddress.verified
        ? "Address verified successfully"
        : "Address verification failed"
    );
  } catch (error) {
    console.error("Address verification error:", error);
    ResponseHandler.error(res, "Address verification failed");
  }
};

export const getProfileSetupStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "account_type",
      ],
      include: [
        {
          model: ShippingProfile,
          as: "shipping_profile",
          attributes: [
            "id",
            "company_name",
            "country",
            "currency",
            "street_address_line_1",
            "street_address_line_2",
            "city",
            "state_province",
            "postal_code",
            "is_profile_setup_complete",
            "easypost_address_id",
            "easypost_verified_at",
          ],
        },
      ],
    });

    if (!user) {
      ResponseHandler.notFound(res, "User not found");
      return;
    }

    const isProfileComplete =
      user.shipping_profile?.is_profile_setup_complete || false;

    ResponseHandler.success(
      res,
      {
        profile_setup: {
          is_complete: isProfileComplete,
          user_data: user,
        },
      },
      "Profile setup status retrieved successfully"
    );
  } catch (error) {
    console.error("Get profile setup status error:", error);
    ResponseHandler.error(res, "Failed to retrieve profile setup status");
  }
};
