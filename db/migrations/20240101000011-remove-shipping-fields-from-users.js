"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove shipping profile fields from users table
    await queryInterface.removeColumn("users", "company_name");
    await queryInterface.removeColumn("users", "country");
    await queryInterface.removeColumn("users", "currency");
    await queryInterface.removeColumn("users", "street_address_line_1");
    await queryInterface.removeColumn("users", "street_address_line_2");
    await queryInterface.removeColumn("users", "city");
    await queryInterface.removeColumn("users", "state_province");
    await queryInterface.removeColumn("users", "postal_code");
    await queryInterface.removeColumn("users", "is_profile_setup_complete");
    await queryInterface.removeColumn("users", "easypost_address_id");
    await queryInterface.removeColumn("users", "easypost_verified_at");
  },

  async down(queryInterface, Sequelize) {
    // Add back shipping profile fields to users table
    await queryInterface.addColumn("users", "company_name", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "country", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "currency", {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: "USD",
    });
    await queryInterface.addColumn("users", "street_address_line_1", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "street_address_line_2", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "city", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "state_province", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "postal_code", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "is_profile_setup_complete", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("users", "easypost_address_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "easypost_verified_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
