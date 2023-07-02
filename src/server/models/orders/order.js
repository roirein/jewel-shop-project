const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');

class Order extends Model {}

Order.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'Orders'
})

module.exports = Order