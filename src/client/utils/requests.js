import axios from 'axios'
import { USER_ROUTES } from './server-routes'
import { getRefreshToken } from './utils'

export const sendHttpRequest = async (url, method, cookie, data = {}, headers = {}) => {
    const requestData = {
        url,
        method,
        headers
    }
    if (method === 'PUT' || method === 'POST' || method === 'PATCH') {
        requestData.data = data
    }
    let response
    try {
        response = await axios.request(requestData)
        return {
            data: response.data,
            status: response.status
        }
    } catch(e) {
        console.log(e)
        if (e.response.data === 'token-expired') {
            const newAccessToken = await getNewAccessToken(cookie)
            requestData.headers.Authorization = `Bearer ${newAccessToken}`
            response = await axios.request(requestData)
            return {
                data: response.data,
                status: response.status,
                accessToken: newAccessToken
            }
        } else {
            throw e
        }
    }
}

const getNewAccessToken = async (cookie) => {
    try {
        const accessTokenResponse = await sendHttpRequest(USER_ROUTES.REFRESH_TOKEN, 'POST', cookie, {
            refreshToken: getRefreshToken(cookie)
        })
        return accessTokenResponse.data.accessToken
    } catch (e) {
        console.log(e)
    }
}