import { Stack, Tab, Tabs, useTheme, Link} from "@mui/material"
import { CUSTOMER_INTERFACE_TABS, CUSTOMER_ORDERS_TABS, DESIGN_MANAGER_ORDERS_TABS } from "../../../const/TabDefinitions"
import { useEffect, useState, useContext } from "react"
import { Add } from "@mui/icons-material"
import TableComponent from "../../../components/UI/TableComponent"
import { CUSTOMER_TABLE_COLUMNS, ORDERS_IN_DESIGN_TABLE_COLUMNS, ORDERS_IN_PRODUCTION_TABLE_COLUMNS, ORDER_CUSTOMER_TABEL_COLUMNS } from "../../../const/TablesColumns"
import { MODEL_STATUS_ENUM, ORDER_STATUS, ORDER_TYPES, PRODUCTION_STATUS } from "../../../const/Enums"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import { modelsPageMessages, ordersPageMessages } from "../../../translations/i18n"
import CenteredStack from "../../../components/UI/CenteredStack"
import dayjs from "dayjs"
import AppContext from "../../../context/AppContext"
import { sendHttpRequest } from "../../../utils/requests"
import { ORDERS_ROUTES } from "../../../utils/server-routes"

const ProductionManagerInterface = () => {

    const theme = useTheme();
    const router = useRouter();
    const intl = useIntl();
    const contextValue = useContext(AppContext)

    const [selectedTab, setSelectedTab] = useState(0)
    const [tableData, setTableData] = useState([])
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([])

    useEffect(() => {
        sendHttpRequest(ORDERS_ROUTES.ORDETS_BY_STATUS('production'), "GET", {}, {
            Authorization: `Bearer ${contextValue.token}`
        }).then((response) => {
                setOrders(response.data.orders)
                setDisplayedOrders(response.data.orders)
        })
    }, [])

    useEffect(() => {
        const data = [];
        displayedOrders?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.orderId,
                    rowContent: [dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.deadline, PRODUCTION_STATUS[dataElement.productionStatus]]
                });
        })
        setTableData(data)
    }, [displayedOrders])

    useEffect(() => {
        let newOrders;
        if (selectedTab === 0) {
            newOrders = [...orders]
        }
        if (selectedTab === 1) {
            newOrders = orders.filter((ord) => ord.productionStatus !== 1 && ord.productionStatus !== 6)
        }
        if (selectedTab === 2) {
            newOrders = orders.filter((ord) => ord.productionStatus === 6)
        }
        setDisplayedOrders(newOrders)
    }, [selectedTab])

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
                onChange={(event, newValue) => setSelectedTab(newValue)}
            >
                {DESIGN_MANAGER_ORDERS_TABS.map((tab, index) => (
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
            <CenteredStack
                width="100%"
                sx={{
                    mt: theme.spacing(3)
                }}
            >
                <TableComponent
                    columns={ORDERS_IN_PRODUCTION_TABLE_COLUMNS}
                    data={tableData}
                    showMore
                    onClickShowMore={(rowId) => router.push(`/orders/${rowId}`)}
                />
            </CenteredStack>
        </Stack>
    )
}

export default ProductionManagerInterface