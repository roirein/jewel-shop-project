import AppContext from "./AppContext"
import {useState, useEffect} from "react"
import io from 'socket.io-client';

const ContextProvider = (props) => {

    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState(null);
    const [permissionLevel, setPermissionLevel] = useState(0)

    useEffect(() => {
        if (socket) {

        }
    }, [socket])


    const setCookie = (token, id, permissionLevel, name) => {
        const values = {
            token,
            userId: id,
            permissionLevel,
            username: name
        }

        document.cookie = JSON.stringify(values)
    }

    const onLogin = (userToken, name, userPermissionLevel, id) => {
        setToken(`Bearer ${userToken}`),
        setUserName(name)
        setPermissionLevel(userPermissionLevel);
        setUserId(id)
        const sock = io('http://localhost:3002');
        sock.emit('login', {
            userId
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
        onLogout: () => {}
    }


    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}

export default ContextProvider