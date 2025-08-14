import { Application } from "express";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./users/user.routes";
import roleRoutes from "./roles/role.routes";
import settingsRoutes from "./settings/settings.routes";
import notificationsRoutes from "./notifications/notifications.routes";
import markupRoutes from "./markup/markup.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";
import shippingRoutes from "./shipping/shipping.routes";
import pickupRoutes from "./pickups/pickup.routes";
import paymentRoutes from "./payments/payment.routes";
import profileRoutes from "./profile/profile.routes";

export default function routes(app: Application) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/markup", markupRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/shipments", shippingRoutes);
  app.use("/api/pickups", pickupRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/profile", profileRoutes);
}
