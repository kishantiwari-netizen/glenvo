import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface PaymentAttributes {
  id?: number;
  user_id: number;
  stripe_payment_intent_id: string;
  stripe_customer_id?: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "canceled" | "processing";
  payment_method: "card" | "bank_transfer" | "wallet" | "other";
  description?: string;
  metadata?: object;
  receipt_url?: string;
  refunded: boolean;
  refunded_at?: Date;
  refund_amount?: number;
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  user?: any;
}

interface PaymentCreationAttributes {
  user_id: number;
  stripe_payment_intent_id: string;
  stripe_customer_id?: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "canceled" | "processing";
  payment_method: "card" | "bank_transfer" | "wallet" | "other";
  description?: string;
  metadata?: object;
  receipt_url?: string;
  refunded?: boolean;
  refunded_at?: Date;
  refund_amount?: number;
  hash_id?: string;
  deleted_at?: Date;
}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public user_id!: number;
  public stripe_payment_intent_id!: string;
  public stripe_customer_id?: string;
  public amount!: number;
  public currency!: string;
  public status!: "pending" | "succeeded" | "failed" | "canceled" | "processing";
  public payment_method!: "card" | "bank_transfer" | "wallet" | "other";
  public description?: string;
  public metadata?: object;
  public receipt_url?: string;
  public refunded!: boolean;
  public refunded_at?: Date;
  public refund_amount?: number;
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public user?: any; // For Sequelize associations
}

Payment.init(
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
    stripe_payment_intent_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    stripe_customer_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "USD",
      validate: {
        isIn: [["USD", "EUR", "GBP", "CAD", "AUD"]],
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "succeeded", "failed", "canceled", "processing"),
      allowNull: false,
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.ENUM("card", "bank_transfer", "wallet", "other"),
      allowNull: false,
      defaultValue: "card",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    receipt_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    refunded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
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
    tableName: "payments",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["stripe_payment_intent_id"],
      },
      {
        fields: ["user_id"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["created_at"],
      },
    ],
  }
);

export default Payment;
