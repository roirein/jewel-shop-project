import { useState, useContext, useEffect } from "react"
import AppContext from '../../context/AppContext'
import { DESIGN_MANAGER_ORDERS_COLUMNS, ORDERS_IN_PRODUCTION_TABLE_COLUMNS, ORDERS_MANAGER_TABLE_COLUMNS } from "../../const/TablesColumns"
import { ITEM_ENUMS, ORDER_STATUS, ORDER_TYPES, PRODUCTION_STATUS } from "../../const/Enums"
import { getAuthorizationHeader, getUserToken } from "../../utils/utils"
import axios from "axios"
import TableComponent from '../../components/UI/TableComponent'
import { useRouter } from "next/router"
import PageLayoutComponent from "./components/PageLayout"
import { parse } from "cookie"

const OrdersPage = (props) => {

    const contextValue = useContext(AppContext);
    const [originalData, setOriginalData] = useState(props.orders)
    const [tableData, setTableData] = useState([]);
    const router = useRouter()

    const getTableContent = (dataElement) => {
        switch (contextValue.permissionLevel) {
            case 1:
                return[dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName, ORDER_STATUS[dataElement.status], dataElement.created, dataElement.deadline]
            case 2: 
                return [dataElement.orderId, dataElement.customerName, ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize, 
                            new Date(dataElement.created).toLocaleDateString('he-IL'), new Date(dataElement.deadline).toLocaleDateString('he-IL')]
            case 3: 
                return [dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName,
                            new Date(dataElement.created).toLocaleDateString('he-IL'), PRODUCTION_STATUS[dataElement.productionStatus]]
            case 5: 
                return[dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName, ORDER_STATUS[dataElement.status], dataElement.created, dataElement.deadline]
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


    const getTableColumns = () => {
        switch (contextValue.permissionLevel) {
            case 1: 
                return ORDERS_MANAGER_TABLE_COLUMNS
            case 2:
                return DESIGN_MANAGER_ORDERS_COLUMNS
            case 3:
                return ORDERS_IN_PRODUCTION_TABLE_COLUMNS
            case 5: 
                return ORDERS_MANAGER_TABLE_COLUMNS
            default: 
                return []
        }
    }

    return (
        <PageLayoutComponent>
            <TableComponent
                columns={getTableColumns()}
                data={tableData}
                showMore
                onClickShowMore={(rowId) => {
                    router.push(`/orders/${rowId}`)
                }}
            />
        </PageLayoutComponent>
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