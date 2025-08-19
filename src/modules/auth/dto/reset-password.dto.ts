import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class ResetPasswordDTO {
  @IsString({ message: "Reset token must be a string" })
  @IsNotEmpty({ message: "Reset token is required" })
  reset_token: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;

  @IsString({ message: "Confirm password must be a string" })
  @IsNotEmpty({ message: "Confirm password is required" })
  confirm_password: string;
}
