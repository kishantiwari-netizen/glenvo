"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "admin",
          description: "Administrator with full system access",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "manager",
          description: "Manager with limited administrative access",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "user",
          description: "Regular user with basic access",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "guest",
          description: "Guest user with read-only access",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
