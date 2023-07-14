
import PageLayout from '../components/PageLayout';
import CenteredStack from '../../../components/UI/CenteredStack'
import { useTheme, Stack } from '@mui/material';
import { useState, useEffect, useContext, useCallback } from 'react';
import AppContext from '../../../context/AppContext';
import TableComponent from '../../../components/UI/TableComponent';
import { useIntl } from 'react-intl';
import { REQUEST_TABLE_COLUMNS } from '../../../const/TablesColumns';
import { buttonMessages, customerPageMessages } from '../../../translations/i18n';
import RequestModalComponent from '../components/RequestModalComponent';
import { CUSTOMER_ROUTES } from '../../../utils/server-routes';
import { sendHttpRequest } from '../../../utils/requests';
import ButtonComponent from '../../../components/UI/ButtonComponent';

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
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [statusFilter, setStatusFilter] = useState(2)
    const [socket, setSocket] = useState(null)

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

    const contextValue = useContext(AppContext)

    const fecthRequests = async () => {
        const response = await sendHttpRequest(CUSTOMER_ROUTES.REQUESTS, 'GET', null, {
            Authorization: contextValue.token
        })
        return response.data.requests
    }

    useEffect(() => {
        if (contextValue.token){
            fecthRequests().then(requests => setOriginalData(requests))
        }
    }, [contextValue.token])

    useEffect(() => {
        if (contextValue.socket) {
            setSocket(contextValue.socket)
        }
    }, [contextValue.socket])

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
    

    const handleCloseModal = (toFetchRequests) => {
        setSelectedUser({})
        setShowModal(false)
        if (toFetchRequests) {
            fecthRequests().then(requests => setOriginalData(requests))
        }
    }

    const onResponse = (response) => {
        socket?.emit('request-response', {
            customerId: selectedUser.customerId,
            status: response ? 1 : -1
        })
        setStatusFilter(2)
        setSelectedUser({})
        fecthRequests().then(requests => setOriginalData(requests))
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
                        const user = originalData.find((usr) => rowId === usr.customerId)
                        setSelectedUser(user)
                        setShowModal(true)
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
            <RequestModalComponent
                open={showModal}
                onClose={(toFecthRequests) => handleCloseModal(toFecthRequests)}
                userId={selectedUser?.customerId}
                status={selectedUser?.status}
            />
        </PageLayout>
    )
}

export default RequestPage