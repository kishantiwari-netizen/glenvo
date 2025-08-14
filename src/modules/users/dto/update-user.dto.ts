import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsISO8601,
  IsArray,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone()
  phone_number?: string;

  @IsOptional()
  @IsISO8601()
  date_of_birth?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(["individual", "business"])
  account_type?: "individual" | "business";

  @IsOptional()
  @IsBoolean()
  agreement_acceptance?: boolean;

  @IsOptional()
  @IsBoolean()
  marketing_opt_in?: boolean;

  @IsOptional()
  @IsBoolean()
  social_media_acceptance?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  role_id?: number;
}
