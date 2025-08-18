"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all user roles and update users table with the first role for each user
    const userRoles = await queryInterface.sequelize.query(
      `SELECT DISTINCT user_id, role_id 
       FROM user_roles 
       ORDER BY user_id, created_at ASC`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Update users with their first role
    for (const userRole of userRoles) {
      await queryInterface.sequelize.query(
        `UPDATE users SET role_id = ? WHERE id = ?`,
        {
          replacements: [userRole.role_id, userRole.user_id],
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Clear role_id from users table
    await queryInterface.sequelize.query(`UPDATE users SET role_id = NULL`, {
      type: Sequelize.QueryTypes.UPDATE,
    });
  },
};
