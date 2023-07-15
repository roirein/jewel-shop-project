import { useState, useContext, useEffect } from "react"
import AppContext from '../../context/AppContext'
import { DESIGN_MANAGER_ORDERS_COLUMNS, ORDERS_IN_PRODUCTION_TABLE_COLUMNS, ORDERS_MANAGER_TABLE_COLUMNS } from "../../const/TablesColumns"
import { ITEM_ENUMS, ORDER_STATUS, ORDER_TYPES, PRODUCTION_STATUS } from "../../const/Enums"
import { getAuthorizationHeader, getRefreshToken, getUserToken } from "../../utils/utils"
import axios from "axios"
import TableComponent from '../../components/UI/TableComponent'
import { useRouter } from "next/router"
import PageLayoutComponent from "./components/PageLayout"
import { parse } from "cookie"
import { sendHttpRequest } from "../../utils/requests"
import { headers } from "next/dist/client/components/headers"
import { ORDERS_ROUTES, USER_ROUTES } from "../../utils/server-routes"
import CustomerInterface from "./interfaces/customer"

const OrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const contextValue = useContext(AppContext)

    useEffect(() => {
        if (contextValue.token) {
            sendHttpRequest(ORDERS_ROUTES.GET_ORDERS, 'GET', null, {
                Authorization: `Bearer ${contextValue.token}`
            }).then((response) => setOrders(response.data.orders))
        }
    }, [contextValue.token])

    return (
        <>
            {contextValue.permissionLevel === 5 && (
                <CustomerInterface
                    orders={orders}
                />
            )}
        </>
    )
    // const con textValue = useContext(AppContext);
    // const [originalData, setOriginalData] = useState(props.orders)
    // const [isLoading, setIsLoading] = useState(false)
    // const [tableData, setTableData] = useState([]);
    // const router = useRouter()

    // const getTableContent = (dataElement) => {
    //     switch (contextValue.permissionLevel) {
    //         case 1:
    //             return[dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName, ORDER_STATUS[dataElement.status], dataElement.created, dataElement.deadline]
    //         case 2: 
    //             return [dataElement.orderId, dataElement.customerName, ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize, 
    //                         new Date(dataElement.created).toLocaleDateString('he-IL'), new Date(dataElement.deadline).toLocaleDateString('he-IL')]
    //         case 3: 
    //             return [dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName,
    //                         new Date(dataElement.created).toLocaleDateString('he-IL'), PRODUCTION_STATUS[dataElement.productionStatus]]
    //         case 5: 
    //             return[dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName, ORDER_STATUS[dataElement.status], dataElement.created, dataElement.deadline]
    //         default:
    //             return []
    //     }
    // }

    // useEffect(() => {
    //     if (props.accessToken) {
    //         const cookie = document.cookie.split('=')
    //         const tokens = JSON.parse(cookie[1])
    //         tokens.accessToken = props.accessToken
    //         document.cookie = `tokens=${JSON.stringify(tokens)}`
    //     }
    // }, [])
    
    // useEffect(() => {
    //     const data = [];
    //     originalData.forEach((dataElement) => {
    //         data.push(
    //             {
    //                 rowId: dataElement.orderId,
    //                 rowContent: getTableContent(dataElement)
    //             });
    //     })
    //     setTableData(data)
    // }, [originalData])

    // console.log(tableData)


    // const getTableColumns = () => {
    //     switch (contextValue.permissionLevel) {
    //         case 1: 
    //             return ORDERS_MANAGER_TABLE_COLUMNS
    //         case 2:
    //             return DESIGN_MANAGER_ORDERS_COLUMNS
    //         case 3:
    //             return ORDERS_IN_PRODUCTION_TABLE_COLUMNS
    //         case 5: 
    //             return ORDERS_MANAGER_TABLE_COLUMNS
    //         default: 
    //             return []
    //     }
    // }

    // return (
    //     <PageLayoutComponent>
    //         <TableComponent
    //             columns={getTableColumns()}
    //             data={tableData}
    //             showMore
    //             onClickShowMore={(rowId) => {
    //                 router.push(`/orders/${rowId}`)
    //             }}
    //         />
    //     </PageLayoutComponent>
    // )
}

 
export default OrdersPage;