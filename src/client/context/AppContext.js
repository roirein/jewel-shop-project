import { createContext } from "react"

const contextValue = {
    userId: '',
    token: '',
    name: '',
    permissionLevel: 0,
    email: '',
    phoneNumber: '',
    socket: null,
    onLogin: () => {},
    onLogout: () => {},
    showNotification: false,
    setShowNotification: () => {},
    notificationMessage: '',
    setNotificationMessage: () => {},
    notifications: [],
    onShowRequestModal: () => {}
}

const AppContext = createContext(contextValue)

export default AppContext