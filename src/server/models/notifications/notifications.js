const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid')

class Notifications extends Model {}

Notifications.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    resource: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resourceId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    modelName: 'Notifications'
})

Notifications.beforeCreate((notification) => {
    notification.notificationsId = uuidv4()
})

module.exports = Notifications