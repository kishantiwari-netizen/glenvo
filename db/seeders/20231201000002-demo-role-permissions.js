"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get role IDs
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles WHERE name IN ('admin', 'manager', 'user', 'guest')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log("Found roles:", roles);

    // Get permission IDs
    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions",
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log("Found permissions:", permissions.length);

    const roleMap = {};
    const permissionMap = {};

    roles.forEach((role) => {
      roleMap[role.name] = role.id;
    });

    permissions.forEach((permission) => {
      permissionMap[permission.name] = permission.id;
    });

    console.log("Role map:", roleMap);
    console.log("Permission map keys:", Object.keys(permissionMap));

    const rolePermissions = [];

    // Admin role - all permissions
    if (roleMap.admin) {
      Object.values(permissionMap).forEach((permissionId) => {
        rolePermissions.push({
          role_id: roleMap.admin,
          permission_id: permissionId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    } else {
      console.log("Warning: Admin role not found");
    }

    // Manager role - limited permissions
    const managerPermissions = [
      "user:read",
      "user:write",
      "role:read",
      "permission:read",
      "system:limited",
      "shipping:read",
      "shipping:write",
      "company:read",
      "company:write",
    ];

    if (roleMap.manager) {
      managerPermissions.forEach((permissionName) => {
        if (permissionMap[permissionName]) {
          rolePermissions.push({
            role_id: roleMap.manager,
            permission_id: permissionMap[permissionName],
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      });
    } else {
      console.log("Warning: Manager role not found");
    }

    // User role - basic permissions
    const userPermissions = [
      "user:read:own",
      "user:write:own",
      "system:basic",
      "shipping:read:own",
      "shipping:write:own",
      "company:read",
    ];

    if (roleMap.user) {
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
    } else {
      console.log("Warning: User role not found");
    }

    // Guest role - read-only permissions
    const guestPermissions = [
      "system:readonly",
      "shipping:read",
      "company:read",
    ];

    if (roleMap.guest) {
      guestPermissions.forEach((permissionName) => {
        if (permissionMap[permissionName]) {
          rolePermissions.push({
            role_id: roleMap.guest,
            permission_id: permissionMap[permissionName],
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      });
    } else {
      console.log("Warning: Guest role not found");
    }

    await queryInterface.bulkInsert("role_permissions", rolePermissions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
