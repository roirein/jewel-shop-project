import axios from "axios"
import { useEffect, useState } from "react"
import { USER_ROUTES } from "../utils/server-routes"

const useHttp = (url, method, options) => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const [data, setData] = useState()

    const requestHeaders = options.headers


    const sendRequest = async () => {
        const response = await axios.request({
            url,
            method,
            data: options.body || null,
            headers: requestHeaders
        })
        return response
    }

    const setRequestsStates = (data, loading, err) => {
        setData(response.data)
        setIsLoading(false)
        setError(null)
    }

    const getNewAccessToken = async () => {
        const accessTokenResponse = await axios.post(USER_ROUTES.REFRESH_TOKEN, {
            refreshToken: localStorage.getItem('refreshToken')
        })
        return accessTokenResponse
    }

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await sendRequest()
            if (response.status === 200 || response.status === 201) {
                setRequestsStates(response.data, false, null)
            }
        } catch (e) {
            if (e.response.data === 'token-expired') {
                const accessTokenResponse = await getNewAccessToken()
                requestHeaders.Authorization = `Bearer ${accessTokenResponse.accessToken}`
                try {
                    const response = await sendRequest();
                    setData(response.data, false, null)
                } catch (e) {
                    setData(null, false, e.response.data)
                }
            } else {
                setData(null, false, e.response.data)
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [url])


    return {
        isLoading,
        error,
        data,
    }
}

export default useHttp