'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'business_type', {
      type: Sequelize.ENUM(
        'eCommerce Retailer',
        'Wholesale Distributor', 
        'Manufacturer',
        'Dropshipper',
        'Marketplace Seller',
        'Other'
      ),
      allowNull: true,
      after: 'account_type'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'business_type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_users_business_type;');
  }
};
