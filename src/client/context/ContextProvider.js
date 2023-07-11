import AppContext from "./AppContext"
import {useState, useEffect} from "react"
import { useIntl } from "react-intl";
import io from 'socket.io-client';
import { notificationMessages } from "../translations/i18n";
import {getAccessToken, getRefreshToken, getRouteAfterLogin, getTokenFromCookie, setNewAcessToken} from "../utils/utils";
import { getNewAccessToken, sendHttpRequest } from "../utils/requests";
import { USER_ROUTES } from "../utils/server-routes";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const ContextProvider = (props) => {

    const intl = useIntl()
    const router = useRouter()

    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState(null);
    const [permissionLevel, setPermissionLevel] = useState(0);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const accessToken = getAccessToken(document.cookie)
        const refreshToken = getRefreshToken(document.cookie)
        if (accessToken) {
            setIsLoading(true)
            sendHttpRequest(USER_ROUTES.USER, 'POST', document.cookie, {token: refreshToken}, {
                Authorization: `Bearer ${getAccessToken(document.cookie)}`
            }).then((res) => {
                setUserData({accessToken: res.accessToken ? res.accessToken : accessToken, ...res.data.user})
                if (res.data.accessToken) {
                    document.cookie = `tokens=${JSON.stringify({accessToken: res.data.accessToken, refreshToken: refreshToken})}`
                }
                setIsLoading(false)
            })
        } else {
            router.push('/') 
        }
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on('newCustomer', (data) => {
                setNotificationMessage(intl.formatMessage(notificationMessages.joinRequest, {name: data.name}))
                setShowNotification(true)
            })

            return () => {
                socket.off('newCustomer')
            }
        }
    }, [socket])

    const setUserData = (userData) => {
        setToken(userData.accessToken)
        setUserName(userData.username)
        setUserId(userData.userId)
        setPermissionLevel(userData.permissionLevel)
        setEmail(userData.email)
        setPhoneNumber(userData.phoneNumber)
    }

    const onLogin = (user) => {
        setUserData(user)
        const tokens = {
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
        }
        document.cookie=`tokens=${JSON.stringify(tokens)}`
        const sock = io('http://localhost:3002');
        sock.emit('login', {
            userId: user.id
        })
        setSocket(sock)
        console.log('did this')
    }

    const onLogout = () => {
        setToken(null)
        setUserName('')
        setPermissionLevel(-1);
        setUserId('')
        socket.disconnect()
        setSocket(null)
        document.cookie = ``
    }


    const contextValue = {
        userId,
        token,
        name: userName,
        permissionLevel,
        email,
        phoneNumber,
        socket,
        onLogin,
        onLogout,
        showNotification,
        setShowNotification,
        notificationMessage,
        setNotificationMessage
    }

    if (isLoading) {
        return <LoadingSpinner/>
    }


    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}

export default ContextProvider