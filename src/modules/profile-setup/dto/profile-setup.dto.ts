import { IsString, IsOptional, IsEmail, IsEnum, IsBoolean } from 'class-validator';

export class ProfileSetupDto {
  @IsString()
  @IsOptional()
  company_name?: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsString()
  country: string;

  @IsString()
  currency: string;

  @IsString()
  street_address_line_1: string;

  @IsString()
  @IsOptional()
  street_address_line_2?: string;

  @IsString()
  city: string;

  @IsString()
  state_province: string;

  @IsString()
  postal_code: string;

  @IsEnum(['individual', 'business'])
  account_type: 'individual' | 'business';
}

export default ProfileSetupDto;
