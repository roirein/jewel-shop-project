import { Stack, Tab, Tabs, useTheme, Link} from "@mui/material"
import { CUSTOMER_INTERFACE_TABS, CUSTOMER_ORDERS_TABS, DESIGN_MANAGER_ORDERS_TABS } from "../../../const/TabDefinitions"
import { useEffect, useState, useContext } from "react"
import { Add } from "@mui/icons-material"
import TableComponent from "../../../components/UI/TableComponent"
import { CUSTOMER_TABLE_COLUMNS, ORDERS_IN_DESIGN_TABLE_COLUMNS, ORDERS_IN_PRODUCTION_TABLE_COLUMNS, ORDER_CUSTOMER_TABEL_COLUMNS } from "../../../const/TablesColumns"
import { MODEL_STATUS_ENUM, ORDER_STATUS, ORDER_TYPES, PRODUCTION_STATUS } from "../../../const/Enums"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import CenteredStack from "../../../components/UI/CenteredStack"
import ordersApi from "../../../store/orders/orders-api"

const ProductionManagerInterface = () => {

    const theme = useTheme();
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState(0)
    const [tableData, setTableData] = useState([])
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([])

    useEffect(() => {
        ordersApi.loadOrdersByStatus('production').then((ords) => setOrders(ords))
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
        console.log(newOrders)
        setDisplayedOrders(newOrders)
    }, [selectedTab, orders])

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