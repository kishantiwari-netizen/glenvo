import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { sequelize, initializeModels } from "../db/models";
import { createSwaggerConfig } from "./config/swagger";
import routes from "./modules";

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Swagger configuration
const swaggerSpec = createSwaggerConfig({
  port: Number(PORT),
  environment: process.env.NODE_ENV || "development",
});

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
routes(app);
// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize models and database connection
    await initializeModels();
    console.log("✅ Database connection established successfully.");

    app.listen(PORT, () => {
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      console.log(`
🚀 GlenvoShip Authentication Server Started Successfully!
============================================================
📡 Server URL: http://localhost:${PORT}
📚 API Documentation: http://localhost:${PORT}/api-docs
🏥 Health Check: http://localhost:${PORT}/health
🌍 Environment: ${process.env.NODE_ENV || "development"}
🗄️  Database: ${process.env.DB_NAME || "glenvodev"}
⏰ Started at: ${currentTime}
============================================================
✨ Server is ready to handle requests!
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
