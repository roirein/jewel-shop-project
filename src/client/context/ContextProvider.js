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

    const onLogin = (userToken, name, userPermissionLevel, id) => {
        setToken(userToken),
        setUserName(name)
        setPermissionLevel(userPermissionLevel);
        setUserId(id)
        const sock = io('http://localhost:3002');
        sock.emit('login', {
            userId: id
        })
        setSocket(sock)
        setCookie(userToken, id, userPermissionLevel, name)
    }


    const contextValue = {
        userId,
        token,
        name: userName,
        permissionLevel,
        socket,
        onLogin,
        onLogout: () => {},
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