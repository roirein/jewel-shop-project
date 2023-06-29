const {DataTypes, Model, Sequelize, UUIDV4} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid');
const Customer = require('./customer');

class Request extends Model {}

Request.init({
    requestId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    customerId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.INTEGER, // 0 - not read, -1 - rejected, 1 - approved, 2 - read but not responed
        defaultValue: 0,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Requests'
})

Request.beforeCreate((request) => {
    request.requestId = uuidv4();
})

Customer.hasOne(Request, {foreignKey: 'customerId'})
Request.belongsTo(Customer, {foreignKey: 'customerId'})

module.exports = Request