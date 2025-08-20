import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import { sequelize } from "./models";
import {
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
} from "./modules";
import { ResponseHandler } from "./utils/responseHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API with Authentication",
      version: "1.0.0",
      description:
        "A Node.js TypeScript API with Sequelize, PostgreSQL, Swagger, and Role-based Authentication",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.routes.js",
    "./dist/modules/**/*.routes.js",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions) as any;

// Debug Swagger configuration
console.log("🔍 Swagger APIs paths:", swaggerOptions.apis);
console.log(
  "📋 Swagger spec generated:",
  Object.keys(swaggerSpec.paths || {}).length,
  "paths found"
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/profile-setup", profileSetupRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/account-settings", accountSettingsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payments/webhooks", paymentWebhookRoutes);

// 404 handler
app.use("*", (req, res) => {
  ResponseHandler.notFound(res, "Route not found", req.originalUrl);
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error handler:", err);

    if (err.type === "entity.parse.failed") {
      return ResponseHandler.badRequest(res, "Invalid JSON format");
    }

    return ResponseHandler.error(
      res,
      err.message || "Internal server error",
      err.status || 500,
      process.env.NODE_ENV === "development" ? err.stack : undefined
    );
  }
);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync database (in development) - only if needed
    if (
      process.env.NODE_ENV === "development" &&
      process.env.SYNC_DB === "true"
    ) {
      await sequelize.sync({ alter: true });
      console.log("✅ Database synchronized.");
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await sequelize.close();
  process.exit(0);
});

startServer();
