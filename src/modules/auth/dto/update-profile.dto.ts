import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsISO8601,
} from "class-validator";

export class UpdateProfileDTO {
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
  @IsMobilePhone()
  phone_number?: string;

  @IsOptional()
  @IsISO8601()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}
