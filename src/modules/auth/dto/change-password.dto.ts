import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @MinLength(6)
  new_password: string;
}
