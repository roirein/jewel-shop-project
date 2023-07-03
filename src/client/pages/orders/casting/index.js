import PageLayoutComponent from '../components/PageLayout'
import TableComponent from '../../../components/UI/TableComponent'
import { ORDERS_IN_CASTING_TABLE_COLUMNS } from '../../../const/TablesColumns'
import axios from 'axios'
import { getAuthorizationHeader, getUserToken } from '../../../utils/utils'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import { CASTING_STATUS, ORDER_TYPES } from '../../../const/Enums'

const OrdersInCastingPage = (props) => {

    const [originalData, setOriginalData] = useState(props.orders)
    const [tableData, setTableData] = useState([]);
    const router = useRouter()

    useEffect(() => {
        const data = [];
        originalData.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.orderId,
                    rowContent: [dataElement.orderId, ORDER_TYPES[dataElement.type], dataElement.customerName, dataElement.deadline, CASTING_STATUS[dataElement.castingStatus]]
                });
        })
        setTableData(data)
    }, [originalData])

    return (
        <PageLayoutComponent>
            <TableComponent
                columns={ORDERS_IN_CASTING_TABLE_COLUMNS}
                data={tableData}
                showMore
                onClickShowMore={(rowId) => {
                    router.push(`/orders/${rowId}`)
                }}
            />
        </PageLayoutComponent>
    )
}

export default OrdersInCastingPage

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get('http://localhost:3002/order/status/casting', {
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

