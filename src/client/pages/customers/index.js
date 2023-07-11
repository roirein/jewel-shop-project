import TableComponent from "../../components/UI/TableComponent";
import { getToken } from "../../utils/utils";
import PageLayout from "./components/PageLayout"
import axios from "axios";
import CenteredStack from "../../components/UI/CenteredStack";
import { CUSTOMER_TABLE_COLUMNS } from "../../const/TablesColumns";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import { customerPageMessages } from "../../translations/i18n";
import { sendHttpRequest } from "../../utils/requests";
import { CUSTOMER_ROUTES } from "../../utils/server-routes";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const CustomerPage = () => {

    const [originalData, setOriginalData] = useState([])
    const [tableData, setTableData] = useState([]);
    const theme = useTheme();
    const intl = useIntl();
    const contextValue = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        sendHttpRequest(CUSTOMER_ROUTES.CUSTOMERS, 'GET', null, {
            Authorization: `Bearer ${getToken()}`
        }).then((res) => {
            setOriginalData(res.data.customers);
            setIsLoading(false)
        })
    }, [])
    
    useEffect(() => {
        const data = [];
        originalData?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.id,
                    rowContent: [dataElement.name, dataElement.email, dataElement.phoneNumber, dataElement.businessName, dataElement.businessPhone, dataElement.joined]
                });
        })
        setTableData(data)
    }, [originalData])


    const onDeleteCustomer = async (customerId) => {
        const newData = [...originalData]
        const customerIndex = newData.findIndex((cust) => cust.id === customerId);
        newData.splice(customerIndex, 1)
        const response = await axios.delete(`http://localhost:3002/customer/deleteCustomer/${customerId}`, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            }
        })
        if (response.status === 200) {
            setOriginalData(newData)
        }
    }

    if (isLoading) {
        return <LoadingSpinner/>
    }

    return (
        <PageLayout>
            <CenteredStack
                width="100%"
                sx={{
                    mt: theme.spacing(3)
                }}
            >
                <TableComponent
                    columns={CUSTOMER_TABLE_COLUMNS}
                    data={tableData}
                    allowDelete
                    deleteButtonLabel={intl.formatMessage(customerPageMessages.removeCustomer)}
                    onDeleteRow={(rowId) => onDeleteCustomer(rowId)}
                />
            </CenteredStack>
        </PageLayout>
    )
}

export default CustomerPage