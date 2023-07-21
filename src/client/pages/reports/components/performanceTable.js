import { useIntl } from "react-intl"
import { ordersPageMessages, reportsPageMessages, tabsMessages } from "../../../translations/i18n";
import { useEffect, useState } from "react";
import TableComponent from "../../../components/UI/TableComponent";
import { Stack } from "@mui/material";

const PerformanceTable = (props) => {

    const intl = useIntl();

    const tableColumns = [
        intl.formatMessage(reportsPageMessages.measure),
        intl.formatMessage(reportsPageMessages.amount),
        intl.formatMessage(reportsPageMessages.percentagePage)
    ]

    const [tableData, setTableData] = useState([])
    
    useEffect(() => {
        const ordersAmount = props.selectedMonthOrders.length
        const ordersPercentageChagne = (((props.selectedMonthOrders.length - props.prevMonthOrders.length) / props.selectedMonthOrders.length) * 100).toFixed(2)
        const selectedMonthIncomes = props.selectedMonthOrders.reduce((sum, obj) => sum + obj.price, 0)
        const prevMonthIncomes = props.prevMonthOrders.reduce((sum, obj) => sum + obj.price, 0)
        const incomesPercentageChange = (((selectedMonthIncomes - prevMonthIncomes) / selectedMonthIncomes) * 100).toFixed(2)
        const ordersRow = {
            rowId: ordersAmount,
            rowContent: [intl.formatMessage(tabsMessages.orders), ordersAmount, `${ordersPercentageChagne}%`]
        }
        const incomesRow = {
                rowId: selectedMonthIncomes,
                rowContent: [intl.formatMessage(reportsPageMessages.incomes), selectedMonthIncomes, `${incomesPercentageChange}%`]
        }
        setTableData([ordersRow, incomesRow])
    }, [props.selectedMonthOrders, props.prevMonthOrders])

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

export default PerformanceTable