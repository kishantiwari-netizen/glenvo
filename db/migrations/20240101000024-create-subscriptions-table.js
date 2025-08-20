'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      stripe_subscription_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      stripe_customer_id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      stripe_price_id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      stripe_product_id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid'),
        allowNull: false,
        defaultValue: 'incomplete'
      },
      current_period_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      current_period_end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cancel_at_period_end: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trial_start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trial_end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD'
      },
      interval: {
        type: Sequelize.ENUM('day', 'week', 'month', 'year'),
        allowNull: false,
        defaultValue: 'month'
      },
      interval_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      hash_id: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('subscriptions', ['stripe_subscription_id'], {
      unique: true
    });
    await queryInterface.addIndex('subscriptions', ['user_id']);
    await queryInterface.addIndex('subscriptions', ['stripe_customer_id']);
    await queryInterface.addIndex('subscriptions', ['status']);
    await queryInterface.addIndex('subscriptions', ['current_period_end']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  }
};
