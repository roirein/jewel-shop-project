import { createContext } from "react"

const contextValue = {
    userId: '',
    token: '',
    name: '',
    permissionLevel: 0,
    socket: null,
    onLogin: () => {},
    onLogout: () => {},
    showNotification: false,
    setShowNotification: () => {},
    notificationMessage: '',
    setNotificationMessage: () => {}
}

const AppContext = createContext(contextValue)

export default AppContext