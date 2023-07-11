import { CLIENT_ROUTES } from './client-routes'

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