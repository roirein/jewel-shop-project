const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid')

class Notifications extends Model {}

Notifications.init({
    notificationId: {
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
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    timestamps: false,
    modelName: 'Notifications'
})

Notifications.beforeCreate((notification) => {
    notification.notificationsId = uuidv4()
})

module.exports = Notifications