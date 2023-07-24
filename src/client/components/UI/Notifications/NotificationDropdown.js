import { Badge, IconButton, Popover, Stack, useTheme } from "@mui/material"
import { useState, useContext } from "react"
import Notification from "./Notification"
import { PersonAdd } from "@mui/icons-material"
import { useRouter } from "next/router"
import TemplateContext from "../../../context/template-context"

const NotificationDropdown = (props) => {

    const [showDropdown, setShowdropdown] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const theme = useTheme();
    const contextValue = useContext(TemplateContext)
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
        return props.notifications.filter(notification => !notification.isRead).length
    }

    const onNotificationClick = (resourceId, type, resource) => {
        setShowdropdown(false)
        if (resource === 'customer') {
            contextValue.onOpenRequestModal(resourceId)
        }
        if (resource === 'model') {
            contextValue.onOpenModelModal(resourceId)
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
                            read={notification.isRead}
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