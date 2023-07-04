import PageLayoutComponent from '../components/PageLayout'
import TableComponent from '../../../components/UI/TableComponent'
import { ORDERS_IN_CASTING_TABLE_COLUMNS, ORDERS_IN_DESIGN_TABLE_COLUMNS } from '../../../const/TablesColumns'
import axios from 'axios'
import { getAuthorizationHeader, getUserToken } from '../../../utils/utils'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import { CASTING_STATUS, ORDER_TYPES } from '../../../const/Enums'
import ModelModalComponent from '../../models/components/ModelModal'
import { Button } from '@mui/material'

const OrdersInCastingPage = (props) => {

    const [originalData, setOriginalData] = useState(props.orders)
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [selectedModelNumber, setSelectedModelNumber] = useState(null)
    const router = useRouter()

    const getModelNumberCellValue = (modelNumber) => {
        if (modelNumber) {
            return (
                <Button
                    variant="text"
                    color="primary"
                    sx={{
                        textDecoration: 'underline'
                    }}
                    onClick={() => {
                        setSelectedModelNumber(modelNumber)
                        setShowModal(true)
                    }}
                >
                    {modelNumber}
                </Button>
            )
        } else {
            return modelNumber
        }
    }

    useEffect(() => {
        const data = [];
        originalData.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.orderId,
                    rowContent: [dataElement.orderId, dataElement.customerName, new Date(dataElement.deadline).toLocaleDateString('he-IL'), getModelNumberCellValue(dataElement.modelNumber)]
                });
        })
        setTableData(data)
    }, [originalData])

    return (
        <PageLayoutComponent>
            <TableComponent
                columns={ORDERS_IN_DESIGN_TABLE_COLUMNS}
                data={tableData}
                showMore
                onClickShowMore={(rowId) => {
                    router.push(`/orders/${rowId}`)
                }}
            />
            <ModelModalComponent
                open={showModal}
                modelNumber={selectedModelNumber}
                onClose={() => {
                    setSelectedModelNumber(null)
                    setShowModal(false)
                }}
            />
        </PageLayoutComponent>
    )
}

export default OrdersInCastingPage

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get('http://localhost:3002/order/status/design', {
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

