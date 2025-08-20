import { IsString, IsOptional, IsEnum, Length } from 'class-validator';

export enum BusinessType {
  ECOMMERCE_RETAILER = 'eCommerce Retailer',
  WHOLESALE_DISTRIBUTOR = 'Wholesale Distributor',
  MANUFACTURER = 'Manufacturer',
  DROPSHIPPER = 'Dropshipper',
  MARKETPLACE_SELLER = 'Marketplace Seller',
  OTHER = 'Other'
}

export class UpdateBusinessInfoDto {
  @IsString()
  @Length(1, 100)
  company_name: string;

  @IsEnum(BusinessType)
  business_type: BusinessType;

  @IsString()
  @Length(1, 255)
  address_line_1: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  address_line_2?: string;

  @IsString()
  @Length(1, 100)
  city: string;

  @IsString()
  @Length(1, 100)
  state_province: string;

  @IsString()
  @Length(1, 20)
  postal_code: string;

  @IsString()
  @Length(2, 2)
  country: string;
}
