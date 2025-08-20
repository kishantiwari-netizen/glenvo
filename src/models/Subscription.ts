import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface SubscriptionAttributes {
  id?: number;
  user_id: number;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  stripe_product_id: string;
  status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  trial_start?: Date;
  trial_end?: Date;
  amount: number;
  currency: string;
  interval: "day" | "week" | "month" | "year";
  interval_count: number;
  metadata?: object;
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  user?: any;
}

interface SubscriptionCreationAttributes {
  user_id: number;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  stripe_product_id: string;
  status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end?: boolean;
  canceled_at?: Date;
  trial_start?: Date;
  trial_end?: Date;
  amount: number;
  currency: string;
  interval: "day" | "week" | "month" | "year";
  interval_count: number;
  metadata?: object;
  hash_id?: string;
  deleted_at?: Date;
}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: number;
  public user_id!: number;
  public stripe_subscription_id!: string;
  public stripe_customer_id!: string;
  public stripe_price_id!: string;
  public stripe_product_id!: string;
  public status!: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
  public current_period_start!: Date;
  public current_period_end!: Date;
  public cancel_at_period_end!: boolean;
  public canceled_at?: Date;
  public trial_start?: Date;
  public trial_end?: Date;
  public amount!: number;
  public currency!: string;
  public interval!: "day" | "week" | "month" | "year";
  public interval_count!: number;
  public metadata?: object;
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public user?: any; // For Sequelize associations
}

Subscription.init(
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
    stripe_subscription_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    stripe_customer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stripe_price_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stripe_product_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "canceled", "incomplete", "incomplete_expired", "past_due", "trialing", "unpaid"),
      allowNull: false,
      defaultValue: "incomplete",
    },
    current_period_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    current_period_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cancel_at_period_end: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    canceled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trial_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trial_end: {
      type: DataTypes.DATE,
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
    interval: {
      type: DataTypes.ENUM("day", "week", "month", "year"),
      allowNull: false,
      defaultValue: "month",
    },
    interval_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    metadata: {
      type: DataTypes.JSONB,
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
    tableName: "subscriptions",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["stripe_subscription_id"],
      },
      {
        fields: ["user_id"],
      },
      {
        fields: ["stripe_customer_id"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["current_period_end"],
      },
    ],
  }
);

export default Subscription;
