'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns exist before adding them
    const tableDescription = await queryInterface.describeTable('users');
    
    // Add GlenvoShip fields only if they don't exist
    if (!tableDescription.account_type) {
      await queryInterface.addColumn("users", "account_type", {
        type: Sequelize.ENUM("individual", "business"),
        allowNull: false,
        defaultValue: "individual",
      });
    }

    if (!tableDescription.agreement_acceptance) {
      await queryInterface.addColumn("users", "agreement_acceptance", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      });
    }

    if (!tableDescription.marketing_opt_in) {
      await queryInterface.addColumn("users", "marketing_opt_in", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      });
    }

    if (!tableDescription.social_media_acceptance) {
      await queryInterface.addColumn("users", "social_media_acceptance", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove GlenvoShip fields
    await queryInterface.removeColumn("users", "social_media_acceptance");
    await queryInterface.removeColumn("users", "marketing_opt_in");
    await queryInterface.removeColumn("users", "agreement_acceptance");
    await queryInterface.removeColumn("users", "account_type");

    // Remove the ENUM type
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_users_account_type;"
    );
  }
};
