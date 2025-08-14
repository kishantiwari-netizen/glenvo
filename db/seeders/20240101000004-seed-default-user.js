"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create default super admin user
    const users = await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "Super",
          last_name: "Admin",
          email: "admin@example.com",
          password: hashedPassword,
          phone_number: "+1234567890",
          is_email_verified: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    // Get the super admin role
    const superAdminRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'super_admin';",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length > 0 && superAdminRole.length > 0) {
      // Assign super admin role to the default user
      await queryInterface.bulkInsert("user_roles", [
        {
          user_id: users[0].id,
          role_id: superAdminRole[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove user roles first
    await queryInterface.sequelize.query(
      "DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@example.com');"
    );

    // Remove the default user
    await queryInterface.bulkDelete(
      "users",
      { email: "admin@example.com" },
      {}
    );
  },
};
