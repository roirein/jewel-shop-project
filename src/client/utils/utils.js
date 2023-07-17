import { notificationMessages } from '../translations/i18n'
import { CLIENT_ROUTES } from './client-routes'
import { createIntl } from 'react-intl'
import messages from '../translations/locales/he.json'
import { not } from '@vuelidate/validators'

const intl = createIntl({
    locale: 'he',
    messages: messages
})

export const getToken = () => {
    let token = localStorage.getItem('token')
    if (!token) {
        token = sessionStorage.getItem('token')
    }
    return token
}
 
export const getRouteAfterLogin = (permissionLevel) => {
    let route
    switch(permissionLevel) {
        case 1:
        // case 3:
        // case 5:
            route = CLIENT_ROUTES.CUSTOMERS
            break
        case 2: 
            route = CLIENT_ROUTES.MODELS
            break
        case 4:
            route = CLIENT_ROUTES.EMPLOYEE
            break
        case 3:
        case 5:
            route = CLIENT_ROUTES.ORDERS
            break;
        default:
            route = null
    }
    return route
}


const generateCustomerNotificationMessage = (notificationData) => {
    return intl.formatMessage(notificationMessages.joinRequest, {name: notificationData.name})
}

const generateModelNotificationsMessage = (notificationData, type) => {
    switch(type) {
        case 'new-model':
            return intl.formatMessage(notificationMessages.newModel, {number: notificationData.modelNumber, name: notificationData.modelTitle})
        case 'model-approve': 
            return intl.formatMessage(notificationMessages.modelApproved, {number: notificationData.modelNumber})
        case 'model-reject': 
            return intl.formatMessage(notificationMessages.modelReject, {number: notificationData.modelNumber})
        case 'model-update': 
            return intl.formatMessage(notificationMessages.modelUpdated, {number: notificationData.modelNumber})
    }
}

const generateOrderNotificationMessage = (notificationData, type) => {
    switch(type) {
        case 'new-order':
            return intl.formatMessage(notificationMessages.newOrder, {name: notificationData.customerName})
        case 'new-design':
            return intl.formatMessage(notificationMessages.newDesign, {number: notificationData.orderId})
        case 'customer-design-complete': 
            return intl.formatMessage(notificationMessages.designCompletedForOrder, {number: notificationData.orderId})
        case 'customer-order-approval':
            return intl.formatMessage(notificationMessages.orderApprovedByCustomer, {number: notificationData.orderId})
        case 'production-start':
            return intl.formatMessage(notificationMessages.newOrderToProduction, {number: notificationData.orderId})
        case 'task-complete':
            return intl.formatMessage(notificationMessages.taskCompletedByEmployee, {name: notificationData.employeeName, number: notificationData.orderId})
        case 'production-end':
            return intl.formatMessage(notificationMessages.productionFinished, {number: notificationData.orderId})
        case 'order-ready': 
            return intl.formatMessage(notificationMessages.orderReady, {number: notificationData.orderId})
        case 'price-offer':
            return intl.formatMessage(notificationMessages.newPriceOffer, {number: notificationData.orderId})
    }
}

const getNotificationMessage = (resource, type, data) => {
    if (resource === 'customer') {
        return generateCustomerNotificationMessage(data)
    }
    if (resource === 'model') {
        const res = generateModelNotificationsMessage(data, type)
        return res
    }
    if (resource === 'order') {
        const res = generateOrderNotificationMessage(data, type)
        return res
    }
    
}

export const createNotification = (notificatioData) => {
    return {
        id: notificatioData.notificationId,
        resource: notificatioData.resource,
        resourceId: notificatioData.resourceId,
        type: notificatioData.type,
        read: notificatioData.read,
        message: getNotificationMessage(notificatioData.resource, notificatioData.type, notificatioData.data)
    }
}