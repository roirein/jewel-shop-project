import { useEffect, useState } from "react";
import { formMessages, homePageMessages, ordersPageMessages, tabsMessages } from "../../../translations/i18n"
import { useIntl } from "react-intl"
import { Stack } from "@mui/material";
import TableComponent from "../../../components/UI/TableComponent";

const CustomerReport = (props) => {

    const intl = useIntl();
    const [tableData, setTableData] = useState([])

    const tableColumns = [
        intl.formatMessage(formMessages.firstName),
        intl.formatMessage(formMessages.lastName),
        intl.formatMessage(formMessages.businessName),
        intl.formatMessage(formMessages.phoneNumber),
        intl.formatMessage(tabsMessages.orders),
        intl.formatMessage(ordersPageMessages.price)
    ]

    useEffect(() => {
        const data = []
        props.customers.forEach((customer) => {
            data.push({
                rowId: customer.userId,
                rowContent: [customer.firstName, customer.lastName, customer.businessName, customer.ordersAmount, customer.totalPrice]
            })
        })
        setTableData(data)
    }, [props.customers])

    return (
        <Stack
            width="70%"
        >
            <TableComponent
                columns={tableColumns}
                data={tableData}
            />
        </Stack>
    )
}

export default CustomerReport