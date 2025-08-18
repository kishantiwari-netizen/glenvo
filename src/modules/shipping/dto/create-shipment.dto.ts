import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
  IsDateString,
  ValidateNested,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ShippingAddressDto } from "./shipping-address.dto";
import { PackageDto } from "./package.dto";

export class CreateShipmentDto {
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  sender_address: ShippingAddressDto;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  receiver_address: ShippingAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsBoolean()
  @IsOptional()
  signature_required?: boolean;

  @IsBoolean()
  @IsOptional()
  saturday_delivery?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  insurance_amount?: number;

  @IsDateString()
  @IsOptional()
  pickup_date?: string;

  @IsBoolean()
  @IsOptional()
  is_gift?: boolean;

  @IsBoolean()
  @IsOptional()
  adult_signature_required?: boolean;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  pickup_intent?: boolean;

  @IsBoolean()
  @IsOptional()
  insurance_enabled?: boolean;
}
