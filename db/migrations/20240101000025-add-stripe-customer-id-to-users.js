'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'stripe_customer_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'easypost_webhook_url'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'stripe_customer_id');
  }
};
