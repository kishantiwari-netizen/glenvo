import { IsString, IsEmail, IsOptional, IsPhoneNumber, Length, Matches } from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  @Length(1, 50)
  first_name: string;

  @IsString()
  @Length(1, 50)
  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone_number?: string;
}
