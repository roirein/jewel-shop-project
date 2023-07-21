import { useIntl } from "react-intl"
import { ordersPageMessages, reportsPageMessages } from "../../../translations/i18n";
import { useEffect, useState } from "react";
import {ORDER_TYPES} from '../../../const/Enums'
import { Stack } from "@mui/material";
import TableComponent from "../../../components/UI/TableComponent";

const PerformanceByOrders = (props) => {

    const intl = useIntl();
    const [tableData, setTableData] = useState([])

    const tableColumns = [
        intl.formatMessage(ordersPageMessages.orderType),
        intl.formatMessage(reportsPageMessages.amount),
        intl.formatMessage(reportsPageMessages.percentagePage)
    ]

    const getRowData = (orderType) => {
        const selectedOrderByType = props.selectedOrders.filter((ord) => ord.type === orderType)
        const prevOrderByType = props.prevOrders.filter((ord) => ord.type === orderType)
        const changeInPercentage = (((selectedOrderByType.length - prevOrderByType.length) / selectedOrderByType.length) * 100).toFixed(2)
        return {
            rowId: orderType,
            rowContent: [ORDER_TYPES[orderType], selectedOrderByType.length, `${changeInPercentage}%`]
        }
    }

    useEffect(() => {
        const data = [
            getRowData(1),
            getRowData(2),
            getRowData(3)
        ]
        setTableData(data)
    }, [props.selectedOrders, props.prevOrders])

    return (
        <Stack
            width="50%"
        >
            <TableComponent
                columns={tableColumns}
                data={tableData}            
            />
        </Stack>
    )
}

export default PerformanceByOrders