import { Model, ModelStatic } from "sequelize";
import User from "../models/User";
import Role from "../models/Role";
import Permission from "../models/Permission";
import RefreshToken from "../models/RefreshToken";
import RolePermission from "../models/RolePermission";
import Shipment from "../models/Shipment";
import PaymentMethod from "../models/PaymentMethod";
import BillingInfo from "../models/BillingInfo";
import SavedAddress from "../models/SavedAddress";
import PickupRequest from "../models/PickupRequest";
import SupportTicket from "../models/SupportTicket";

// Define the models interface
export interface Models {
  User: ModelStatic<User>;
  Role: ModelStatic<Role>;
  Permission: ModelStatic<Permission>;
  RefreshToken: ModelStatic<RefreshToken>;
  RolePermission: ModelStatic<RolePermission>;
  Shipment: ModelStatic<Shipment>;
  PaymentMethod: ModelStatic<PaymentMethod>;
  BillingInfo: ModelStatic<BillingInfo>;
  SavedAddress: ModelStatic<SavedAddress>;
  PickupRequest: ModelStatic<PickupRequest>;
  SupportTicket: ModelStatic<SupportTicket>;
}

// Export individual model types
export type UserModel = ModelStatic<User>;
export type RoleModel = ModelStatic<Role>;
export type PermissionModel = ModelStatic<Permission>;
export type RefreshTokenModel = ModelStatic<RefreshToken>;
export type RolePermissionModel = ModelStatic<RolePermission>;
export type ShipmentModel = ModelStatic<Shipment>;
export type PaymentMethodModel = ModelStatic<PaymentMethod>;
export type BillingInfoModel = ModelStatic<BillingInfo>;
export type SavedAddressModel = ModelStatic<SavedAddress>;
export type PickupRequestModel = ModelStatic<PickupRequest>;
export type SupportTicketModel = ModelStatic<SupportTicket>;

// Export instance types
export type UserInstance = User;
export type RoleInstance = Role;
export type PermissionInstance = Permission;
export type RefreshTokenInstance = RefreshToken;
export type RolePermissionInstance = RolePermission;
export type ShipmentInstance = Shipment;
export type PaymentMethodInstance = PaymentMethod;
export type BillingInfoInstance = BillingInfo;
export type SavedAddressInstance = SavedAddress;
export type PickupRequestInstance = PickupRequest;
export type SupportTicketInstance = SupportTicket;

// User with associations
export interface UserWithRole extends User {
  role?: Role;
  refreshTokens?: RefreshToken[];
  shipments?: Shipment[];
  paymentMethods?: PaymentMethod[];
  billingInfo?: BillingInfo;
  savedAddresses?: SavedAddress[];
  pickupRequests?: PickupRequest[];
  supportTickets?: SupportTicket[];
}

// Role with associations
export interface RoleWithUsers extends Role {
  users?: User[];
}

// Role with permissions
export interface RoleWithPermissions extends Role {
  permissions?: Permission[];
}

// Permission with roles
export interface PermissionWithRoles extends Permission {
  roles?: Role[];
}

// RefreshToken with associations
export interface RefreshTokenWithUser extends RefreshToken {
  user?: User;
}

// Shipment with associations
export interface ShipmentWithAssociations extends Shipment {
  user?: User;
  originalShipment?: Shipment;
  returns?: Shipment[];
  pickupRequests?: PickupRequest[];
  supportTickets?: SupportTicket[];
}

// PaymentMethod with associations
export interface PaymentMethodWithUser extends PaymentMethod {
  user?: User;
}

// BillingInfo with associations
export interface BillingInfoWithUser extends BillingInfo {
  user?: User;
}

// SavedAddress with associations
export interface SavedAddressWithUser extends SavedAddress {
  user?: User;
}

// PickupRequest with associations
export interface PickupRequestWithAssociations extends PickupRequest {
  user?: User;
  shipment?: Shipment;
}

// SupportTicket with associations
export interface SupportTicketWithAssociations extends SupportTicket {
  user?: User;
  shipment?: Shipment;
}

// JWT Token payload
export interface TokenPayload {
  userId: string;
  email: string;
  roleId: number;
}

// Authenticated request interface
export interface AuthenticatedRequest {
  user?: {
    userId: string;
    email: string;
    roleId: number;
    roleName?: string;
    permissions?: string[];
  };
}
