import {Box, AppBar, useTheme, Avatar, Stack, Tabs, Tab} from '@mui/material';
import CenteredStack from '../UI/CenteredStack';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { MANAGER_TABS } from '../../const/TabDefinitions';
import TemplateTabsComponent from './TemplateTabs';
import NotificationComponent from '../UI/NotificationComponent';


const AppTemplate = (props) => {

    const theme = useTheme();
    const contextValue = useContext(AppContext)
    const [avatarData, setAvatarData] = useState('')

    useEffect(() => {
        if (contextValue.token) {
            const nameAsArray = contextValue.name.split(' ');
            setAvatarData(`${nameAsArray[0][0]}${nameAsArray[1][0]}`)
        }
    }, [contextValue])

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
                    >
                        <Avatar>
                            {avatarData}
                        </Avatar>
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
                        tabs={MANAGER_TABS}
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