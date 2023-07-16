import { Stack, Tab, Tabs, useTheme, Link} from "@mui/material"
import { CUSTOMER_INTERFACE_TABS, CUSTOMER_ORDERS_TABS, DESIGN_MANAGER_ORDERS_TABS } from "../../../const/TabDefinitions"
import { useEffect, useState } from "react"
import { Add } from "@mui/icons-material"
import TableComponent from "../../../components/UI/TableComponent"
import { CUSTOMER_TABLE_COLUMNS, ORDERS_IN_DESIGN_TABLE_COLUMNS, ORDER_CUSTOMER_TABEL_COLUMNS } from "../../../const/TablesColumns"
import { MODEL_STATUS_ENUM, ORDER_STATUS, ORDER_TYPES } from "../../../const/Enums"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import CreateOrderModal from "../components/NewOrderModal"
import { modelsPageMessages, ordersPageMessages } from "../../../translations/i18n"
import CenteredStack from "../../../components/UI/CenteredStack"
import CreateModelModal from "../../models/components/CreateModelModal"
import ModelModalComponent from '../../models/components/ModelModal'
import dayjs from "dayjs"

const DesignManagerInterface = (props) => {

    const theme = useTheme();
    const router = useRouter();
    const intl = useIntl();

    const [selectedTab, setSelectedTab] = useState(0)
    const [tableColumns, setTableColumns] = useState(ORDERS_IN_DESIGN_TABLE_COLUMNS)
    const [tableData, setTableData] = useState([])
    const [displayedOrders, setDisplayedOrders] = useState(props.orders)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showModelModal, setShowMModelModal] = useState(false)
    const [modelData, setModelData] = useState({})
    const [selectedModelNumber, setSelectedModelNumber] = useState(null)

    useEffect(() => {
        if (props.orders) {
            setDisplayedOrders(props.orders)
        }
    }, [props.orders])

    const handleOpenCreateModal = (orderId) => {
        const order = props.orders.find((ord) => ord.orderId === orderId)
        const orderModelData = {
            id: order.modelMetadataId,
            item: order.item,
            setting: order.setting,
            sideStoneSize: order.sideStoneSize,
            mainStoneSize: order.mainStoneSize
        }
        setModelData(orderModelData);
        setShowCreateModal(true);
    }

    const handleOpenModelModal = (modelNumber) => {
        setSelectedModelNumber(modelNumber)
        setShowMModelModal(true)
    }

    const handelCloseModelModal = (toFetchModels) => {
        setSelectedModelNumber(null)
        setShowMModelModal(false)
        if (toFetchModels) {
            router.push('/models')
        }
    }

    const handleCloseCreateModal = (toFetchModels) => {
        setModelData({});
        setShowCreateModal(false);
        if (toFetchModels) {
            router.push('/models')
        }
    }

    const getModelColumnValue = (modelNumber, orderId) => {
        if (modelNumber) {
            return (
                <Link
                    href="#"
                    onClick={() => handleOpenModelModal(modelNumber)}
                >
                    {modelNumber}
                </Link>
            )
        } else {
            return (
                <Link href="#"
                    onClick={() => handleOpenCreateModal(orderId)}
                >
                    {intl.formatMessage(modelsPageMessages.addModel)}
                </Link>
            )
        }
    }

    useEffect(() => {
        const data = [];
        displayedOrders?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.orderId,
                    rowContent: [dataElement.orderId, dayjs(dataElement.deadline).format('DD/MM/YYYY'), getModelColumnValue(dataElement.modelNumber, dataElement.orderId), MODEL_STATUS_ENUM[dataElement.modelStatus]]
                });
        })
        setTableData(data)
    }, [displayedOrders])

    useEffect(() => {
        let newOrders;
        if (selectedTab === 0) {
            newOrders = props.orders
        }
        if (selectedTab === 1) {
            newOrders = props.orders.filter((ord) => ord.modelStatus && ord.modelStatus !== 2)
        }
        if (selectedTab === 2) {
            newOrders = props.orders.filter((ord) => ord.modelStatus && ord.modelStatus === 2)
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
                    columns={tableColumns}
                    data={tableData}
                    showMore
                    onClickShowMore={(rowId) => router.push(`/orders/${rowId}`)}
                />
            </CenteredStack>
            <CreateModelModal
                open={showCreateModal}
                modelData={modelData}
                onClose={(toFetchModels) => handleCloseCreateModal()}
            />
            <ModelModalComponent
                open={showModelModal}
                modelNumber={selectedModelNumber}
                onClose={(toFecthModels) => handelCloseModelModal(toFecthModels)}
            />
        </Stack>
    )
}

export default DesignManagerInterface