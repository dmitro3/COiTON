'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_) {
      // define association here
    }
  }
  Listing.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4

    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return this.getDataValue('details')?.split(';')
      },
      set(val) {
        this.setDataValue('details', val?.join(';'));
      },
    },



  }, {
    sequelize,
    tableName: 'listings',
    modelName: 'Listing',
  });
  return Listing;
};