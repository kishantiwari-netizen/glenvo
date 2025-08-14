"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("refresh_tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_revoked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("refresh_tokens", ["token"], {
      unique: true,
      name: "refresh_tokens_token_unique",
    });

    await queryInterface.addIndex("refresh_tokens", ["user_id"], {
      name: "refresh_tokens_user_id_index",
    });

    await queryInterface.addIndex("refresh_tokens", ["expires_at"], {
      name: "refresh_tokens_expires_at_index",
    });

    await queryInterface.addIndex("refresh_tokens", ["is_revoked"], {
      name: "refresh_tokens_is_revoked_index",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("refresh_tokens");
  },
};
