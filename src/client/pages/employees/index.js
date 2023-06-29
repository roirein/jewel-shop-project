import axios from "axios"
import { getAuthorizationHeader, getUserToken } from "../../utils/utils"
import { Button, Stack, Typography, useTheme } from "@mui/material"
import { Add } from "@mui/icons-material"
import { useIntl } from "react-intl"
import { employeesPageMessages } from "../../translations/i18n"
import { EMPLOYEES_TABLE_COLUMNS } from "../../const/TablesColumns"
import { useState, useEffect } from "react"
import { ROLES_ENUM } from "../../const/Enums"
import CenteredStack from "../../components/UI/CenteredStack"
import TableComponent from "../../components/UI/TableComponent"
import AddNewEmployeeModalComponent from "./components/AddNewEmployeeModal"

const EmployeesPage = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const [originalData, setOriginalData] = useState(props.employees)
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const data = [];
        originalData.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.id,
                    rowContent: [dataElement.name, ROLES_ENUM[dataElement.role], dataElement.email, dataElement.phoneNumber, dataElement.joined]
                });
        })
        setTableData(data)
    }, [originalData])

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            <Stack
                sx={{
                    pr: theme.spacing(4)
                }}
            >
                <Button
                    variant="outlined"
                    sx={{
                        width: '10%',
                        border: `${theme.spacing(0)} solid ${theme.palette.primary.main}`
                    }}
                    onClick={() => setShowModal(true)}
                >
                    <Add color={theme.palette.primary.main}/>
                    <Typography
                        variant="body2"
                        color={theme.palette.primary.main}
                    >
                        {intl.formatMessage(employeesPageMessages.addNewEmployee)}
                    </Typography>
                </Button>
            </Stack>
            <CenteredStack
                width="100%"
                sx={{
                    mt: theme.spacing(3)
                }}
            >
                <TableComponent
                    columns={EMPLOYEES_TABLE_COLUMNS}
                    data={tableData}
                    allowDelete
                    deleteButtonLabel={intl.formatMessage(employeesPageMessages.removeEmployee)}
                    onDeleteRow={(rowId) => console.log(rowId)}
                />
            </CenteredStack>
            <AddNewEmployeeModalComponent
                open={showModal}
                onClose={() => setShowModal(false)}
            />
        </Stack>
    )
}

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get('http://localhost:3002/employee/getEmployees', {
        headers: {
            Authorization: getAuthorizationHeader(token)
        }
    })

    return {
        props: {
            employees: response.data.employees
        }
    }
}

export default EmployeesPage