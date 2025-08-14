"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 50],
        },
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          len: [5, 255],
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
    await queryInterface.addIndex("roles", ["name"], {
      unique: true,
      name: "roles_name_unique",
    });

    await queryInterface.addIndex("roles", ["is_active"], {
      name: "roles_is_active_index",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("roles");
  },
};
