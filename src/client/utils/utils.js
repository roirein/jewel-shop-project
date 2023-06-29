import {parse} from 'cookie'

export const getUserToken = (cookie) => {
    console.log(cookie)
    const cookieData = parse(cookie)
    const userData = JSON.parse(cookieData.userData)
    console.log(userData)
    return userData.token
}

export const getAuthorizationHeader = (token) => {
    return `Bearer ${token}`
}