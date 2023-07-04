const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const Order = require('./order');

class OrdersInProduction extends Model {}

OrdersInProduction.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    productionStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'Orders in Production',
    timestamps: false
})

OrdersInProduction.belongsTo(Order, {foreignKey: 'orderId'})
Order.hasOne(OrdersInProduction, {foreignKey: 'orderId'})

module.exports = OrdersInProduction