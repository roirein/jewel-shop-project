import { useEffect } from "react"

export const useCookie = (token) => {
    useEffect(() => {
        if (token) {
            const cookie = document.cookie
            const tokensString = cookie.split('=')[1]
            const tokens = JSON.parse(tokensString)
            tokens.accessToken = token
            document.cookie = `tokens=${JSON.stringify(tokens)}`
        }
    }, [])
}

export default useCookie