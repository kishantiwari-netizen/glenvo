import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

export interface SavedAddressAttributes {
  id: string;
  name: string;
  type: "sender" | "receiver";
  contactName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedAddressCreationAttributes {
  name: string;
  type: "sender" | "receiver";
  contactName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault?: boolean;
  userId: string;
}

class SavedAddress extends Model<
  InferAttributes<SavedAddress>,
  InferCreationAttributes<SavedAddress>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare type: "sender" | "receiver";
  declare contactName: string;
  declare addressLine1: string;
  declare addressLine2: CreationOptional<string>;
  declare city: string;
  declare state: string;
  declare zipCode: string;
  declare country: string;
  declare phone: CreationOptional<string>;
  declare email: CreationOptional<string>;
  declare isDefault: CreationOptional<boolean>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance associations
  declare user?: any;
}

SavedAddress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("sender", "receiver"),
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "saved_addresses",
    timestamps: true,
  }
);

export default SavedAddress;
