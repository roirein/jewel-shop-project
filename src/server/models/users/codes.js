const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const User = require('./user');

class Codes extends Model {}

Codes.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryTime: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    modelName: 'Codes',
    sequelize
})

User.hasOne(Codes, {foreignKey: 'userId', onDelete: 'CASCADE'})
Codes.belongsTo(User, {foreignKey: 'userId'})

module.exports = Codes