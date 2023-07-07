const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const Employee = require('../users/employee');
const Order = require('../orders/order');

class Task extends Model {}

Task.init({
    taskId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    employeeId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false, 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    nextTask: {
        type: DataTypes.INTEGER,
        allowNull: true //null means last order
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: false,
    sequelize,
    
})

Task.belongsTo(Employee, {foreignKey: 'employeeId'})
Order.hasMany(Task, {foreignKey: 'orderId'});
Task.belongsTo(Order, {foreignKey: 'orderId'})

module.exports = Task