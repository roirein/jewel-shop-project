import {Box, AppBar, useTheme, Avatar, Stack, Tabs, Tab, Link} from '@mui/material';
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

    return (
        <Box
            width="100%"
            height="98vh"
            border={`${theme.spacing(1)} solid ${theme.palette.primary.main}`}
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
                        <Avatar>
                            {avatarData}
                        </Avatar>
                        <Link
                            color={theme.palette.secondary.main}
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