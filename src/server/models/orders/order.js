const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid')

class Order extends Model {}

Order.init({
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
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 3
        }
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: -1,
            max: 9
        }
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'Orders'
})

Order.beforeCreate((order) => {
    order.orderId = uuidv4()
})

module.exports = Order