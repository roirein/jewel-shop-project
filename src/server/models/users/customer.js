const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const User = require('./user');

class Customer extends Model{}

Customer.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    businessId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    businessPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            is: /^\d{10}$/
        }
    }
}, {
    timestamps: false,
    sequelize,
    modelName: 'Customers'
})

User.hasOne(Customer, {foreignKey: 'userId', onDelete: 'CASCADE'});
Customer.belongsTo(User, {foreignKey: 'userId'});

module.exports = Customer