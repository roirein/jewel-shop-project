import { Stack, Tab, Tabs, useTheme, Button, Typography, Link} from "@mui/material"
import { CUSTOMER_INTERFACE_TABS, CUSTOMER_ORDERS_TABS, MANAGER_ORDERS_TABS } from "../../../const/TabDefinitions"
import { useContext, useEffect, useState } from "react"
import { Add } from "@mui/icons-material"
import TableComponent from "../../../components/UI/TableComponent"
import { CUSTOMER_TABLE_COLUMNS, ORDERS_IN_DESIGN_MANAGER_TABLE_COLUMNS, ORDERS_MANAGER_TABLE_COLUMNS, ORDER_CUSTOMER_TABEL_COLUMNS } from "../../../const/TablesColumns"
import { MODEL_STATUS_ENUM, ORDER_STATUS, ORDER_TYPES } from "../../../const/Enums"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import CreateOrderModal from "../components/NewOrderModal"
import { ordersPageMessages } from "../../../translations/i18n"
import CenteredStack from "../../../components/UI/CenteredStack"
import { sendHttpRequest } from "../../../utils/requests"
import { ORDERS_ROUTES } from "../../../utils/server-routes"
import AppContext from "../../../context/AppContext"
import dayjs from "dayjs"
import ModelModalComponent from "../../models/components/ModelModal"

const ManagerInterface = (props) => {

    const theme = useTheme();
    const router = useRouter();
    const intl = useIntl();
    const contextValue = useContext(AppContext)

    const [selectedTab, setSelectedTab] = useState(0)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [tableColumns, setTableColumns] = useState(ORDERS_MANAGER_TABLE_COLUMNS)
    const [tableData, setTableData] = useState([])
    const [displayedOrders, setDisplayedOrders] = useState(props.orders)
    const [showModelModal, setShowModelModal] = useState(false)
    const [selectedModel, setSelectedModel] = useState(null)

    useEffect(() => {
        if (props.orders) {
            setDisplayedOrders(props.orders)
        }
    }, [props.orders])

    const handleOpenModelModal = (modelNumber) => {
        setShowModelModal(true);
        setSelectedModel(modelNumber)
    }

    const handleCloseModal = (toFetchModels) => {
        setShowModelModal(false)
        setSelectedModel(null)
        if (toFetchModels) {
            sendHttpRequest(ORDERS_ROUTES.ORDETS_BY_STATUS('design'), "GET", {}, {
                Authorization: `Bearer ${contextValue.token}`
            }).then((res) => setDisplayedOrders(res.data.orders))
        }
    }

    const createTableData = () => {
        const data = []
        switch(selectedTab) {
            case 0:
            case 1:
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
                break;
            case 3:
                displayedOrders?.forEach((dataElement) => {
                    data.push(
                        {
                            rowId: dataElement.orderId,
                            rowContent: [
                                            dataElement.orderId,
                                            dataElement.customerName,
                                            dayjs(dataElement.deadline).format('DD/MM/YYYY'),
                                            <Link
                                                onClick={() => handleOpenModelModal(dataElement.modelNumber)}
                                            >
                                                {dataElement.modelNumber}
                                            </Link>,
                                            MODEL_STATUS_ENUM[dataElement.modelStatus]
                                        ]
                        });
                })
                break;
            default:
                break;
        }
        return data
    }

    useEffect(() => {
        const data = createTableData();
        console.log(data)
        setTableData(data)
    }, [displayedOrders])


    useEffect(() => {
        if (selectedTab === 0) {
            setDisplayedOrders(props.orders)
            setTableColumns(ORDERS_MANAGER_TABLE_COLUMNS)
        }
        if (selectedTab === 1) {
            const orders = displayedOrders.filter(order => order.status === 0)
            setDisplayedOrders(orders)
            setTableColumns(ORDERS_MANAGER_TABLE_COLUMNS)
        }
        if (selectedTab === 3) {
            setTableColumns(ORDERS_IN_DESIGN_MANAGER_TABLE_COLUMNS)
            sendHttpRequest(ORDERS_ROUTES.ORDETS_BY_STATUS('design'), "GET", {}, {
                Authorization: `Bearer ${contextValue.token}`
            }).then((res) => setDisplayedOrders(res.data.orders))
        }
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
                onChange={(event, value) => setSelectedTab(value)}
            >
                {MANAGER_ORDERS_TABS.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        value={index}
                        sx={{
                            border: index === selectedTab ? `${theme.spacing(1)} solid ${theme.palette.primary.main}` : 'none',
                            color: theme.palette.primary.main
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
            {selectedTab === 3 && (
                <ModelModalComponent
                    open={showModelModal}
                    modelNumber={selectedModel}
                    onClose={(toFecthModels) => handleCloseModal(toFecthModels)}
                />
            )}
        </Stack>
    )
}

export default ManagerInterface