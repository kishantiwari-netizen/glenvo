const { sequelize, User, RefreshToken, Role } = require("./db/models");

async function testDatabase() {
  try {
    console.log("🧪 Testing Database Connection and Models...\n");

    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Test model synchronization
    await sequelize.sync({ force: false });
    console.log("✅ Database models synchronized successfully.");

    // Get the user role first
    const userRole = await Role.findOne({ where: { name: "user" } });
    if (!userRole) {
      throw new Error("User role not found. Please run seeders first.");
    }

    // Test creating a user
    const testUser = await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      companyName: "Test Company",
      roleId: userRole.id,
    });
    console.log("✅ User created successfully:", testUser.id);

    // Test finding the user
    const foundUser = await User.findOne({
      where: { email: "test@example.com" },
    });
    console.log("✅ User found successfully:", foundUser.fullName);

    // Test password comparison
    const isValidPassword = await foundUser.comparePassword("password123");
    console.log("✅ Password comparison works:", isValidPassword);

    // Test creating a refresh token
    const refreshToken = await RefreshToken.create({
      token: "test-refresh-token-123",
      userId: foundUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    console.log("✅ Refresh token created successfully:", refreshToken.id);

    // Clean up test data
    await refreshToken.destroy();
    await foundUser.destroy();
    console.log("✅ Test data cleaned up successfully.");

    console.log("\n🎉 All database tests passed successfully!");
    console.log("📊 Database setup is working correctly.");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await sequelize.close();
    console.log("🔌 Database connection closed.");
  }
}

// Run the test
testDatabase();
