"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "permissions",
      [
        // User management permissions
        {
          name: "user_create",
          description: "Create new users",
          resource: "user",
          action: "create",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "user_read",
          description: "Read user information",
          resource: "user",
          action: "read",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "user_update",
          description: "Update user information",
          resource: "user",
          action: "update",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "user_delete",
          description: "Delete users",
          resource: "user",
          action: "delete",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Role management permissions
        {
          name: "role_create",
          description: "Create new roles",
          resource: "role",
          action: "create",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "role_read",
          description: "Read role information",
          resource: "role",
          action: "read",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "role_update",
          description: "Update role information",
          resource: "role",
          action: "update",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "role_delete",
          description: "Delete roles",
          resource: "role",
          action: "delete",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Permission management permissions
        {
          name: "permission_create",
          description: "Create new permissions",
          resource: "permission",
          action: "create",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "permission_read",
          description: "Read permission information",
          resource: "permission",
          action: "read",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "permission_update",
          description: "Update permission information",
          resource: "permission",
          action: "update",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "permission_delete",
          description: "Delete permissions",
          resource: "permission",
          action: "delete",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
