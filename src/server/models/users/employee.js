const {DataTypes, Model, Sequelize, UUIDV4} = require('sequelize');
const sequelize = require('../../database/connection');
const User = require('./user');

class Employee extends Model {}

Employee.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    shouldReplacePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    field: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    sequelize,
    modelName: 'Employees'
})

User.hasOne(Employee, {foreignKey: 'userId'})
Employee.belongsTo(User, {foreignKey: 'userId'})

module.exports = Employee