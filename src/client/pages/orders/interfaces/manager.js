import { Stack, Tab, Tabs, useTheme, Button, Typography} from "@mui/material"
import { CUSTOMER_INTERFACE_TABS, CUSTOMER_ORDERS_TABS, MANAGER_ORDERS_TABS } from "../../../const/TabDefinitions"
import { useEffect, useState } from "react"
import { Add } from "@mui/icons-material"
import TableComponent from "../../../components/UI/TableComponent"
import { CUSTOMER_TABLE_COLUMNS, ORDERS_MANAGER_TABLE_COLUMNS, ORDER_CUSTOMER_TABEL_COLUMNS } from "../../../const/TablesColumns"
import { ORDER_STATUS, ORDER_TYPES } from "../../../const/Enums"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import CreateOrderModal from "../components/NewOrderModal"
import { ordersPageMessages } from "../../../translations/i18n"
import CenteredStack from "../../../components/UI/CenteredStack"

const ManagerInterface = (props) => {

    const theme = useTheme();
    const router = useRouter();
    const intl = useIntl()

    const [selectedTab, setSelectedTab] = useState(0)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [tableColumns, setTableColumns] = useState(ORDERS_MANAGER_TABLE_COLUMNS)
    const [tableData, setTableData] = useState([])
    const [displayedOrders, setDisplayedOrders] = useState(props.orders)

    useEffect(() => {
        if (props.orders) {
            setDisplayedOrders(props.orders)
        }
    }, [props.orders])

    useEffect(() => {
        const data = [];
        displayedOrders?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.orderId,
                    rowContent: [
                                    dataElement.orderId,
                                    ORDER_TYPES[dataElement.type],
                                    dataElement.customerName, 
                                    ORDER_STATUS[dataElement.status],
                                    dataElement.created,
                                    dataElement.deadline
                                ]
                });
        })
        setTableData(data)
    }, [displayedOrders])

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            <Tabs
                value={selectedTab}
                indicatorColor="transparent"
                sx={{
                    direction: theme.direction,
                    pr: theme.spacing(4)
                }}
            >
                {MANAGER_ORDERS_TABS.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        value={index}
                        sx={{
                            border: index === selectedTab ? `${theme.spacing(1)} solid ${theme.palette.primary.main}` : 'none'
                        }}
                    />
                ))}
            </Tabs>
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
            <CenteredStack
                width="100%"
                sx={{
                    mt: theme.spacing(3)
                }}
            >
                <TableComponent
                    columns={tableColumns}
                    data={tableData}
                    showMore
                    onClickShowMore={(rowId) => router.push(`/orders/${rowId}`)}
                />
            </CenteredStack>
            <CreateOrderModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </Stack>
    )
}

export default ManagerInterface