const Notifications = require("../../models/notifications/notifications")

const createNotification = async (recipientId, resource, resourceType, resourceId, data) => {
    const notificationData = {
        resource,
        type: resourceType,
        resourceId,
        recipient: recipientId,
        data
    }

    const notification = await Notifications.create(notificationData)
    return notification
}

module.exports = createNotification