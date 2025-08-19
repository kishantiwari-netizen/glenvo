import { IsString, IsNotEmpty } from "class-validator";

export class VerifyResetTokenDTO {
  @IsString({ message: "Reset token must be a string" })
  @IsNotEmpty({ message: "Reset token is required" })
  reset_token: string;
}
