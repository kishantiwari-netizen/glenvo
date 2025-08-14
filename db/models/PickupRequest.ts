import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

export interface PickupRequestAttributes {
  id: string;
  pickupDate: Date;
  pickupTimeSlot: string;
  instructions?: string;
  status: string;
  pickupFee: number;
  pickupAddress: string;
  contactName?: string;
  contactPhone?: string;
  userId: string;
  shipmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PickupRequestCreationAttributes {
  pickupDate: Date;
  pickupTimeSlot: string;
  instructions?: string;
  status?: string;
  pickupFee: number;
  pickupAddress: string;
  contactName?: string;
  contactPhone?: string;
  userId: string;
  shipmentId?: string;
}

class PickupRequest extends Model<
  InferAttributes<PickupRequest>,
  InferCreationAttributes<PickupRequest>
> {
  declare id: CreationOptional<string>;
  declare pickupDate: Date;
  declare pickupTimeSlot: string;
  declare instructions: CreationOptional<string>;
  declare status: CreationOptional<string>;
  declare pickupFee: number;
  declare pickupAddress: string;
  declare contactName: CreationOptional<string>;
  declare contactPhone: CreationOptional<string>;
  declare userId: string;
  declare shipmentId: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance associations
  declare user?: any;
  declare shipment?: any;
}

PickupRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pickupDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pickupTimeSlot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Scheduled", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    pickupFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pickupAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shipmentId: {
      type: DataTypes.UUID,
      allowNull: true,
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
    tableName: "pickup_requests",
    timestamps: true,
  }
);

export default PickupRequest;
