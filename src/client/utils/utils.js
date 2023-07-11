import {parse} from 'cookie'
import { CLIENT_ROUTES } from './client-routes'

const getTokens = (cookie) => {
    if (cookie) {
        const tokens = cookie.split('=')[1]
        return JSON.parse(tokens)
    }
}

export const getAccessToken = (cookie) => {
    console.log(cookie)
    if (cookie) {
        return getTokens(cookie).accessToken
    }
}

export const getRefreshToken = (cookie) => {
    if (cookie) {
        return getTokens(cookie).refreshToken
    }
}

export const getUserToken = (cookie) => {
    if (cookie) {
        const cookieData = parse(cookie)
        const tokens = JSON.parse(cookieData.tokens)
        return tokens.accessToken
    } 
}

// export const getRefreshToken = (cookie) => {
//     if (cookie) {
//         let tokens
//         try {
//             const cookieData = parse(cookie)
//             tokens = JSON.parse(cookieData.tokens)
//         } catch (e) {
//             const tokensFromCookie = cookie.split('=')[1]
//             tokens = JSON.parse(tokensFromCookie)
//         }
//         return tokens.refreshToken
//     } 
// }

export const getAuthorizationHeader = (token) => {
    return `Bearer ${token}`
}


export const setNewAcessToken = (cookie, token) => {
    const tokensFromCookie = cookie.split('=')[1]
    const tokens = JSON.parse(tokensFromCookie)
    tokens.accessToken = token
    return `token=${JSON.stringify(tokens)}`
}

export const getTokenFromCookie = (cookie) => {
    const tokensFromCookie = cookie.split('=')[1]
    const tokens = JSON.parse(tokensFromCookie)
    return tokens.accessToken
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