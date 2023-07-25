import {useEffect} from "react"
import CustomerInterface from "./interfaces/customer"
import ManagerInterface from "./interfaces/manager"
import DesignManagerInterface from "./interfaces/design-manager"
import ProductionManagerInterface from "./interfaces/production-manager"
import { useSelector } from "react-redux"
import userApi from "../../store/user/user-api"
import ordersApi from "../../store/orders/orders-api"

const OrdersPage = () => {

    const user = useSelector((state) => userApi.getUser(state))
    const orders = useSelector((state) => ordersApi.getOrders(state))

    useEffect(() => {
        if (user.token) {
            ordersApi.retriveOrders()
        }
    }, [user.token])

    return (
        <>
            {user.permissionLevel === 1 && (
                <ManagerInterface
                    orders={orders}
                />
            )}
            {user.permissionLevel === 2 && (
                <DesignManagerInterface
                    orders={orders}
                />
            )}
            {user.permissionLevel === 3 && (
                <ProductionManagerInterface/>
            )}
            {user.permissionLevel === 5 && (
                <CustomerInterface
                    orders={orders}
                />
            )}
        </>
    )
}

 
export default OrdersPage;