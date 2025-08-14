"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get role IDs
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get permission IDs
    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roleMap = {};
    const permissionMap = {};

    roles.forEach((role) => {
      roleMap[role.name] = role.id;
    });

    permissions.forEach((permission) => {
      permissionMap[permission.name] = permission.id;
    });

    const rolePermissions = [];

    // Super Admin gets all permissions
    Object.values(permissionMap).forEach((permissionId) => {
      rolePermissions.push({
        role_id: roleMap.super_admin,
        permission_id: permissionId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    // Admin gets user and role management permissions
    const adminPermissions = [
      "user_create",
      "user_read",
      "user_update",
      "user_delete",
      "role_create",
      "role_read",
      "role_update",
      "role_delete",
      "permission_read",
    ];

    adminPermissions.forEach((permissionName) => {
      if (permissionMap[permissionName]) {
        rolePermissions.push({
          role_id: roleMap.admin,
          permission_id: permissionMap[permissionName],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    // Moderator gets user read and update permissions
    const moderatorPermissions = ["user_read", "user_update"];

    moderatorPermissions.forEach((permissionName) => {
      if (permissionMap[permissionName]) {
        rolePermissions.push({
          role_id: roleMap.moderator,
          permission_id: permissionMap[permissionName],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    // User gets basic read permissions
    const userPermissions = ["user_read"];

    userPermissions.forEach((permissionName) => {
      if (permissionMap[permissionName]) {
        rolePermissions.push({
          role_id: roleMap.user,
          permission_id: permissionMap[permissionName],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert("role_permissions", rolePermissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
