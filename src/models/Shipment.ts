import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface ShipmentAttributes {
  id?: number;
  user_id: number;
  sender_address_id: number;
  receiver_address_id: number;
  carrier_id?: number;
  service_type?: string;
  tracking_number?: string;
  status:
    | "draft"
    | "pending"
    | "confirmed"
    | "in_transit"
    | "delivered"
    | "cancelled"
    | "created"
    | "updated"
    | "returned"
    | "failed"
    | "out_for_delivery";
  total_amount: number;
  shipping_fee: number;
  insurance_fee: number;
  pickup_fee: number;
  tax_amount: number;
  currency: string;
  estimated_delivery_date?: Date;
  pickup_date?: Date;
  pickup_time_start?: string;
  pickup_time_end?: string;
  pickup_instructions?: string;
  signature_required: boolean;
  saturday_delivery: boolean;
  is_gift: boolean;
  adult_signature_required: boolean;
  expedited_delivery_date?: Date;
  return_delivery_date?: Date;
  label_url?: string;
  // EasyPost specific fields
  easypost_shipment_id?: string;
  tracking_code?: string;
  postage_label?: string;
  tracker?: string;
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  user?: any;
  sender_address?: any;
  receiver_address?: any;
  carrier?: any;
  packages?: any[];
}

interface ShipmentCreationAttributes {
  user_id: number;
  sender_address_id: number;
  receiver_address_id: number;
  carrier_id?: number;
  service_type?: string;
  status?:
    | "draft"
    | "pending"
    | "confirmed"
    | "in_transit"
    | "delivered"
    | "cancelled"
    | "created"
    | "updated"
    | "returned"
    | "failed"
    | "out_for_delivery";
  total_amount: number;
  shipping_fee: number;
  insurance_fee: number;
  pickup_fee: number;
  tax_amount: number;
  currency?: string;
  estimated_delivery_date?: Date;
  pickup_date?: Date;
  pickup_time_start?: string;
  pickup_time_end?: string;
  pickup_instructions?: string;
  signature_required?: boolean;
  saturday_delivery?: boolean;
  is_gift?: boolean;
  adult_signature_required?: boolean;
  expedited_delivery_date?: Date;
  return_delivery_date?: Date;
  label_url?: string;
  // EasyPost specific fields
  easypost_shipment_id?: string;
  tracking_code?: string;
  postage_label?: string;
  tracker?: string;
  hash_id?: string;
  deleted_at?: Date;
}

class Shipment
  extends Model<ShipmentAttributes, ShipmentCreationAttributes>
  implements ShipmentAttributes
{
  public id!: number;
  public user_id!: number;
  public sender_address_id!: number;
  public receiver_address_id!: number;
  public carrier_id?: number;
  public service_type?: string;
  public tracking_number?: string;
  public status!:
    | "draft"
    | "pending"
    | "confirmed"
    | "in_transit"
    | "delivered"
    | "cancelled"
    | "created"
    | "updated"
    | "returned"
    | "failed"
    | "out_for_delivery";
  public total_amount!: number;
  public shipping_fee!: number;
  public insurance_fee!: number;
  public pickup_fee!: number;
  public tax_amount!: number;
  public currency!: string;
  public estimated_delivery_date?: Date;
  public pickup_date?: Date;
  public pickup_time_start?: string;
  public pickup_time_end?: string;
  public pickup_instructions?: string;
  public signature_required!: boolean;
  public saturday_delivery!: boolean;
  public is_gift!: boolean;
  public adult_signature_required!: boolean;
  public expedited_delivery_date?: Date;
  public return_delivery_date?: Date;
  public label_url?: string;
  // EasyPost specific fields
  public easypost_shipment_id?: string;
  public tracking_code?: string;
  public postage_label?: string;
  public tracker?: string;
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public user?: any;
  public sender_address?: any;
  public receiver_address?: any;
  public carrier?: any;
  public packages?: any[];
}

Shipment.init(
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
    sender_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "shipping_addresses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    receiver_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "shipping_addresses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    carrier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "carriers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    service_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tracking_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(
        "draft",
        "pending",
        "confirmed",
        "in_transit",
        "delivered",
        "cancelled",
        "created",
        "updated",
        "returned",
        "failed",
        "out_for_delivery"
      ),
      allowNull: false,
      defaultValue: "draft",
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    insurance_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    pickup_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "USD",
    },
    estimated_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pickup_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    pickup_time_start: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    pickup_time_end: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    pickup_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    signature_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    saturday_delivery: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_gift: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    adult_signature_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    expedited_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    return_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    label_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // EasyPost specific fields
    easypost_shipment_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tracking_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    postage_label: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tracker: {
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
    tableName: "shipments",
    modelName: "Shipment",
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
  }
);

export default Shipment;
