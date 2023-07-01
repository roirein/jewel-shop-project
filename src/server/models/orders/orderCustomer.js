const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid');
const Order = require('./order');

class OrderCustomer extends Model {}

OrderCustomer.init({
    orderId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    customerId: {
        type: DataTypes.UUID, //will be the manager id if he enetered it
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{10}$/
        }
    },
}, {
    timestamps: true,
    sequelize,
    modelName: 'Order Customer'
})

OrderCustomer.belongsTo(Order, {foreignKey: 'orderId'});
Order.hasOne(OrderCustomer, {foreignKey: 'orderId'})

module.exports = OrderCustomer