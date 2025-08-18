import { IsNumber, IsString, IsOptional, Min } from "class-validator";

export class PackageDto {
  @IsNumber()
  @Min(0)
  length: number;

  @IsNumber()
  @Min(0)
  width: number;

  @IsNumber()
  @Min(0)
  height: number;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  declared_value: number;
}
