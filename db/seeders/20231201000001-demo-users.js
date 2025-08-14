"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get role IDs dynamically
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles WHERE name IN ('admin', 'manager', 'user')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log("Found roles for users:", roles);

    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.name] = role.id;
    });

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          full_name: "Admin User",
          email: "admin@glenvo.com",
          password: hashedPassword,
          company_name: "GlenvoShip",
          role_id: roleMap.admin,
          is_active: true,
          email_verified: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          full_name: "John Doe",
          email: "john.doe@example.com",
          password: await bcrypt.hash("password123", saltRounds),
          company_name: "PFX International Inc.",
          role_id: roleMap.user, // user role
          is_active: true,
          email_verified: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          full_name: "Jane Smith",
          email: "jane.smith@example.com",
          password: await bcrypt.hash("password123", saltRounds),
          company_name: "Global Shipping Co.",
          role_id: roleMap.manager, // manager role
          is_active: true,
          email_verified: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
