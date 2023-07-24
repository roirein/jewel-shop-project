import TableComponent from "../../components/UI/TableComponent";
import PageLayout from "./components/PageLayout"
import CenteredStack from "../../components/UI/CenteredStack";
import { CUSTOMER_TABLE_COLUMNS } from "../../const/TablesColumns";
import {useState, useEffect} from "react";
import {useTheme, Stack} from "@mui/material";
import { useIntl } from "react-intl";
import { customerPageMessages } from "../../translations/i18n";
import ButtonComponent from "../../components/UI/ButtonComponent";
import customersApi from "../../store/customers/customer-api";
import { useSelector } from "react-redux";
import userApi from "../../store/user/user-api";

const CustomerPage = () => {

    const [originalData, setOriginalData] = useState([])
    const [tableData, setTableData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState({})
    const theme = useTheme();
    const intl = useIntl();
    const user = useSelector((state) => userApi.getUser(state))

    useEffect(() => {
        if (user.token) {
            customersApi.retrieveCustomer().then((customers) => setOriginalData(customers))
        }
    }, [user])
    
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
        await customersApi.deleteCustomer(selectedCustomer?.id)
        const customers = await customersApi.retrieveCustomer();
        setOriginalData(customers)
    }

    return (
        <PageLayout>
            <CenteredStack
                width="100%"
                sx={{
                    mt: theme.spacing(3)
                }}
            >
                {tableData.length > 0 && (
                    <TableComponent
                        columns={CUSTOMER_TABLE_COLUMNS}
                        data={tableData}
                        selectedRowId={selectedCustomer?.id}
                        onSelectRow={(rowId) => onSelectRow(rowId)}
                    />
                )}
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
                            disabled={Object.keys(selectedCustomer).length === 0}
                        />
                    </Stack>
                </CenteredStack>
            </CenteredStack>
        </PageLayout>
    )
}

export default CustomerPage