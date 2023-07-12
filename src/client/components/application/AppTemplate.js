import {Box, AppBar, useTheme, Avatar, Stack, Tabs, Tab, Link, IconButton, Badge} from '@mui/material';
import CenteredStack from '../UI/CenteredStack';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { CUSTOMER_INTERFACE_TABS, DESIGN_MANGER_TABS, MANAGER_TABS } from '../../const/TabDefinitions';
import TemplateTabsComponent from './TemplateTabs';
import NotificationComponent from '../UI/NotificationComponent';
import { useIntl } from 'react-intl';
import axios from 'axios';
import { homePageMessages } from '../../translations/i18n';
import { useRouter } from 'next/router';
import { getAuthorizationHeader } from '../../utils/utils';
import { Diamond, PersonAddAlt, ShoppingCart } from '@mui/icons-material';

const AppTemplate = (props) => {

    const theme = useTheme();
    const intl = useIntl()
    const router = useRouter()
    const contextValue = useContext(AppContext)
    const [avatarData, setAvatarData] = useState('')


    useEffect(() => {
        if (contextValue.token) {
            const nameAsArray = contextValue.name.split(' ');
            setAvatarData(`${nameAsArray[0][0]}${nameAsArray[1][0]}`)
        }
    }, [contextValue])

    const onLogout = async () => {
        const response = await axios.post('http://localhost:3002/user/logout', {
            userId: contextValue.userId
        }, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            }
        })
        if (response.status === 200) {
            contextValue.onLogout();
            router.push('/')
        }
    }


    const getIconsByPermissionLevel = (permissionLevel) => {
        switch(permissionLevel) {
            case 1: 
                return [
                    {
                        type: 1,
                        icon: <PersonAddAlt/>
                    },
                    {
                        type: 2,
                        icon: <ShoppingCart/>
                    },
                    {
                        type: 3,
                        icon: <Diamond/>
                    }
                ]
            default: 
                return []
        }
    }

    const getTabs = () => {
        if (contextValue.permissionLevel === 1) {
            return MANAGER_TABS
        }
        if (contextValue.permissionLevel === 2) {
            return DESIGN_MANGER_TABS
        }
        if (contextValue.permissionLevel === 3) {
            return CUSTOMER_INTERFACE_TABS
        }
        if (contextValue.permissionLevel === 5) {
            return CUSTOMER_INTERFACE_TABS
        }
        else {
            return []
        }
    }

    const getBadgeContent = (type) => {
        switch(type) {
            case 1: 
                return contextValue?.notifications?.customers?.length
            case 2: 
                return contextValue?.notifications?.orders?.length
            case 3: 
                return contextValue?.notifications?.models?.length
            default:
                return 0
        }
    }

    return (
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
                {contextValue.token && (
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
                            {getIconsByPermissionLevel(contextValue.permissionLevel).map((icon) => (
                                <IconButton
                                    key={icon.type}
                                >
                                    <Badge
                                        color="secondary"
                                        badgeContent={getBadgeContent(icon.type)}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left'
                                        }}
                                    />
                                    {icon.icon}
                                </IconButton>
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
                {contextValue.token && (
                    <TemplateTabsComponent
                        tabs={getTabs()}
                    />
                )}
            </CenteredStack>
            {props.children}
            <NotificationComponent
                open={contextValue.showNotification}
                onClose={() => {
                    contextValue.setShowNotification(false)
                    contextValue.setNotificationMessage('')
                }}
                message={contextValue.notificationMessage}
            />
        </Box>
    )
}

export default AppTemplate