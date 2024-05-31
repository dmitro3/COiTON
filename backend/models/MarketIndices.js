'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MarketIndices extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(_) {
            // define association here
        }
    }
    MarketIndices.init({
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
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        marked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'marketIndicess',
        modelName: 'MarketIndices',
    });
    return MarketIndices;
};