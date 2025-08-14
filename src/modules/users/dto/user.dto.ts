import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

// Create User DTO
export class CreateUserDto {
  @IsString({ message: "Full name must be a string" })
  @MinLength(2, { message: "Full name must be at least 2 characters long" })
  @MaxLength(100, { message: "Full name cannot exceed 100 characters" })
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;

  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @MaxLength(255, { message: "Password cannot exceed 255 characters" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string;

  @IsOptional()
  @IsString({ message: "Company name must be a string" })
  @MaxLength(255, { message: "Company name cannot exceed 255 characters" })
  companyName?: string;

  @IsNumber({}, { message: "Role ID must be a number" })
  @IsInt({ message: "Role ID must be an integer" })
  @IsPositive({ message: "Role ID must be a positive number" })
  @IsNotEmpty({ message: "Role ID is required" })
  @Type(() => Number)
  roleId!: number;
}

// Update User DTO
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Full name must be a string" })
  @MinLength(2, { message: "Full name must be at least 2 characters long" })
  @MaxLength(100, { message: "Full name cannot exceed 100 characters" })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString({ message: "Company name must be a string" })
  @MaxLength(255, { message: "Company name cannot exceed 255 characters" })
  companyName?: string;

  @IsOptional()
  @IsNumber({}, { message: "Role ID must be a number" })
  @IsInt({ message: "Role ID must be an integer" })
  @IsPositive({ message: "Role ID must be a positive number" })
  @Type(() => Number)
  roleId?: number;

  @IsOptional()
  @IsBoolean({ message: "Is active must be a boolean" })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Email verified must be a boolean" })
  emailVerified?: boolean;
}

// Get Users Query DTO
export class GetUsersQueryDto {
  @IsOptional()
  @IsNumber({}, { message: "Page must be a number" })
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be at least 1" })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber({}, { message: "Limit must be a number" })
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(100, { message: "Limit cannot exceed 100" })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: "Search must be a string" })
  @MaxLength(100, { message: "Search cannot exceed 100 characters" })
  search?: string;

  @IsOptional()
  @IsNumber({}, { message: "Role ID must be a number" })
  @IsInt({ message: "Role ID must be an integer" })
  @IsPositive({ message: "Role ID must be a positive number" })
  @Type(() => Number)
  roleId?: number;

  @IsOptional()
  @IsBoolean({ message: "Is active must be a boolean" })
  isActive?: boolean;
}

// User ID Param DTO
export class UserIdParamDto {
  @IsNumber({}, { message: "User ID must be a number" })
  @IsInt({ message: "User ID must be an integer" })
  @IsPositive({ message: "User ID must be a positive number" })
  @IsNotEmpty({ message: "User ID is required" })
  @Type(() => Number)
  id!: number;
}
