import { Stack, Button, useTheme, Typography } from "@mui/material"
import { useIntl } from "react-intl"
import { Add } from "@mui/icons-material"
import { useState, useContext, useEffect } from "react"
import AppContext from '../../context/AppContext'
//import CreateModelModal from "./components/CreateModelModal"
import { modelsPageMessages, ordersPageMessages } from "../../translations/i18n"
import CreateOrderModal from "./components/NewOrderModal"
import CenteredStack from "../../components/UI/CenteredStack"
import { DESIGN_MANAGER_ORDERS_COLUMNS, ORDERS_MANAGER_TABLE_COLUMNS } from "../../const/TablesColumns"
import { ITEM_ENUMS, ORDER_STATUS, ORDER_TYPES } from "../../const/Enums"
import { getAuthorizationHeader, getUserToken } from "../../utils/utils"
import axios from "axios"
//import CenteredStack from '../../components/UI/CenteredStack'
import TableComponent from '../../components/UI/TableComponent'
//import axios from "axios"
//import { ITEM_ENUMS, MODEL_STATUS_ENUM } from "../../const/Enums"
//import { getAuthorizationHeader, getUserToken } from "../../utils/utils"
//import { MODELS_TABL_COLUMNS } from "../../const/TablesColumns"
//import ModelModalComponent from "./components/ModelModal"
import { useRouter } from "next/router"

const OrdersPage = (props) => {

    const contextValue = useContext(AppContext);
    const intl = useIntl();
    const theme = useTheme();
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [originalData, setOriginalData] = useState(props.orders)
    const [selectedModel, setSelectedModel] = useState(null);
    const [showModelModal, setShowModelModal] = useState(false)
    const [tableData, setTableData] = useState([]);
    const router = useRouter()

    const getTableContent = (dataElement) => {
        console.log(dataElement)
        switch (contextValue.permissionLevel) {
            case 1: 
                return[dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName, ORDER_STATUS[dataElement.status], dataElement.created, dataElement.deadline]
            case 2: 
                return [dataElement.orderId, dataElement.customerName, ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize, 
                            new Date(dataElement.created).toLocaleDateString('he-IL'), new Date(dataElement.deadline).toLocaleDateString('he-IL')]
            default:
                return []
        }
    }
    
    useEffect(() => {
        const data = [];
        originalData.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.orderId,
                    rowContent: getTableContent(dataElement)
                });
        })
        setTableData(data)
    }, [originalData])

    // const onAddNewModel = (model) => {
    //     setOriginalData([...originalData, model])
    //     setShowCreateModal(false)
    // }

    // const onRespondMoal = (modelNumber, status) => {
    //     const models = [...originalData]
    //     const modelsIndex = models.findIndex((model) => model.modelNumber === modelNumber);
    //     newData.splice(modelsIndex, 1)
    //     models[modelsIndex].status = status,
    //     setOriginalData[models]
    // }

    const getTableColumns = () => {
        switch (contextValue.permissionLevel) {
            case 1: 
                return ORDERS_MANAGER_TABLE_COLUMNS
            case 2:
                return DESIGN_MANAGER_ORDERS_COLUMNS
            default: 
                return []
        }
    }

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            {(contextValue.permissionLevel === 1 || contextValue.permissionLevel === 5) && (
                <Stack
                    sx={{
                        pr: theme.spacing(4)
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
                <TableComponent
                    columns={getTableColumns()}
                    data={tableData}
                    showMore
                    onClickShowMore={(rowId) => {
                        router.push(`/orders/${rowId}`)
                    }}
                />
            </CenteredStack>
            <CreateOrderModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </Stack>
    )
}

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get('http://localhost:3002/order/orders', {
        headers: {
            Authorization: getAuthorizationHeader(token)
        }
    })

    return {
        props: {
         orders: response.data.orders
        }
    }
}
 
export default OrdersPage;