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
import { useSelector } from "react-redux"
import employeesApi from "../../store/employees/employees-api"

const EmployeesPage = () => {

    const intl = useIntl();
    const theme = useTheme();
    const [originalData, setOriginalData] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState({})
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const contextValue = useContext(AppContext);
    const employees = useSelector((state) => employeesApi.getEmployees(state))

    useEffect(() => {
        employeesApi.retriveEmployees()
    }, [])

    useEffect(() => {
        setOriginalData(employees)
    }, [employees])

    useEffect(() => {
        const data = [];
        console.log(originalData)
        originalData?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.id,
                    rowContent: [dataElement.name, ROLES_ENUM[dataElement.role], dataElement.email, dataElement.phoneNumber, dataElement.joined]
                });
        })
        setTableData(data)
    }, [originalData])


    const onSelectRow = (rowId) => {
        if (rowId) {
            const user = originalData?.find((usr) => usr.id === rowId)
            setSelectedEmployee(user)
        } else {
            setSelectedEmployee({})
        }
    }

    const onDeleteEmployee = async () => {
        const isDeleted = await employeesApi.deleteEmployee(selectedEmployee?.id)
        if (isDeleted) {
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
                            disabled={Object.keys(selectedEmployee).length === 0}
                        />
                    </Stack>
                </CenteredStack>
            </CenteredStack>
            <AddNewEmployeeModalComponent
                open={showModal}
                onClose={() => setShowModal(false)}
                //onAddNewEmployee={(employee) => onAddNewEmployee(employee)}
            />
        </Stack>
    )
}


export default EmployeesPage