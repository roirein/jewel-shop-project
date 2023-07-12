import AppContext from "./AppContext"
import {useState, useEffect} from "react"
import { useIntl } from "react-intl";
import io from 'socket.io-client';
import { notificationMessages } from "../translations/i18n";
import {getRouteAfterLogin, getToken} from "../utils/utils";
import {sendHttpRequest } from "../utils/requests";
import { USER_ROUTES } from "../utils/server-routes";
import { useRouter } from "next/router";
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
    const [notifications, setNotifications] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const authToken = getToken();
        if (authToken) {
            setIsLoading(true) 
            sendHttpRequest(USER_ROUTES.USER, 'POST', {token: authToken}, {
                Authorization: `Bearer ${authToken}`
            }).then((res) => {
                setUserData({token: authToken, ...res.data.user})
                setIsLoading(false)
                const navigationType = (window.performance.getEntriesByType('navigation')[0]).type;
                const route = getRouteAfterLogin(res.data.user.permissionLevel)
                if (navigationType !== 'reload') {
                    router.push(route)
                }
            })
        } else {
            router.push('/')
        }
    }, [])

    useEffect(() => {
        if (token && userId)
            sendHttpRequest(USER_ROUTES.NOTIFICATIONS(userId), 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then((response) => {
                const customerNotifications = [];
                const ordersNotifications = [];
                const modelsNotifications = [];
                const notificationData = response.data.notifications
                notificationData.forEach((notification) => {
                    switch(notification.resource) {
                        case 'customer': 
                            customerNotifications.push(notification)
                            break;
                        case 'order': 
                            ordersNotifications.push(notification)
                            break
                        case 'model': 
                            modelsNotifications.push(notification)
                            break
                        default:
                            break
                    }
                })
                return {
                    customers: customerNotifications,
                    orders: ordersNotifications,
                    models: modelsNotifications
                }
            }).then((notificationsObj) => setNotifications(notificationsObj))
    }, [token, userId])

    useEffect(() => {
        if (socket) {
            socket.on('new-customer', (data) => {
                setNotificationMessage(intl.formatMessage(notificationMessages.joinRequest, {name: data.name}))
                setShowNotification(true)
                const customersNotifications = notifications.customers
                setNotifications({
                    ...notifications,
                    customers: [...customersNotifications, data.notificationData]
                })
            })

            return () => {
                socket.off('new-customer')
            }
        }
    }, [socket, notifications])

    // const onAddNewNotification = (notification) => {
    //     console.log(notifications)
    //     switch(notification.resource) {
    //         case 'customer': 
    //             const customersNotifications = notifications.customers
    //             setNotifications({
    //                 ...notifications,
    //                 customers: [...customersNotifications, notification]
    //             })
    //             break;
    //             // customerNotifications.push(notification)
    //             // break;
    //         case 'order': 
    //             // ordersNotifications.push(notification)
    //             // break
    //         case 'model': 
    //             // modelsNotifications.push(notification)
    //             // break
    //         default:
    //             break
    //     }
    // }

    const setUserData = (userData) => {
        setToken(userData.token)
        setUserName(userData.username)
        setUserId(userData.id)
        setPermissionLevel(userData.permissionLevel)
        setEmail(userData.email)
        setPhoneNumber(userData.phoneNumber)
    }

    const onLogin = (user, rememberMe) => {
        rememberMe ? localStorage.setItem('token', user.token) : sessionStorage.setItem('token', user.token)
        setUserData(user)
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
        localStorage.removeItem('accessToken')
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
        setNotificationMessage,
        notifications
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