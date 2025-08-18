"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("shipping_addresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      address_line_1: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address_line_2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state_province: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      special_instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      address_type: {
        type: Sequelize.ENUM("sender", "receiver"),
        allowNull: false,
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
    await queryInterface.addIndex("shipping_addresses", ["user_id"]);
    await queryInterface.addIndex("shipping_addresses", ["address_type"]);
    await queryInterface.addIndex("shipping_addresses", ["is_default"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("shipping_addresses");
  },
};
