import { Button, Stack, Typography, useTheme } from "@mui/material"
import ButtonComponent from "../../components/UI/ButtonComponent"
import { Add } from "@mui/icons-material"
import { useIntl } from "react-intl"
import { employeesPageMessages } from "../../translations/i18n"
import { EMPLOYEES_TABLE_COLUMNS } from "../../const/TablesColumns"
import { useState, useEffect, useContext } from "react"
import AppContext from "../../context/AppContext"
import { ROLES_ENUM } from "../../const/Enums"
import CenteredStack from "../../components/UI/CenteredStack"
import TableComponent from "../../components/UI/TableComponent"
import AddNewEmployeeModalComponent from "./components/AddNewEmployeeModal"
import { sendHttpRequest } from "../../utils/requests";
import { EMPLOYEES_ROUTES } from "../../utils/server-routes"

const EmployeesPage = () => {

    const intl = useIntl();
    const theme = useTheme();
    const [originalData, setOriginalData] = useState()
    const [selectedEmployee, setSelectedEmployee] = useState({})
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const contextValue = useContext(AppContext);

    const fecthEmployees = async () => {
        const response = await sendHttpRequest(EMPLOYEES_ROUTES.EMPLOYEES, 'GET', null, {
            Authorization: `Bearer ${contextValue.token}`
        })
        return response.data.employees
    }


    useEffect(() => {
        if (contextValue.token) {
            fecthEmployees().then((employees) => setOriginalData(employees))
        }
    }, [contextValue.token])

    useEffect(() => {
        const data = [];
        originalData?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.id,
                    rowContent: [dataElement.name, ROLES_ENUM[dataElement.role], dataElement.email, dataElement.phoneNumber, dataElement.joined]
                });
        })
        setTableData(data)
    }, [originalData])

    const onAddNewEmployee = async () => {
        fecthEmployees().then((employees) => {
            setOriginalData(employees)
            setShowModal(false)
        })
    }

    const onSelectRow = (rowId) => {
        if (rowId) {
            const user = originalData?.find((usr) => usr.id === rowId)
            setSelectedEmployee(user)
        } else {
            setSelectedEmployee({})
        }
    }

    const onDeleteEmployee = async () => {
        const response = await sendHttpRequest(EMPLOYEES_ROUTES.DELETE_EMPLOYEE(selectedEmployee?.id), 'DELETE', null, {
            Authorization: `Bearer ${contextValue.token}`
        })
        if (response.status === 200) {
            const updatedData = await fecthEmployees()
            setOriginalData(updatedData)
            setSelectedEmployee({})
        }
    }

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
                    selectedRowId={selectedEmployee?.id}
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
                            label={intl.formatMessage(employeesPageMessages.removeEmployee)}
                            onClick={() => onDeleteEmployee()}
                            disabled={!selectedEmployee}
                        />
                    </Stack>
                </CenteredStack>
            </CenteredStack>
            <AddNewEmployeeModalComponent
                open={showModal}
                onClose={() => setShowModal(false)}
                onAddNewEmployee={(employee) => onAddNewEmployee(employee)}
            />
        </Stack>
    )
}


export default EmployeesPage