"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = [
      "roles",
      "permissions", 
      "role_permissions",
      "users",
      "shipping_profiles",
      "shipping_addresses",
      "carriers",
      "shipments",
      "packages"
    ];

    for (const table of tables) {
      // Add deleted_at column for soft delete
      await queryInterface.addColumn(table, "deleted_at", {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      });

      // Add hash_id column with UUID v4 default
      await queryInterface.addColumn(table, "hash_id", {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      });

      // Add index on deleted_at for better query performance
      await queryInterface.addIndex(table, ["deleted_at"], {
        name: `${table}_deleted_at_idx`,
      });

      // Add unique index on hash_id
      await queryInterface.addIndex(table, ["hash_id"], {
        name: `${table}_hash_id_idx`,
        unique: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = [
      "roles",
      "permissions", 
      "role_permissions",
      "users",
      "shipping_profiles",
      "shipping_addresses",
      "carriers",
      "shipments",
      "packages"
    ];

    for (const table of tables) {
      // Remove indexes
      await queryInterface.removeIndex(table, `${table}_deleted_at_idx`);
      await queryInterface.removeIndex(table, `${table}_hash_id_idx`);

      // Remove columns
      await queryInterface.removeColumn(table, "deleted_at");
      await queryInterface.removeColumn(table, "hash_id");
    }
  },
};
