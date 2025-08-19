import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface CarrierAttributes {
  id?: number;
  name: string;
  code: string;
  logo_url?: string;
  website_url?: string;
  is_active: boolean;
  base_shipping_fee: number;
  pickup_fee: number;
  insurance_fee: number;
  fuel_surcharge_rate: number;
  weekend_delivery_fee: number;
  packaging_fee: number;
  tax_rate: number;
  currency: string;
  estimated_delivery_days: number;
  service_description?: string;
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  shipments?: any[];
}

interface CarrierCreationAttributes {
  name: string;
  code: string;
  logo_url?: string;
  website_url?: string;
  is_active?: boolean;
  base_shipping_fee: number;
  pickup_fee: number;
  insurance_fee: number;
  fuel_surcharge_rate: number;
  weekend_delivery_fee: number;
  packaging_fee: number;
  tax_rate: number;
  currency?: string;
  estimated_delivery_days: number;
  service_description?: string;
  hash_id?: string;
  deleted_at?: Date;
}

class Carrier
  extends Model<CarrierAttributes, CarrierCreationAttributes>
  implements CarrierAttributes
{
  public id!: number;
  public name!: string;
  public code!: string;
  public logo_url?: string;
  public website_url?: string;
  public is_active!: boolean;
  public base_shipping_fee!: number;
  public pickup_fee!: number;
  public insurance_fee!: number;
  public fuel_surcharge_rate!: number;
  public weekend_delivery_fee!: number;
  public packaging_fee!: number;
  public tax_rate!: number;
  public currency!: string;
  public estimated_delivery_days!: number;
  public service_description?: string;
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public shipments?: any[];
}

Carrier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    website_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    base_shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    pickup_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    insurance_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    fuel_surcharge_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    weekend_delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    packaging_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "USD",
    },
    estimated_delivery_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    service_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hash_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    tableName: "carriers",
    modelName: "Carrier",
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
  }
);

export default Carrier;
