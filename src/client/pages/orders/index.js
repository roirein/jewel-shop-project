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
}

 
export default OrdersPage;