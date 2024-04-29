'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('marketIndicess', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      estateId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      indexValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalReturn: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      priceChange: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,

      },
      dividendYield: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,

      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, _) {
    await queryInterface.dropTable('marketIndicess');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
