"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("permissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 100],
        },
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          len: [5, 255],
        },
      },
      resource: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      scope: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          len: [1, 50],
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("permissions", ["name"], {
      unique: true,
      name: "permissions_name_unique",
    });

    await queryInterface.addIndex("permissions", ["resource", "action"], {
      name: "permissions_resource_action_index",
    });

    await queryInterface.addIndex("permissions", ["is_active"], {
      name: "permissions_is_active_index",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("permissions");
  },
};
