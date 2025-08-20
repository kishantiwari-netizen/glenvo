import authRoutes from "./auth";
import usersRoutes from "./users";
import profileSetupRoutes from "./profile-setup";
import shippingRoutes from "./shipping";
import rolesRoutes from "./roles";
import { webhookRoutes } from "./webhooks";
import { adminRoutes } from "./admin";
import { locationRoutes } from "./locations";
import accountSettingsRoutes from "./account-settings/account-settings.routes";
import paymentRoutes from "./payments/payments.routes";
import paymentWebhookRoutes from "./payments/webhooks.routes";

export {
  authRoutes,
  usersRoutes,
  profileSetupRoutes,
  shippingRoutes,
  rolesRoutes,
  webhookRoutes,
  adminRoutes,
  locationRoutes,
  accountSettingsRoutes,
  paymentRoutes,
  paymentWebhookRoutes,
};
