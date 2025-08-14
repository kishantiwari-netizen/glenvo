"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_methods", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      card_type: {
        type: Sequelize.ENUM("visa", "mastercard", "amex", "discover"),
        allowNull: false,
      },
      last_four_digits: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      cardholder_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billing_zip_code: {
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
    await queryInterface.addIndex("payment_methods", ["user_id"]);
    await queryInterface.addIndex("payment_methods", ["is_primary"]);
    await queryInterface.addIndex("payment_methods", ["is_active"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payment_methods");
  },
};

