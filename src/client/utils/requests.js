import axios from 'axios'
import { USER_ROUTES } from './server-routes'
import { getRefreshToken } from './utils'

export const sendHttpRequest = async (url, method, data = {}, headers = {}, responseType = 'json') => {
    const requestData = {
        url,
        method,
        headers,
        responseType
    }
    if (method === 'PUT' || method === 'POST' || method === 'PATCH') {
        requestData.data = data
    }
    try {
        const response = await axios.request(requestData)
        return {
            data: response.data,
            status: response.status
        }
    } catch(e) {
        throw e
    }
}


