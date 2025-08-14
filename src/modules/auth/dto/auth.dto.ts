import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from "class-validator";

// Login DTO
export class LoginDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}

// Register DTO
export class RegisterDto {
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
}

// Refresh Token DTO
export class RefreshTokenDto {
  @IsString({ message: "Refresh token must be a string" })
  @IsNotEmpty({ message: "Refresh token is required" })
  refreshToken!: string;
}

// Change Password DTO
export class ChangePasswordDto {
  @IsString({ message: "Current password must be a string" })
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword!: string;

  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  @MaxLength(255, { message: "New password cannot exceed 255 characters" })
  @IsNotEmpty({ message: "New password is required" })
  newPassword!: string;
}

// Update Profile DTO
export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: "Full name must be a string" })
  @MinLength(2, { message: "Full name must be at least 2 characters long" })
  @MaxLength(100, { message: "Full name cannot exceed 100 characters" })
  fullName?: string;

  @IsOptional()
  @IsString({ message: "Company name must be a string" })
  @MaxLength(255, { message: "Company name cannot exceed 255 characters" })
  companyName?: string;
}

// Logout DTO
export class LogoutDto {
  @IsString({ message: "Refresh token must be a string" })
  @IsNotEmpty({ message: "Refresh token is required" })
  refreshToken!: string;
}
