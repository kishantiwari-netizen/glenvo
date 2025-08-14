"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("support_tickets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Open", "In Progress", "Resolved", "Closed"),
        allowNull: false,
        defaultValue: "Open",
      },
      priority: {
        type: Sequelize.ENUM("Low", "Medium", "High", "Urgent"),
        allowNull: false,
        defaultValue: "Medium",
      },
      estimated_response: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      admin_response: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex("support_tickets", ["user_id"]);
    await queryInterface.addIndex("support_tickets", ["shipment_id"]);
    await queryInterface.addIndex("support_tickets", ["status"]);
    await queryInterface.addIndex("support_tickets", ["priority"]);
    await queryInterface.addIndex("support_tickets", ["created_at"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("support_tickets");
  },
};

