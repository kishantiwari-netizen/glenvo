import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from "class-validator";

export class CarrierSelectionDto {
  @IsNumber()
  carrier_id: number;

  @IsString()
  service_type: string;

  @IsString()
  @IsOptional()
  carrier_code?: string; // For EasyPost integration

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

  @IsNumber()
  @Min(0)
  @IsOptional()
  pickup_fee?: number;

  @IsString()
  @IsOptional()
  easypost_rate_id?: string;

  @IsString()
  @IsOptional()
  easypost_shipment_id?: string;
}
