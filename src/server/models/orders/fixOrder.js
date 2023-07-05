const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const Order = require('./order');

class FixOrder extends Model {}

FixOrder.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    item: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 4
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    priceffer: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'Fix Order'
})


Order.hasOne(FixOrder, {foreignKey: 'orderId'})
FixOrder.belongsTo(Order, {foreignKey: 'orderId'});

module.exports = FixOrder