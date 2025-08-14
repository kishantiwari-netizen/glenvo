import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  Max,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

// Create Role DTO
export class CreateRoleDto {
  @IsString({ message: "Name must be a string" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name cannot exceed 50 characters" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsString({ message: "Description must be a string" })
  @MinLength(5, { message: "Description must be at least 5 characters long" })
  @MaxLength(255, { message: "Description cannot exceed 255 characters" })
  @IsNotEmpty({ message: "Description is required" })
  description!: string;

  @IsOptional()
  @IsBoolean({ message: "Is active must be a boolean" })
  isActive?: boolean = true;
}

// Update Role DTO
export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name cannot exceed 50 characters" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(5, { message: "Description must be at least 5 characters long" })
  @MaxLength(255, { message: "Description cannot exceed 255 characters" })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: "Is active must be a boolean" })
  isActive?: boolean;
}

// Role ID Param DTO
export class RoleIdParamDto {
  @IsNumber({}, { message: "Role ID must be a number" })
  @IsInt({ message: "Role ID must be an integer" })
  @IsPositive({ message: "Role ID must be a positive number" })
  @IsNotEmpty({ message: "Role ID is required" })
  @Type(() => Number)
  id!: number;
}

// Get Roles Query DTO
export class GetRolesQueryDto {
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
  @IsBoolean({ message: "Is active must be a boolean" })
  isActive?: boolean;
}

// Assign Permissions DTO
export class AssignPermissionsDto {
  @IsArray({ message: "Permission IDs must be an array" })
  @IsNumber({}, { each: true, message: "Each permission ID must be a number" })
  @IsInt({ each: true, message: "Each permission ID must be an integer" })
  @IsPositive({
    each: true,
    message: "Each permission ID must be a positive number",
  })
  @IsNotEmpty({ message: "Permission IDs are required" })
  @Type(() => Number)
  permissionIds!: number[];
}

// Remove Permissions DTO
export class RemovePermissionsDto {
  @IsArray({ message: "Permission IDs must be an array" })
  @IsNumber({}, { each: true, message: "Each permission ID must be a number" })
  @IsInt({ each: true, message: "Each permission ID must be an integer" })
  @IsPositive({
    each: true,
    message: "Each permission ID must be a positive number",
  })
  @IsNotEmpty({ message: "Permission IDs are required" })
  @Type(() => Number)
  permissionIds!: number[];
}
