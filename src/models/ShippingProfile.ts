import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface ShippingProfileAttributes {
  id?: number;
  user_id: number;
  company_name?: string;
  country?: string;
  currency?: string;
  street_address_line_1?: string;
  street_address_line_2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  is_profile_setup_complete?: boolean;
  easypost_address_id?: string;
  easypost_verified_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface ShippingProfileCreationAttributes
  extends Omit<ShippingProfileAttributes, "id" | "created_at" | "updated_at"> {}

class ShippingProfile
  extends Model<ShippingProfileAttributes, ShippingProfileCreationAttributes>
  implements ShippingProfileAttributes
{
  public id!: number;
  public user_id!: number;
  public company_name?: string;
  public country?: string;
  public currency?: string;
  public street_address_line_1?: string;
  public street_address_line_2?: string;
  public city?: string;
  public state_province?: string;
  public postal_code?: string;
  public is_profile_setup_complete?: boolean;
  public easypost_address_id?: string;
  public easypost_verified_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ShippingProfile.init(
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
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "USD",
    },
    street_address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    street_address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state_province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_profile_setup_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    easypost_address_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    easypost_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "shipping_profiles",
    modelName: "ShippingProfile",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id"],
      },
    ],
  }
);

export default ShippingProfile;
