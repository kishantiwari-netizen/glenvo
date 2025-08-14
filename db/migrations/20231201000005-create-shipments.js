"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shipments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tracking_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM("outbound", "return"),
        allowNull: false,
      },
      carrier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "Pending",
          "In Transit",
          "Delivered",
          "Cancelled",
          "Exception",
          "Returned",
          "Pending Return"
        ),
        allowNull: false,
        defaultValue: "Pending",
      },
      declared_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      insurance: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estimated_delivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      origin: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      destination: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      package: {
        type: Sequelize.JSON,
        allowNull: false,
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
      original_shipment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "shipments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tracking_history: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      label_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      return_reason: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.addIndex("shipments", ["user_id"]);
    await queryInterface.addIndex("shipments", ["tracking_number"]);
    await queryInterface.addIndex("shipments", ["status"]);
    await queryInterface.addIndex("shipments", ["carrier"]);
    await queryInterface.addIndex("shipments", ["shipment_date"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("shipments");
  },
};

