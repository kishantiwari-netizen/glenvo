import { IsString, IsOptional, IsEnum } from "class-validator";

export class AddressValidationDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsOptional()
  company_name?: string;

  @IsString()
  address_line_1: string;

  @IsString()
  @IsOptional()
  address_line_2?: string;

  @IsString()
  city: string;

  @IsString()
  state_province: string;

  @IsString()
  postal_code: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  special_instructions?: string;

  @IsEnum(["sender", "receiver"])
  address_type: "sender" | "receiver";
}
