import sequelize from "../config/database";
import User from "./User";
import RefreshToken from "./RefreshToken";
import Role from "./Role";
import Permission from "./Permission";
import RolePermission from "./RolePermission";
import Shipment from "./Shipment";
import PaymentMethod from "./PaymentMethod";
import BillingInfo from "./BillingInfo";
import SavedAddress from "./SavedAddress";
import PickupRequest from "./PickupRequest";
import SupportTicket from "./SupportTicket";
import { Models } from "../types";

// Initialize sequelize connection
const initializeModels = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established for models.");
  } catch (error) {
    console.error("❌ Database connection failed for models:", error);
    throw error;
  }
};

// User associations
User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Role associations
Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
  onDelete: "RESTRICT",
});

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

// Role-Permission associations (many-to-many)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

// Shipment associations
User.hasMany(Shipment, {
  foreignKey: "userId",
  as: "shipments",
  onDelete: "CASCADE",
});

Shipment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Self-referencing association for returns
Shipment.hasMany(Shipment, {
  foreignKey: "originalShipmentId",
  as: "returns",
  onDelete: "CASCADE",
});

Shipment.belongsTo(Shipment, {
  foreignKey: "originalShipmentId",
  as: "originalShipment",
});

// Payment method associations
User.hasMany(PaymentMethod, {
  foreignKey: "userId",
  as: "paymentMethods",
  onDelete: "CASCADE",
});

PaymentMethod.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Billing info associations
User.hasOne(BillingInfo, {
  foreignKey: "userId",
  as: "billingInfo",
  onDelete: "CASCADE",
});

BillingInfo.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Saved address associations
User.hasMany(SavedAddress, {
  foreignKey: "userId",
  as: "savedAddresses",
  onDelete: "CASCADE",
});

SavedAddress.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Pickup request associations
User.hasMany(PickupRequest, {
  foreignKey: "userId",
  as: "pickupRequests",
  onDelete: "CASCADE",
});

PickupRequest.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Shipment.hasMany(PickupRequest, {
  foreignKey: "shipmentId",
  as: "pickupRequests",
  onDelete: "CASCADE",
});

PickupRequest.belongsTo(Shipment, {
  foreignKey: "shipmentId",
  as: "shipment",
});

// Support ticket associations
User.hasMany(SupportTicket, {
  foreignKey: "userId",
  as: "supportTickets",
  onDelete: "CASCADE",
});

SupportTicket.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Shipment.hasMany(SupportTicket, {
  foreignKey: "shipmentId",
  as: "supportTickets",
  onDelete: "CASCADE",
});

SupportTicket.belongsTo(Shipment, {
  foreignKey: "shipmentId",
  as: "shipment",
});

// Create typed models object
const models: Models = {
  User,
  RefreshToken,
  Role,
  Permission,
  RolePermission,
  Shipment,
  PaymentMethod,
  BillingInfo,
  SavedAddress,
  PickupRequest,
  SupportTicket,
};

export {
  sequelize,
  User,
  RefreshToken,
  Role,
  Permission,
  RolePermission,
  Shipment,
  PaymentMethod,
  BillingInfo,
  SavedAddress,
  PickupRequest,
  SupportTicket,
  initializeModels,
  models,
};
