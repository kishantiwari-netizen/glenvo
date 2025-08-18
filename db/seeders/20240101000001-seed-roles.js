"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "super_admin",
          description: "Super Administrator with full system access",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "admin",
          description: "Administrator with management access",
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
          name: "moderator",
          description: "Moderator with content management access",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
