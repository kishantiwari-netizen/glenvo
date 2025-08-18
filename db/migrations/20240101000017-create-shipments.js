"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("shipments", {
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
      sender_address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "shipping_addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      receiver_address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "shipping_addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      carrier_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "carriers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      service_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM(
          "draft",
          "pending",
          "confirmed",
          "in_transit",
          "delivered",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "draft",
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      insurance_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      pickup_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "USD",
      },
      estimated_delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pickup_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      pickup_time_start: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      pickup_time_end: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      pickup_instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      signature_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      saturday_delivery: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_gift: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      adult_signature_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expedited_delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      return_delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      label_url: {
        type: Sequelize.STRING(500),
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
    await queryInterface.addIndex("shipments", ["user_id"]);
    await queryInterface.addIndex("shipments", ["status"]);
    await queryInterface.addIndex("shipments", ["carrier_id"]);
    await queryInterface.addIndex("shipments", ["tracking_number"]);
    await queryInterface.addIndex("shipments", ["created_at"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("shipments");
  },
};
