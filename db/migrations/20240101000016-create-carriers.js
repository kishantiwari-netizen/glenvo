"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("carriers", {
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
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      logo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      website_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      base_shipping_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      pickup_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      insurance_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      fuel_surcharge_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      weekend_delivery_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      packaging_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "USD",
      },
      estimated_delivery_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      service_description: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addIndex("carriers", ["is_active"]);
    await queryInterface.addIndex("carriers", ["code"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("carriers");
  },
};
