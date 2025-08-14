require("dotenv").config();

console.log("=== Environment Variables Test ===");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***SET***" : "NOT SET");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "***SET***" : "NOT SET");
console.log("===================================");

// Test database connection
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "crest@12",
  database: process.env.DB_NAME || "glenvodev",
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
