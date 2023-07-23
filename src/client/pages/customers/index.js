import TableComponent from "../../components/UI/TableComponent";
import PageLayout from "./components/PageLayout"
import CenteredStack from "../../components/UI/CenteredStack";
import { CUSTOMER_TABLE_COLUMNS } from "../../const/TablesColumns";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useTheme, Stack } from "@mui/material";
import { useIntl } from "react-intl";
import { customerPageMessages } from "../../translations/i18n";
import { sendHttpRequest } from "../../utils/requests";
import { CUSTOMER_ROUTES } from "../../utils/server-routes";
import ButtonComponent from "../../components/UI/ButtonComponent";
import customersApi from "../../store/customers/customer-api";

const CustomerPage = () => {

    const [originalData, setOriginalData] = useState([])
    const [tableData, setTableData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState({})
    const theme = useTheme();
    const intl = useIntl();
    const contextValue = useContext(AppContext)

    useEffect(() => {
        customersApi.retrieveCustomer().then((customers) => setOriginalData(customers))
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

    const onSelectRow = (rowId) => {
        if (rowId) {
            const user = originalData.find((usr) => usr.id === rowId)
            setSelectedCustomer(user)
        } else {
            setSelectedCustomer({})
        }
    }

    const onDeleteCustomer = async () => {
        const response = await sendHttpRequest(CUSTOMER_ROUTES.CUSTOMER(selectedCustomer?.id), 'DELETE', null, {
            Authorization: `Bearer ${contextValue.token}`
        })
        if (response.status === 200) {
            const updatedData = await fecthCustomers()
            setOriginalData(updatedData)
            setSelectedCustomer({})
        }
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
                    selectedRowId={selectedCustomer?.id}
                    onSelectRow={(rowId) => onSelectRow(rowId)}
                />
                <CenteredStack
                    width="100%"
                    direction="row"
                    columnGap={theme.spacing(4)}
                >
                    <Stack
                        width="15%"
                    >
                        <ButtonComponent
                            label={intl.formatMessage(customerPageMessages.removeCustomer)}
                            onClick={() => onDeleteCustomer()}
                            disabled={!selectedCustomer}
                        />
                    </Stack>
                </CenteredStack>
            </CenteredStack>
        </PageLayout>
    )
}

export default CustomerPage