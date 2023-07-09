import {parse} from 'cookie'
import { CLIENT_ROUTES } from './client-routes'

export const getUserToken = (cookie) => {
    if (cookie) {
        const cookieData = parse(cookie)
        return cookieData.token
    } 
}

export const getAuthorizationHeader = (token) => {
    return `Bearer ${token}`
}

export const getTokenFromCookie = (cookie) => {
    const parsedCookie = parse(cookie)
    return parsedCookie.token
}

export const getRouteAfterLogin = (permissionLevel) => {
    let route
    switch(permissionLevel) {
        case 1:
        case 3:
        case 5:
            route = CLIENT_ROUTES.ORDERS
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