'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns exist before adding them
    const tableDescription = await queryInterface.describeTable('users');
    
    // Add shipping profile fields only if they don't exist
    if (!tableDescription.company_name) {
      await queryInterface.addColumn('users', 'company_name', {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
    }

    if (!tableDescription.country) {
      await queryInterface.addColumn('users', 'country', {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
    }

    if (!tableDescription.currency) {
      await queryInterface.addColumn('users', 'currency', {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: 'USD',
      });
    }

    if (!tableDescription.street_address_line_1) {
      await queryInterface.addColumn('users', 'street_address_line_1', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    if (!tableDescription.street_address_line_2) {
      await queryInterface.addColumn('users', 'street_address_line_2', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    if (!tableDescription.city) {
      await queryInterface.addColumn('users', 'city', {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
    }

    if (!tableDescription.state_province) {
      await queryInterface.addColumn('users', 'state_province', {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
    }

    if (!tableDescription.postal_code) {
      await queryInterface.addColumn('users', 'postal_code', {
        type: Sequelize.STRING(20),
        allowNull: true,
      });
    }

    if (!tableDescription.is_profile_setup_complete) {
      await queryInterface.addColumn('users', 'is_profile_setup_complete', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (!tableDescription.easypost_address_id) {
      await queryInterface.addColumn('users', 'easypost_address_id', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    if (!tableDescription.easypost_verified_at) {
      await queryInterface.addColumn('users', 'easypost_verified_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove shipping profile fields
    await queryInterface.removeColumn('users', 'easypost_verified_at');
    await queryInterface.removeColumn('users', 'easypost_address_id');
    await queryInterface.removeColumn('users', 'is_profile_setup_complete');
    await queryInterface.removeColumn('users', 'postal_code');
    await queryInterface.removeColumn('users', 'state_province');
    await queryInterface.removeColumn('users', 'city');
    await queryInterface.removeColumn('users', 'street_address_line_2');
    await queryInterface.removeColumn('users', 'street_address_line_1');
    await queryInterface.removeColumn('users', 'currency');
    await queryInterface.removeColumn('users', 'country');
    await queryInterface.removeColumn('users', 'company_name');
  }
};
