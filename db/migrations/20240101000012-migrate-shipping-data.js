"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all users with shipping profile data
    const users = await queryInterface.sequelize.query(
      `SELECT id, company_name, country, currency, street_address_line_1, 
              street_address_line_2, city, state_province, postal_code, 
              is_profile_setup_complete, easypost_address_id, easypost_verified_at
       FROM users 
       WHERE company_name IS NOT NULL 
          OR country IS NOT NULL 
          OR street_address_line_1 IS NOT NULL 
          OR city IS NOT NULL`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert shipping profile data for each user
    for (const user of users) {
      await queryInterface.bulkInsert("shipping_profiles", [
        {
          user_id: user.id,
          company_name: user.company_name,
          country: user.country,
          currency: user.currency || "USD",
          street_address_line_1: user.street_address_line_1,
          street_address_line_2: user.street_address_line_2,
          city: user.city,
          state_province: user.state_province,
          postal_code: user.postal_code,
          is_profile_setup_complete: user.is_profile_setup_complete || false,
          easypost_address_id: user.easypost_address_id,
          easypost_verified_at: user.easypost_verified_at,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove all shipping profile data
    await queryInterface.bulkDelete("shipping_profiles", {});
  },
};
