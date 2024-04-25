'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_) {
      // define association here
    }
  }
  Report.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4

    },
    reporter: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    reporting: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    report: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

  }, {
    sequelize,
    tableName: 'reports',
    modelName: 'Report',
  });
  return Report;
};