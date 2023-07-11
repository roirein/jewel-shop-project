import axios from 'axios'
import { getAccessToken, getAuthorizationHeader, getUserToken } from '../../../utils/utils'
import PageLayout from '../components/PageLayout';
import CenteredStack from '../../../components/UI/CenteredStack'
import { useTheme } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import TableComponent from '../../../components/UI/TableComponent';
import { useIntl } from 'react-intl';
import { REQUEST_TABLE_COLUMNS } from '../../../const/TablesColumns';
import { customerPageMessages } from '../../../translations/i18n';
import RequestModalComponent from '../components/RequestModalComponent';
import { CUSTOMER_ROUTES } from '../../../utils/server-routes';

const RequestPage = (props) => {

    const intl = useIntl();

    const statusDict = {
        [-1]: intl.formatMessage(customerPageMessages.rejeceted),
        [0]: intl.formatMessage(customerPageMessages.pending),
        [1]: intl.formatMessage(customerPageMessages.approved),
        [2]: intl.formatMessage(customerPageMessages.pending)
        
    }

    const theme = useTheme();
    const [originalData, setOriginalData] = useState([])
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const contextValue = useContext(AppContext)

    useEffect(() => {
        setOriginalData(props.requests)
    }, [props.requests])

    useEffect(() => {
        const data = [];
        originalData?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.customerId,
                    rowContent: [dataElement.customerName, statusDict[dataElement.status]]
                });
        })
        setTableData(data)
    }, [originalData])

    const handleCloseModal = () => {
        setSelectedUser(null)
        setShowModal(false)
    }

    const onResponse = (response) => {
        const newData = [...originalData]
        const selectedUserIndex = newData.findIndex(usr => usr.customerId === selectedUser)
        const user = newData[selectedUserIndex]
        const updtaedUser = {
            ...user,
            status: response ? 1 : -1
        }
        newData[selectedUserIndex] = updtaedUser;
        setOriginalData(newData)
        const socket = contextValue.socket
        socket.emit('requestResponse', {
            customerId: updtaedUser.customerId,
            status: response ? 1 : -1
        })
        handleCloseModal()
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
                        setSelectedUser(rowId)
                        setShowModal(true)
                    }}
                />
            </CenteredStack>
            <RequestModalComponent
                open={showModal}
                onClose={() => handleCloseModal()}
                userId={selectedUser}
                onResponse={(response) => onResponse(response)}
            />
        </PageLayout>
    )
}

export const getServerSideProps =  async (context) => {
    try {
        const accessToken = getAccessToken(context.req.headers.cookie);
        const responseData = await sendHttpRequest(CUSTOMER_ROUTES.REQUESTS, 'GET', context.req.headers.cookie, null, {
            Authorization: `Bearer ${accessToken}`
        })
        
        return {
            props: {
                requests: responseData.data.requests || [],
                accessToken: responseData.accessToken || null
            }
        }
    } catch(e) {
        return {
            props: {
                requests: null,
                accessToken: null
            }
        }
    }
}

export default RequestPage