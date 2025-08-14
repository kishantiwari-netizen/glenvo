import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

export interface SupportTicketAttributes {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  estimatedResponse?: string;
  adminResponse?: string;
  userId: string;
  shipmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportTicketCreationAttributes {
  subject: string;
  message: string;
  status?: string;
  priority?: string;
  estimatedResponse?: string;
  adminResponse?: string;
  userId: string;
  shipmentId?: string;
}

class SupportTicket extends Model<
  InferAttributes<SupportTicket>,
  InferCreationAttributes<SupportTicket>
> {
  declare id: CreationOptional<string>;
  declare subject: string;
  declare message: string;
  declare status: CreationOptional<string>;
  declare priority: CreationOptional<string>;
  declare estimatedResponse: CreationOptional<string>;
  declare adminResponse: CreationOptional<string>;
  declare userId: string;
  declare shipmentId: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance associations
  declare user?: any;
  declare shipment?: any;
}

SupportTicket.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Open", "In Progress", "Resolved", "Closed"),
      allowNull: false,
      defaultValue: "Open",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High", "Urgent"),
      allowNull: false,
      defaultValue: "Medium",
    },
    estimatedResponse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminResponse: {
      type: DataTypes.TEXT,
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
    tableName: "support_tickets",
    timestamps: true,
  }
);

export default SupportTicket;
