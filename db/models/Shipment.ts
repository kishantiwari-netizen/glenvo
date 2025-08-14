import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

export interface ShipmentAttributes {
  id: string;
  trackingNumber: string;
  type: "outbound" | "return";
  carrier: string;
  service: string;
  status: string;
  declaredValue: number;
  insurance?: string;
  shipmentDate: Date;
  estimatedDelivery?: Date;
  totalCost: number;
  origin: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  destination: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  package: {
    weight: number;
    dimensions: string;
    contents: string;
  };
  userId: string;
  originalShipmentId?: string;
  trackingHistory?: Array<{
    timestamp: Date;
    location: string;
    status: string;
    description: string;
  }>;
  labelUrl?: string;
  returnReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentCreationAttributes {
  trackingNumber: string;
  type: "outbound" | "return";
  carrier: string;
  service: string;
  status?: string;
  declaredValue: number;
  insurance?: string;
  shipmentDate: Date;
  estimatedDelivery?: Date;
  totalCost: number;
  origin: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  destination: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  package: {
    weight: number;
    dimensions: string;
    contents: string;
  };
  userId: string;
  originalShipmentId?: string;
  trackingHistory?: Array<{
    timestamp: Date;
    location: string;
    status: string;
    description: string;
  }>;
  labelUrl?: string;
  returnReason?: string;
}

class Shipment extends Model<
  InferAttributes<Shipment>,
  InferCreationAttributes<Shipment>
> {
  declare id: CreationOptional<string>;
  declare trackingNumber: string;
  declare type: "outbound" | "return";
  declare carrier: string;
  declare service: string;
  declare status: CreationOptional<string>;
  declare declaredValue: number;
  declare insurance: CreationOptional<string>;
  declare shipmentDate: Date;
  declare estimatedDelivery: CreationOptional<Date>;
  declare totalCost: number;
  declare origin: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  declare destination: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  declare package: {
    weight: number;
    dimensions: string;
    contents: string;
  };
  declare userId: string;
  declare originalShipmentId: CreationOptional<string>;
  declare trackingHistory: CreationOptional<
    Array<{
      timestamp: Date;
      location: string;
      status: string;
      description: string;
    }>
  >;
  declare labelUrl: CreationOptional<string>;
  declare returnReason: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance associations
  declare user?: any;
  declare originalShipment?: any;
  declare returns?: any[];
}

Shipment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("outbound", "return"),
      allowNull: false,
    },
    carrier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "In Transit",
        "Delivered",
        "Cancelled",
        "Exception",
        "Returned",
        "Pending Return"
      ),
      allowNull: false,
      defaultValue: "Pending",
    },
    declaredValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    insurance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    origin: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    destination: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    package: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    originalShipmentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    trackingHistory: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    labelUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    returnReason: {
      type: DataTypes.STRING,
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
    tableName: "shipments",
    timestamps: true,
  }
);

export default Shipment;
