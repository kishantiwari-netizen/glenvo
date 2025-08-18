import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from "class-validator";

export class PickupSchedulingDto {
  @IsString()
  shipment_id: string;

  @IsDateString()
  pickup_date: string;

  @IsString()
  pickup_time_start: string;

  @IsString()
  pickup_time_end: string;

  @IsString()
  @IsOptional()
  pickup_instructions?: string;

  @IsNumber()
  @Min(0)
  pickup_fee: number;

  @IsString()
  @IsOptional()
  time_slot_id?: string;
}
