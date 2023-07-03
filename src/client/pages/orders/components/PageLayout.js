import { Stack, Button, Typography, useTheme, Tabs, Tab} from "@mui/material"
import { Add } from "@mui/icons-material"
import { useContext, useState } from "react"
import AppContext from "../../../context/AppContext"
import { useIntl } from "react-intl"
import { ordersPageMessages } from "../../../translations/i18n"
import CenteredStack from "../../../components/UI/CenteredStack"
import CreateOrderModal from "./NewOrderModal"
import { useRouter } from "next/router"
import { MANAGER_ORDERS_PAGE_TABS } from "../../../const/TabDefinitions"
import Link from "next/link"

const PageLayoutComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const router = useRouter();

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            {contextValue.permissionLevel === 1 && (
                <Tabs
                    value={router.pathname}
                    indicatorColor="transparent"
                    sx={{
                        direction: theme.direction,
                        pr: theme.spacing(4)
                    }}
                >
                    {MANAGER_ORDERS_PAGE_TABS.map((tab, index) => (
                        <Tab
                            key={index}
                            label={(
                                <Link
                                    href={tab.route}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#a05444',
                                        fontWeight: router.pathname === tab.route ? 'bold' : 'normal'
                                    }}
                                >
                                    {tab.label}
                                </Link>
                            )}
                            value={tab.route}
                            sx={{
                                border: router.pathname === tab.route ? `${theme.spacing(1)} solid ${theme.palette.primary.main}` : 'none'
                            }}
                        />
                    ))}
                </Tabs>
            )}
            {(contextValue.permissionLevel === 1 || contextValue.permissionLevel === 5) && (
                <Stack
                    sx={{
                        pr: theme.spacing(4),
                        mt: theme.spacing(3)
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{
                            width: '10%',
                            border: `${theme.spacing(0)} solid ${theme.palette.primary.main}`
                        }}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Add color={theme.palette.primary.main}/>
                        <Typography
                            variant="body2"
                            color={theme.palette.primary.main}
                        >
                            {intl.formatMessage(ordersPageMessages.createNewOrder)}
                        </Typography>
                    </Button>
                </Stack>
            )}
            <CenteredStack
                width="100%"
                sx={{
                    mt: theme.spacing(3)
                }}
            >
                {props.children}
            </CenteredStack>
            <CreateOrderModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </Stack>
    )
}

export default PageLayoutComponent