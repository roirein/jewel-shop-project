const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const Order = require('./order');

class OrderTimeline extends Model {}

OrderTimeline.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    designStart: {
        type: DataTypes.DATE,
        allowNull: true
    },
    designEnd: {
        type: DataTypes.DATE,
        allowNull: true
    },    
    castingStart: {
        type: DataTypes.DATE,
        allowNull: true
    },
    castingEnd: {
        type: DataTypes.DATE,
        allowNull: true
    },
    productionStart: {
        type: DataTypes.DATE,
        allowNull: true
    },
    productionEnd: {
        type: DataTypes.DATE,
        allowNull: true
    },
    delivered: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false,
    modelName: 'Order Timeline',
    sequelize
})

OrderTimeline.belongsTo(Order, {foreignKey: 'orderId'})
Order.hasOne(OrderTimeline, {foreignKey: 'orderId'})

module.exports = OrderTimeline