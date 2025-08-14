import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

export interface BillingInfoAttributes {
  id: string;
  companyName: string;
  taxId?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingInfoCreationAttributes {
  companyName: string;
  taxId?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  userId: string;
}

class BillingInfo extends Model<
  InferAttributes<BillingInfo>,
  InferCreationAttributes<BillingInfo>
> {
  declare id: CreationOptional<string>;
  declare companyName: string;
  declare taxId: CreationOptional<string>;
  declare addressLine1: string;
  declare addressLine2: CreationOptional<string>;
  declare city: string;
  declare state: string;
  declare zipCode: string;
  declare country: string;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance associations
  declare user?: any;
}

BillingInfo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "billing_info",
    timestamps: true,
  }
);

export default BillingInfo;
