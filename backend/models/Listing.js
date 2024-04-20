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
        // Custom getter for parsing JSON when retrieved from the database
        const jsonString = this.getDataValue("details");
        return jsonString ? JSON.parse(jsonString) : null;
      },
      set(value) {
        // Custom setter for stringifying JSON when stored in the database
        this.setDataValue("details", value ? JSON.stringify(value) : null);
      },
    },



  }, {
    sequelize,
    tableName: 'listings',
    modelName: 'Listing',
  });
  return Listing;
};