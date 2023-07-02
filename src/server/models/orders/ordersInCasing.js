const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const Order = require('./order');

class OrdersInCasting extends Model {}

OrdersInCasting.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    castingStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'Orders in Casting',
    timestamps: false
})

OrdersInCasting.belongsTo(Order, {foreignKey: 'orderId'})
Order.hasOne(OrdersInCasting, {foreignKey: 'orderId'})

module.exports = OrdersInCasting