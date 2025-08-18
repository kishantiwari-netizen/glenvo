import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
} from "class-validator";

export class ShipmentUpdateDto {
  @IsString()
  @IsOptional()
  service_type?: string;

  @IsDateString()
  @IsOptional()
  pickup_date?: string;

  @IsString()
  @IsOptional()
  pickup_time_start?: string;

  @IsString()
  @IsOptional()
  pickup_time_end?: string;

  @IsString()
  @IsOptional()
  pickup_instructions?: string;

  @IsBoolean()
  @IsOptional()
  signature_required?: boolean;

  @IsBoolean()
  @IsOptional()
  saturday_delivery?: boolean;

  @IsBoolean()
  @IsOptional()
  is_gift?: boolean;

  @IsBoolean()
  @IsOptional()
  adult_signature_required?: boolean;

  @IsNumber()
  @IsOptional()
  insurance_amount?: number;
}
