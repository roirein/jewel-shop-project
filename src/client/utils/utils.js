import {parse} from 'cookie'

export const getUserToken = (cookie) => {
    const cookieData = parse(cookie)
    const userData = JSON.parse(cookieData.userData)
    return userData.token
}

export const getAuthorizationHeader = (token) => {
    return `Bearer ${token}`
}