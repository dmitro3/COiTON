'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn('marketIndicess', 'type', {
      type: DataTypes.INTEGER, // Replace YOUR_DATATYPE with the appropriate Sequelize datatype
      allowNull: false, // or true depending on your requirements
      defaultValue: 0, // Optional: provide a default value if needed
    });
    await queryInterface.addColumn('marketIndicess', 'marked', {
      type: DataTypes.BOOLEAN, // Replace YOUR_DATATYPE with the appropriate Sequelize datatype
      allowNull: false, // or true depending on your requirements
      defaultValue: false, // Optional: provide a default value if needed
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('marketIndicess', 'type');
    await queryInterface.removeColumn('marketIndicess', 'marked');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
