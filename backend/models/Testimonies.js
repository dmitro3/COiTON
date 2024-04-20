'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testimonies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_) {
      // define association here
    }
  }
  Testimonies.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4

    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approve: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    testimony: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

  }, {
    sequelize,
    tableName: 'testimonies',
    modelName: 'Testimonies',
  });
  return Testimonies;
};