import AppContext from "./AppContext"
import {useState, useEffect} from "react"
import { useIntl } from "react-intl";
import io from 'socket.io-client';
import { notificationMessages } from "../translations/i18n";
import {getRouteAfterLogin, getTokenFromCookie} from "../utils/utils";
import { sendHttpRequest } from "../utils/requests";
import { USER_ROUTES } from "../utils/server-routes";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

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
        const userToken = getTokenFromCookie(document.cookie)
        if (userToken) {
            setIsLoading(true)
            sendHttpRequest(USER_ROUTES.USER(userToken), 'GET').then((response) => {
                setUserData({token: userToken, ...response.data.user})
                router.push(getRouteAfterLogin(response.data.user.permissionLevel))
                setIsLoading(false)
            })
        }
        if (!userToken) {
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
        setToken(userData.token)
        setUserName(userData.username)
        setUserId(userData.userId)
        setPermissionLevel(userData.permissionLevel)
        setEmail(userData.email)
        setPhoneNumber(userData.phoneNumber)
    }

    const onLogin = (user, rememberMe) => {
        setUserData(user)
        document.cookie=`token=${user.token}`
        const sock = io('http://localhost:3002');
        sock.emit('login', {
            userId: user.id
        })
        setSocket(sock)
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
        return <CircularProgress/>
    }


    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}

export default ContextProvider