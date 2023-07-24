import {Box, AppBar, useTheme, Avatar, Stack, Tabs, Tab, Link, IconButton, Badge} from '@mui/material';
import CenteredStack from '../UI/CenteredStack';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { CUSTOMER_INTERFACE_TABS, DESIGN_MANGER_TABS, MANAGER_TABS } from '../../const/TabDefinitions';
import TemplateTabsComponent from './TemplateTabs';
import NotificationComponent from '../UI/NotificationComponent';
import { useIntl } from 'react-intl';
import { homePageMessages } from '../../translations/i18n';
import { useRouter } from 'next/router';
import { createNotification, getAuthorizationHeader } from '../../utils/utils';
import { Diamond, PersonAddAlt, ShoppingCart } from '@mui/icons-material';
import NotificationDropdown from '../UI/Notifications/NotificationDropdown';
import userApi from '../../store/user/user-api';
import notifcationsApi from '../../store/notifications/notification-api';
import { useSelector } from 'react-redux';
import { getSocket } from '../../socket/socket';
import TemplateContext from '../../context/template-context';
import RequestModalComponent from '../../pages/customers/components/RequestModalComponent';
import customersApi from '../../store/customers/customer-api';
import modelsApi from '../../store/models/models-api'
import ModelModalComponent from '../../pages/models/components/ModelModal';

const AppTemplate = (props) => {

    const theme = useTheme();
    const intl = useIntl()
    const router = useRouter()
    const [avatarData, setAvatarData] = useState('')
    const userToken = useSelector((state) => userApi.getUserToken(state));
    const userPermissionLevel = useSelector((state) => userApi.getUserPermissionLevel(state));
    const username = useSelector((state) => userApi.getUsername(state))
    const notificationsAmount = useSelector((state) => notifcationsApi.getUnreadNotificationsAmount(state))
    const [socket, setSocket] = useState(null)
    const [notificationMessage, setNotificationMessage] = useState();
    const [resourceId, setResourceId] = useState();
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [showModelModal, setShowModelModal] = useState(false)
    const user = useSelector((state) => userApi.getUser(state))

    useEffect(() => {
        if (router.pathname !== '/') {
            userApi.loadUser().then(() => {
                notifcationsApi.setUserNotifications(user.userId)
                setSocket(getSocket())
            }).catch(e => router.push('/'))

        }
    }, [user.token])

    useEffect(() => {
        if (username) {
            const nameAsArray = username.split(' ');
            setAvatarData(`${nameAsArray[0][0]}${nameAsArray[1][0]}`)
            setSocket(getSocket())
        }
    }, [username])

    useEffect(() => {
        if (socket) {
            socket.on('notification', (data) => {
                const notification = createNotification(data)
                setNotificationMessage(notification.message)
                notifcationsApi.addNewNotification(notification)
                if (notification.resource === 'customer') {
                    customersApi.loadRequests();
                }
                if (notification.resource === 'model') {
                    modelsApi.loadModels()
                }
            })

            return () => {
                socket.off('notification')
            }
        }
    }, [socket])


    const onLogout = async () => {
        await userApi.logoutUser()
        router.push('/')
    }

    const getDropdownsProps = (permissionLevel) => {
        switch(permissionLevel) {
            case 1: 
                return [
                    {
                        type: 1,
                        icon: <PersonAddAlt/>,
                        notifications: notificationsAmount.customers
                    },
                    {
                        type: 2,
                        icon: <ShoppingCart/>,
                        //notifications: contextValue.notifications.orders
                    },
                    {
                        type: 3,
                        icon: <Diamond/>,
                        notifications: notificationsAmount.models
                    }
                ]
            case 2: 
                return [
                    {
                        type: 2,
                        icon: <ShoppingCart/>,
                        //notifications: contextValue.notifications.orders
                    },
                    {
                        type: 3,
                        icon: <Diamond/>,
                        notifications: notificationsAmount.models
                    }
                ]
            case 3:
            case 5: 
                return [
                    {
                        type: 2,
                        icon: <ShoppingCart/>,
                        //notifications: contextValue.notifications.orders
                    }
                ]
            default: 
                return []
        }
    }

    const getTabs = () => {
        if (userPermissionLevel === 1) {
            return MANAGER_TABS
        }
        if (userPermissionLevel === 2) {
            return DESIGN_MANGER_TABS
        }
        if (userPermissionLevel === 3) {
            return CUSTOMER_INTERFACE_TABS
        }
        if (userPermissionLevel === 5) {
            return CUSTOMER_INTERFACE_TABS
        }
        else {
            return []
        }
    }

    const onOpenModelModal = (modelNumber) => {
        setResourceId(modelNumber)
        setShowModelModal(true)
    }

    const onOpenRequestModal = (customerId) => {
        setResourceId(customerId)
        setShowRequestModal(true)
    }

    return (
        <TemplateContext.Provider value={{onOpenRequestModal, onOpenModelModal}}>
            <Box
                width="100%"
                minHeight="100vh"
                overflow="auto"
                border={`${theme.spacing(1)} solid ${theme.palette.primary.main}`}
                sx={{
                    mt: theme.spacing(4)
                }}
            >
                <AppBar
                    position="static"
                    color="primary"
                    sx={{
                        height: '50px',
                        justifyContent: 'center',
                        p: theme.spacing(4)
                    }}
                >
                    {user && userToken && (
                        <Stack
                            width="100%"
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            sx={{
                                direction: `rtl`
                            }}
                        >
                            <Avatar
                                sx={{
                                    backgroundColor: theme.palette.secondary.main
                                }}
                            >
                                {avatarData}
                            </Avatar>
                            <Stack
                                direction="row"
                                columnGap={theme.spacing(3)}
                                sx={{
                                    mr: theme.spacing(4)
                                }}
                            >
                                {getDropdownsProps(userPermissionLevel).map((dropdownProps) => (
                                    <NotificationDropdown
                                        icon={dropdownProps.icon}
                                        key={dropdownProps.type}
                                        notifications={dropdownProps.notifications || []}
                                    />
                                ))}
                            </Stack>
                            <Link
                                color={theme.palette.secondary.contrastText}
                                variant='body1'
                                onClick={() => onLogout()}
                                sx={{
                                    fontWeight: 'bold',
                                    mr: 'auto',
                                    cursor: 'pointer'
                                }}
                            >
                                {intl.formatMessage(homePageMessages.logout)}
                            </Link>
                        </Stack>
                    )}
                </AppBar>
                <CenteredStack
                    rowsGap={theme.spacing(3)}
                >
                    <img
                        width="250"
                        height="150"
                        src={'/images/logo1.png-1.svg'}
                    />
                    {userToken && (
                        <TemplateTabsComponent
                            tabs={getTabs()}
                        />
                    )}
                </CenteredStack>
                {user && props.children}
                <NotificationComponent
                    open={!!notificationMessage}
                    onClose={() => {
                        setNotificationMessage('')
                    }}
                    message={notificationMessage}
                />
                <RequestModalComponent
                    open={showRequestModal}
                    userId={resourceId}
                    onClose={() => {
                        setShowRequestModal(false);
                        setResourceId('')
                    }}
                />
                <ModelModalComponent
                    open={showModelModal}
                    modelNumber={resourceId}
                    onClose={() => {
                        setShowModelModal(false)
                        setResourceId('')
                    }}
                />
            </Box>
        </TemplateContext.Provider>
    )
}

export default AppTemplate