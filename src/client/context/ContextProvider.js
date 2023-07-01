import AppContext from "./AppContext"
import {useState, useEffect} from "react"
import { useIntl } from "react-intl";
import io from 'socket.io-client';
import { notificationMessages } from "../translations/i18n";

const ContextProvider = (props) => {

    const intl = useIntl()

    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState(null);
    const [permissionLevel, setPermissionLevel] = useState(0);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

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


    const setCookie = (token, id, permissionLevel, name) => {
        const values = {
            token,
            userId: id,
            permissionLevel,
            username: name
        }

        document.cookie = `userData=${JSON.stringify(values)}`
    }

    const onLogin = (user) => {
        setToken(user.token),
        setUserName(user.username)
        setPermissionLevel(user.permissionLevel);
        setUserId(user.id)
        setEmail(user.email)
        setPhoneNumber(user.phoneNumber)
        const sock = io('http://localhost:3002');
        sock.emit('login', {
            userId: user.id
        })
        setSocket(sock)
        setCookie(user.token, user.id, user.userPermissionLevel, user.username)
    }

    const onLogout = () => {
        setToken(null)
        setUserName('')
        setPermissionLevel(-1);
        setUserId('')
        socket.disconnect()
        setSocket(null)
        document.cookie = `userData=`
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


    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}

export default ContextProvider