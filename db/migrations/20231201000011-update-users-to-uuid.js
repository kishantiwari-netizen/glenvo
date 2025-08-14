"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, update the users table to use UUID
    await queryInterface.changeColumn("users", "id", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    });

    // Update the refresh_tokens table to use UUID for user_id
    await queryInterface.changeColumn("refresh_tokens", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert refresh_tokens user_id
    await queryInterface.changeColumn("refresh_tokens", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Revert users id
    await queryInterface.changeColumn("users", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    });
  },
};

