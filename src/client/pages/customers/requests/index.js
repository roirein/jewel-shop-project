
import PageLayout from '../components/PageLayout';
import CenteredStack from '../../../components/UI/CenteredStack'
import { useTheme, Stack } from '@mui/material';
import { useState, useEffect, useContext} from 'react';
import TableComponent from '../../../components/UI/TableComponent';
import { useIntl } from 'react-intl';
import { REQUEST_TABLE_COLUMNS } from '../../../const/TablesColumns';
import { buttonMessages, customerPageMessages } from '../../../translations/i18n';
import ButtonComponent from '../../../components/UI/ButtonComponent';
import customersApi from '../../../store/customers/customer-api';
import TemplateContext from '../../../context/template-context';
import { useSelector } from 'react-redux';

const RequestPage = () => {

    const intl = useIntl();

    const statusDict = {
        [-1]: intl.formatMessage(customerPageMessages.rejeceted),
        [0]: intl.formatMessage(customerPageMessages.pending),
        [1]: intl.formatMessage(customerPageMessages.approved),  
    }

    const theme = useTheme();
    const [originalData, setOriginalData] = useState([]);
    const [dispalyedData, setDisplayedData] = useState([])
    const [tableData, setTableData] = useState([]);
    const [selectedUser, setSelectedUser] = useState({})
    const [statusFilter, setStatusFilter] = useState(2)
    const contextValue = useContext(TemplateContext)
    const requestsFromStore = useSelector((state) => customersApi.getRequests(state))

    const tableFilters = [
        {
            name: 'status',
            label: intl.formatMessage(customerPageMessages.requestStatus),
            options: {
                ...statusDict,
                [2]: intl.formatMessage(buttonMessages.showAll)
            }
        }
    ]

    useEffect(() => {
        customersApi.retrieveRequests().then((requests) => setOriginalData(requests))
    }, [requestsFromStore])

    useEffect(() => {
        if (statusFilter === 2) {
            setDisplayedData(originalData)
        } else {
            const filteredRequests = originalData.filter((request) => {
                return request.status === statusFilter
            })
            setDisplayedData(filteredRequests)
        }
    }, [statusFilter, originalData])

    useEffect(() => {
        const data = [];
        dispalyedData.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.customerId,
                    rowContent: [dataElement.customerName, statusDict[dataElement.status]]
                });
        })
        setTableData(data)
    }, [dispalyedData])
    

    const onResponse = async (response) => {
        await customersApi.respondCustomerRequest(response, selectedUser.customerId)
        setStatusFilter(2)
        setSelectedUser({})
        const requests = await customersApi.retrieveRequests();
        setOriginalData(requests)
    }

    const onFilterChange = (filterValue) => {
        setStatusFilter(Number(filterValue))
    }


    const onSelectRow = (rowId) => {
        if (rowId) {
            const user = originalData.find((usr) => usr.customerId === rowId)
            setSelectedUser(user)
        } else {
            setSelectedUser({})
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
                    columns={REQUEST_TABLE_COLUMNS}
                    data={tableData}
                    showMore
                    onClickShowMore={(rowId) => {
                        contextValue.onOpenRequestModal(rowId)
                    }}
                    selectedRowId={selectedUser?.customerId}
                    onSelectRow={(rowId) => onSelectRow(rowId)}
                    tableFilters={tableFilters}
                    onFilterChange={(filterValue) => onFilterChange(filterValue)}
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
                            label={intl.formatMessage(buttonMessages.approve)}
                            onClick={() => onResponse(true)}
                            disabled={selectedUser?.status !== 0}
                        />
                    </Stack>
                    <Stack
                        width="15%"
                    >
                        <ButtonComponent
                             label={intl.formatMessage(buttonMessages.reject)}
                             onClick={() => onResponse(false)}
                             disabled={selectedUser?.status !== 0}
                        />
                    </Stack>
                </CenteredStack>
            </CenteredStack>
        </PageLayout>
    )
}

export default RequestPage