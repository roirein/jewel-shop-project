import AppContext from "./AppContext"
import {useState, useEffect} from "react"
import { useIntl } from "react-intl";
import io from 'socket.io-client';
import { notificationMessages } from "../translations/i18n";
import {createNotification, generateCustomerNotificationMessage, getRouteAfterLogin, getToken} from "../utils/utils";
import {sendHttpRequest } from "../utils/requests";
import { USER_ROUTES } from "../utils/server-routes";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import RequestModalComponent from "../pages/customers/components/RequestModalComponent";
import ModelModalComponent from "../pages/models/components/ModelModal";

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
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showModelModal, setShowModelModal] = useState(false);
    const [modalResouceId, setModalResourceId] = useState(null);

    useEffect(() => {
        const authToken = getToken();
        if (authToken) {
            setIsLoading(true) 
            sendHttpRequest(USER_ROUTES.USER, 'POST', {token: authToken}, {
                Authorization: `Bearer ${authToken}`
            }).then((res) => {
                setUserData({token: authToken, ...res.data.user})
                const sock = io('http://localhost:3002');
                sock.emit('login', {
                    userId: res.data.userId
                })
                setSocket(socket)
                if (router.pathname === '/') {
                    const route = getRouteAfterLogin(res.data.user.permissionLevel)
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
                            customerNotifications.push(createNotification(notification))
                            break;
                        case 'order': 
                            ordersNotifications.push(createNotification(notification))
                            break
                        case 'model': 
                            modelsNotifications.push(createNotification(notification))
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
                const notification = createNotification(data)
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const customersNotifications = notifications.customers
                setNotifications({
                    ...notifications,
                    customers: [...customersNotifications, notification]
                })
            })


            socket.on('new-model', (data) => {
                const notification = createNotification(data)
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const modelsNotifications = notifications.models
                setNotifications({
                    ...notifications,
                    models: [...modelsNotifications, notification]
                })
            })

            socket.on('model-approve', (data) => {
                const notification = createNotification(data)
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const modelsNotifications = notifications.models
                setNotifications({
                    ...notifications,
                    models: [...modelsNotifications, notification]
                })
            })

            socket.on('model-reject', (data) => {
                const notification = createNotification(data)
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const modelsNotifications = notifications.models
                setNotifications({
                    ...notifications,
                    models: [...modelsNotifications, notification]
                })
            })

            socket.on('model-update', (data) => {
                const notification = createNotification(data)
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const modelsNotifications = notifications.models
                setNotifications({
                    ...notifications,
                    models: [...modelsNotifications, notification]
                })
            })

            socket.on('new-order', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })

            socket.on('new-design', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })

            socket.on('customer-design-complete', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })

            socket.on('customer-order-approval', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })

            socket.on('production-start', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })

            
            socket.on('task-complete', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })

            socket.on('production-end', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })

            socket.on('order-ready', (data) => {
                const notification = createNotification(data);
                setNotificationMessage(notification.message)
                setShowNotification(true)
                const ordersNotifications = notifications.orders
                setNotifications({
                    ...notifications,
                    orders: [...ordersNotifications, notification]
                })
            })


            return () => {
                socket.off('new-customer')
                socket.off('new-model')
                socket.off('model-approve')
                socket.off('model-reject')
                socket.off('model-update')
                socket.off('new-order')
                socket.off('new-design')
                socket.off('customer-design-complete')
                socket.off('customer-order-approval')
                socket.off('production-start')
                socket.off('task-complete')
                socket.off('production-end')
                socket.off('order-ready')
            }
        }
    }, [socket, notifications])


    const readNotification = (resource, resourceId, type) => {
        switch(resource) {
            case 'customer':
                const notificationIndex = notifications.customers.findIndex((not) => not.resourceId === resourceId && type === not.type)
                if (notificationIndex !== - 1) {
                    const newCustomerNotificationArray = [...notifications.customers]
                    newCustomerNotificationArray[notificationIndex].read = true
                    setNotifications({
                        ...notifications,
                        customers: newCustomerNotificationArray
                    })
                    socket.emit('read-notification', {
                        notificationId: newCustomerNotificationArray[notificationIndex].notificationId
                    })
                }
                break
            default:
                break
        }

    }

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
        sessionStorage.removeItem('token')
    }

    const onShowRequestModal = (customerId) => {
        setModalResourceId(customerId)
        setShowRequestModal(true)
    }

    const onShowModelModal = (modelNumber) => {
        setModalResourceId(modelNumber)
        setShowModelModal(true)
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
        notifications,
        readNotification,
        onShowRequestModal,
        onShowModelModal
    }

    if (isLoading) {
        return <LoadingSpinner/>
    }


    console.log('customerId', modalResouceId)

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
            <RequestModalComponent
                open={showRequestModal}
                onClose={() => {
                    setShowRequestModal(false);
                    setModalResourceId('')
                }}
                userId={modalResouceId}
                onResponse={(response) => {
                    socket.emit('request-response', {
                        status: response ? 1 : -1,
                        customerId: modalResouceId
                    })
                    setShowRequestModal(false);
                    setModalResourceId('')
                }}
            />
            <ModelModalComponent
                open={showModelModal}
                onClose={() => {
                    setShowModelModal(false)
                    setModalResourceId('')
                }}
                modelNumber={modalResouceId}
            />
        </AppContext.Provider>
    )
}

export default ContextProvider