import {useState, useEffect} from 'react';
import axios from 'axios'

const useHttp = (url, method='GET', data={}) => {
    const [responsedata, setResponseData] = useState(null);
    const [errors, setErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    
    const fetchData = async (requestBody={}) => {
        setIsLoading(true);
        try {
            const response = axios(url, {
                method,
                data: requestBody
            })
            setResponseData(response.data)
            setErrors(null)
        } catch (e) {
            setErrors(e.message)
            setResponseData(null)
        } 
        setIsLoading(false);
    }

    return {responsedata, errors, isLoading, fetchData}
}

export default useHttp