"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "easypost_user_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "easypost_api_key", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "easypost_webhook_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "easypost_user_id");
    await queryInterface.removeColumn("users", "easypost_api_key");
    await queryInterface.removeColumn("users", "easypost_webhook_url");
  },
};
