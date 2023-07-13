import { Badge, IconButton, Popover, Stack, useTheme } from "@mui/material"
import { useState, useContext } from "react"
import Notification from "./Notification"
import { PersonAdd } from "@mui/icons-material"
import AppContext from "../../../context/AppContext"

const NotificationDropdown = (props) => {

    const [showDropdown, setShowdropdown] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const theme = useTheme();
    const contextValue = useContext(AppContext)

    const onOpenPopover = (e) => {
        setPopoverAnchor(e.target)
        setShowdropdown(true)
    }

    const onClosePopover = () => {
        setPopoverAnchor(null)
        setShowdropdown(false)
    }

    const getBadgeContent = () => {
        return props.notifications.filter(notification => !notification.read).length
    }

    const getNotificationIcon = (resource, type) => {

    }

    const onNotificationClick = (resourceId) => {
        setShowdropdown(false)
        console.log(resourceId)
        contextValue.onShowRequestModal(resourceId)
        onClosePopover()
    }

    return (
        <Stack
            position="relative"
        >
            <IconButton
                onClick={onOpenPopover}
            >
                <Badge
                    color="secondary"
                    badgeContent={getBadgeContent()}
                >
                    {props.icon}
                </Badge>
            </IconButton>
            <Popover
                open={showDropdown}
                anchorEl={popoverAnchor}
                anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom'
                }}
                transformOrigin={{
                    horizontal: "left",
                    vertical: "bottom"
                }}
                sx={{
                    mt: theme.spacing(7),
                    ml: '-76px'
                }}
            >
                <Stack
                    maxHeight="450px"
                    width="350px"
                    overflow="auto"
                >
                    {props.notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            read={notification.read}
                            resourceId={notification.resourceId}
                            resourceType={notification.resource}
                            message={notification.message}
                            icon={<PersonAdd/>}
                            onClick={() => onNotificationClick(notification.resourceId)}
                            //onClick={on}
                        />
                    ))}
                </Stack>
            </Popover>
        </Stack>
    )
}

export default NotificationDropdown