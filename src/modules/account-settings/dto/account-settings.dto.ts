import { UpdatePersonalInfoDto } from './personal-info.dto';
import { UpdateBusinessInfoDto } from './business-info.dto';

export class AccountSettingsDto {
  personal_info: UpdatePersonalInfoDto;
  business_info?: UpdateBusinessInfoDto;
}

export interface AccountSettingsResponse {
  personal_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    full_name: string;
  };
  business_info?: {
    company_name: string;
    business_type: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
  };
}
