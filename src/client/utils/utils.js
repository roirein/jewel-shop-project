import { notificationMessages } from '../translations/i18n'
import { CLIENT_ROUTES } from './client-routes'
import { createIntl } from 'react-intl'
import messages from '../translations/locales/he.json'

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
        default:
            route = null
    }
    return route
}


const generateCustomerNotificationMessage = (notificationData) => {
    return intl.formatMessage(notificationMessages.joinRequest, {name: notificationData.name})
}

const getNotificationMessage = (resource, type, data) => {
    if (resource === 'customer') {
        return generateCustomerNotificationMessage(data)
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