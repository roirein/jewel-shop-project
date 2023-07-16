import { Badge, IconButton, Popover, Stack, useTheme } from "@mui/material"
import { useState, useContext } from "react"
import Notification from "./Notification"
import { PersonAdd } from "@mui/icons-material"
import AppContext from "../../../context/AppContext"
import { useRouter } from "next/router"

const NotificationDropdown = (props) => {

    const [showDropdown, setShowdropdown] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const theme = useTheme();
    const contextValue = useContext(AppContext)
    const router = useRouter()

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

    const onNotificationClick = (resourceId, type, resource) => {
        console.log(1)
        setShowdropdown(false)
        if (resource === 'customer') {
            contextValue.onShowRequestModal(resourceId)
        }
        if (resource === 'model') {
            console.log(2)
            contextValue.onShowModelModal(resourceId)
        }
        if (resource === 'order') {
            router.push(`/orders/${resourceId}`)
        }
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
                            onClick={() => onNotificationClick(notification.resourceId, notification.type, notification.resource)}
                            //onClick={on}
                        />
                    ))}
                </Stack>
            </Popover>
        </Stack>
    )
}

export default NotificationDropdown