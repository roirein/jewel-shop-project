import axios from 'axios'

export const sendHttpRequest = async (url, method, data = {}, headers = {}) => {
    try {
        const requestData = {
            url,
            method,
            headers
        }
        if (method === 'PUT' || method === 'POST' || method === 'PATCH') {
            requestData.data = data
        }
        console.log(requestData)
        const response = await axios.request(requestData)
        return response
    } catch(e) {
        if (e.response.data === 'token-expired') {
            return 'token-expired'
        } else {
            throw e
        }
    }
}


