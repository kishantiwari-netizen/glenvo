import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "api_auth_db",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "your_password",
  // logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

// Import models
import User from "./User";
import Role from "./Role";
import Permission from "./Permission";
import UserRole from "./UserRole";
import RolePermission from "./RolePermission";
import ShippingProfile from "./ShippingProfile";
import Shipment from "./Shipment";
import ShippingAddress from "./ShippingAddress";
import Package from "./Package";
import Carrier from "./Carrier";

// Define associations
// User has one role (single role per user)
User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

Role.hasMany(User, {
  foreignKey: "role_id",
  as: "users",
});

// User has one shipping profile
User.hasOne(ShippingProfile, {
  foreignKey: "user_id",
  as: "shipping_profile",
});

ShippingProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles",
});

// Shipping associations
// User has many shipments
User.hasMany(Shipment, {
  foreignKey: "user_id",
  as: "shipments",
});

Shipment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User has many shipping addresses
User.hasMany(ShippingAddress, {
  foreignKey: "user_id",
  as: "shipping_addresses",
});

ShippingAddress.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Shipment has sender and receiver addresses
Shipment.belongsTo(ShippingAddress, {
  foreignKey: "sender_address_id",
  as: "sender_address",
});

Shipment.belongsTo(ShippingAddress, {
  foreignKey: "receiver_address_id",
  as: "receiver_address",
});

// Shipment has many packages
Shipment.hasMany(Package, {
  foreignKey: "shipment_id",
  as: "packages",
});

Package.belongsTo(Shipment, {
  foreignKey: "shipment_id",
  as: "shipment",
});

// Shipment belongs to carrier
Shipment.belongsTo(Carrier, {
  foreignKey: "carrier_id",
  as: "carrier",
});

Carrier.hasMany(Shipment, {
  foreignKey: "carrier_id",
  as: "shipments",
});

export {
  sequelize,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  ShippingProfile,
  Shipment,
  ShippingAddress,
  Package,
  Carrier,
};

export default sequelize;
