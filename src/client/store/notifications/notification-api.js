import axios from 'axios'
import store from '..'
import { tokenSelector } from '../user/user-selector'
import { createNotification } from '../../utils/utils'
import notificationsSlice from './notification-slice'
import { selectNotifications, selectUnreadNotificationsAmount } from './notification-selector'
import dayjs from 'dayjs'
import { getSocket } from '../../socket/socket'

const setUserNotifications = async (userId) => {
    const response = await axios.get(`${process.env.SERVER_URL}/user/notifications/${userId}`, {
        headers: {
            Authorization: `Bearer ${tokenSelector(store.getState())}`
        }
    })
    const notifications = response.data.notifications
    const models = [];
    const customers = []
    const orders = []
    notifications.forEach((notification) => {
        const notificationData = createNotification(notification)
        switch(notification.resource) {
            case 'customer': 
                customers.push(notificationData)
                break;
            case 'order': 
                orders.push(notificationData)
                break
            case 'model': 
                models.push(notificationData)
                break
            default:
                break
        }
    })
    store.dispatch(notificationsSlice.actions.loadNotifications({
        orders,
        models,
        customers
    }))
}

const addNewNotification = (notification) => {
    store.dispatch(notificationsSlice.actions.addNewNotification({notification}))
}

const getUnreadNotificationsAmount = (state) => {
    return selectNotifications(state)
}

const readNotification = (resourceId, resource) => {
    const notifications = selectNotifications(store.getState())
    let relevantNotifications;
    switch(resource) {
        case 'customer': 
            relevantNotifications = notifications.customers
            break;
        case 'order': 
            relevantNotifications = notifications.orders
            break
        case 'model': 
            relevantNotifications = notifications.models
            break
        default:
            break
    }

    const resourceNotifications = relevantNotifications.filter((not) => not.resourceId === resourceId);
    let notification = resourceNotifications.reduce((recent, current) => {
        const mostRecentDate = dayjs(recent.createdAt);
        const currentDate = dayjs(current.createdAt);
        return currentDate.isAfter(mostRecentDate) ? current : recent;
    })
    console.log(notification)
    notification = {
        ...notification,
        isRead: true
    }
    store.dispatch(notificationsSlice.actions.readNotification({notification}));
    const socket = getSocket();
    socket.emit('read-notification', {
        id: notification.id
    })

}

const notifcationsApi = {
    setUserNotifications,
    getUnreadNotificationsAmount,
    addNewNotification,
    readNotification
}

export default notifcationsApi