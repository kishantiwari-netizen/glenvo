"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add EasyPost fields to shipments table
    await queryInterface.addColumn("shipments", "easypost_shipment_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("shipments", "tracking_code", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("shipments", "postage_label", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("shipments", "tracker", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Update the status enum to include new statuses
    await queryInterface.changeColumn("shipments", "status", {
      type: Sequelize.ENUM(
        "draft",
        "pending",
        "confirmed",
        "in_transit",
        "delivered",
        "cancelled",
        "created",
        "updated",
        "returned",
        "failed",
        "out_for_delivery"
      ),
      allowNull: false,
      defaultValue: "draft",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove EasyPost fields
    await queryInterface.removeColumn("shipments", "easypost_shipment_id");
    await queryInterface.removeColumn("shipments", "tracking_code");
    await queryInterface.removeColumn("shipments", "postage_label");
    await queryInterface.removeColumn("shipments", "tracker");

    // Revert status enum to original values
    await queryInterface.changeColumn("shipments", "status", {
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
    });
  },
};
