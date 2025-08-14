"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pickup_requests", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      pickup_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pickup_time_slot: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Scheduled", "Completed", "Cancelled"),
        allowNull: false,
        defaultValue: "Pending",
      },
      pickup_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      pickup_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      shipment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "shipments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex("pickup_requests", ["user_id"]);
    await queryInterface.addIndex("pickup_requests", ["shipment_id"]);
    await queryInterface.addIndex("pickup_requests", ["status"]);
    await queryInterface.addIndex("pickup_requests", ["pickup_date"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pickup_requests");
  },
};

