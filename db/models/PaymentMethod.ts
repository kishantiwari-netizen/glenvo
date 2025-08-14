import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

export interface PaymentMethodAttributes {
  id: string;
  cardType: string;
  lastFourDigits: string;
  expiryDate: string;
  isPrimary: boolean;
  isActive: boolean;
  cardholderName?: string;
  billingZipCode?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodCreationAttributes {
  cardType: string;
  lastFourDigits: string;
  expiryDate: string;
  isPrimary?: boolean;
  isActive?: boolean;
  cardholderName?: string;
  billingZipCode?: string;
  userId: string;
}

class PaymentMethod extends Model<
  InferAttributes<PaymentMethod>,
  InferCreationAttributes<PaymentMethod>
> {
  declare id: CreationOptional<string>;
  declare cardType: string;
  declare lastFourDigits: string;
  declare expiryDate: string;
  declare isPrimary: CreationOptional<boolean>;
  declare isActive: CreationOptional<boolean>;
  declare cardholderName: CreationOptional<string>;
  declare billingZipCode: CreationOptional<string>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance associations
  declare user?: any;
}

PaymentMethod.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cardType: {
      type: DataTypes.ENUM("visa", "mastercard", "amex", "discover"),
      allowNull: false,
    },
    lastFourDigits: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    cardholderName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billingZipCode: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "payment_methods",
    timestamps: true,
  }
);

export default PaymentMethod;
