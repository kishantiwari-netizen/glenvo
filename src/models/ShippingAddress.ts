import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface ShippingAddressAttributes {
  id?: number;
  user_id: number;
  first_name: string;
  last_name: string;
  company_name?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone_number?: string;
  email?: string;
  special_instructions?: string;
  is_default: boolean;
  address_type: "sender" | "receiver";
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  user?: any;
}

interface ShippingAddressCreationAttributes {
  user_id: number;
  first_name: string;
  last_name: string;
  company_name?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone_number?: string;
  email?: string;
  special_instructions?: string;
  is_default?: boolean;
  address_type: "sender" | "receiver";
  hash_id?: string;
  deleted_at?: Date;
}

class ShippingAddress
  extends Model<ShippingAddressAttributes, ShippingAddressCreationAttributes>
  implements ShippingAddressAttributes
{
  public id!: number;
  public user_id!: number;
  public first_name!: string;
  public last_name!: string;
  public company_name?: string;
  public address_line_1!: string;
  public address_line_2?: string;
  public city!: string;
  public state_province!: string;
  public postal_code!: string;
  public country!: string;
  public phone_number?: string;
  public email?: string;
  public special_instructions?: string;
  public is_default!: boolean;
  public address_type!: "sender" | "receiver";
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public user?: any;

  public get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  public get fullAddress(): string {
    const parts = [
      this.address_line_1,
      this.address_line_2,
      this.city,
      this.state_province,
      this.postal_code,
      this.country,
    ].filter(Boolean);
    return parts.join(", ");
  }
}

ShippingAddress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state_province: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^\+?[\d\s\-\(\)]+$/,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    special_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    address_type: {
      type: DataTypes.ENUM("sender", "receiver"),
      allowNull: false,
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
    tableName: "shipping_addresses",
    modelName: "ShippingAddress",
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
  }
);

export default ShippingAddress;
