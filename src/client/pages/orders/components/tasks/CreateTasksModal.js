import ModalComponent from '../../../../components/UI/ModalComponent'
import { Stack, Stepper, Step, StepLabel, useTheme } from '@mui/material'
import { useIntl } from 'react-intl'
import { ordersPageMessages, buttonMessages, employeesPageMessages } from '../../../../translations/i18n'
import ButtonComponent from '../../../../components/UI/ButtonComponent'
import { useState, useRef, useEffect, useContext } from 'react'
import TaskFormComponent from './TaskForm'
import AppContext from '../../../../context/AppContext'
import axios from 'axios'
import { getAuthorizationHeader } from '../../../../utils/utils'
import TaskSummaryComponent from './TasksSummary'
import { useRouter } from 'next/router'

const CreateTasksModal = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext)
    const [activeStep, setActiveStep] = useState(0);
    const [taskIndex, setTaskIndex] = useState(1);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const formRef = useRef();
    const router = useRouter()

    useEffect(() => {
        axios.get(`http://localhost:3002/employee/employees`, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            }
        }).then((response) => {
            const employeesData = response.data.employees.map((employee) => {
                return {
                    value: employee.employeeId,
                    label: employee.name,
                    role: employee.role
                }
            })
            setEmployees(employeesData)
        })
    }, [])

    const steps = [
        {
            id: 1,
            label: intl.formatMessage(employeesPageMessages.jeweller),
            employeeType: 4,
            completed: false
        },
        {
            id: 2,
            label: intl.formatMessage(employeesPageMessages.setter),
            employeeType: 5,
            completed: false,
        },
        {
            id: 3,
            label: intl.formatMessage(ordersPageMessages.finishing),
            employeeType: 0,
            completed: false,
        },
        {
            id: 4,
            label: intl.formatMessage(ordersPageMessages.qualityEnsurance),
            employeeType: 0,
            completed: false
        },
        {
            id: 5,
            label: intl.formatMessage(ordersPageMessages.summary),
            completed: false
        }
    ]


    const handleContinue = () => {
        formRef.current.createTask();
    }

    const onCreateNewTask = (data) => {
        const newTask = {
            index: taskIndex,
            employee: data.employee,
            description: data.description,
            position: activeStep + 1
        }
        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        steps[activeStep].completed = true
        setActiveStep(activeStep + 1); 
        setTaskIndex(taskIndex + 1)
    }

    const getTasksForSummary = () => {
        return tasks.map((task) => {
            const employee = employees.find((emp) => emp.value === task.employee)
            return {
                index: task.index,
                employee: employee.label,
                description: task.description
            }
        })
    }

    const handleSkip = () => {
        setActiveStep(activeStep + 1)
    }

    const getEmployeesForStep = (role) => {
        if (role === 0) {
            return employees
        } else {
            return employees.filter(employee => employee.role === role)
        }
    }


    const handleSendTasks = async () => {
        const tasksData = tasks.map((task) => {
            return {
                employeeId: task.employee,
                description: task.description,
                position: task.position
            }
        })

        const response = await axios.post(`http://localhost:3002/order/tasks/${router.query.orderId}`, {tasks: tasksData}, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            }
        })
        if (response.status === 201) {
            props.onClose();
            router.push('/orders')
            contextValue.socket.emit('send-task-to-employee')
        }
    }

    const getModalActions = () => {
        return (
            <Stack
                direction="row"
                width="100%"
            >
                <Stack
                    width="12.5%"
                    justifyContent="left"
                >
                    <ButtonComponent
                        onClick={() => props.onClose()}
                        label={intl.formatMessage(buttonMessages.close)}
                    >
                    </ButtonComponent>
                </Stack>
                <Stack
                    direction="row"
                    columnGap={theme.spacing(3)}
                    width="12%"
                    justifyContent="right"
                    sx={{
                        ml: 'auto'
                    }}
                >
                    {activeStep < 2 && (
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.skip)}
                            onClick={() => handleSkip()}
                        /> 
                    )}
                    {activeStep < steps.length - 1 && (
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.continue)}
                            onClick={() => handleContinue()}
                        />
                    )}
                    {activeStep === steps.length - 1 && (
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.send)}
                            onClick={() => handleSendTasks()}
                        />
                    )}
                </Stack>
            </Stack>
        )
    }

    return (
        <ModalComponent
            title={intl.formatMessage(ordersPageMessages.tasksToOrder)}
            onClose={props.onClose}
            open={props.open}
            width="sm"
            actions={getModalActions()}
        >
            <Stepper
                activeStep={activeStep}
            >
                {steps.map((step) => (
                    <Step key={step.id}>
                        <StepLabel>
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Stack
                width="100%"
                sx={{
                    direction: theme.direction,
                    mt: theme.spacing(3)
                }}
            >
                {activeStep === 0 && (
                    <TaskFormComponent
                        employees={getEmployeesForStep(4)}
                        onCreateNewTask={(data) => onCreateNewTask(data)}
                        ref={formRef}
                    />  
                )}
                {activeStep === 1 && (
                    <TaskFormComponent
                        employees={getEmployeesForStep(5)}
                        onCreateNewTask={(data) => onCreateNewTask(data)}
                        ref={formRef}
                    />  
                )}
                {activeStep === 2 && (
                    <TaskFormComponent
                        employees={getEmployeesForStep(0)}
                        onCreateNewTask={(data) => onCreateNewTask(data)}
                        ref={formRef}
                    />  
                )}
                {activeStep === 3 && (
                    <TaskFormComponent
                        employees={getEmployeesForStep(0)}
                        onCreateNewTask={(data) => onCreateNewTask(data)}
                        ref={formRef}
                    />  
                )}
                {activeStep === 4 && (
                    <TaskSummaryComponent
                        tasks={getTasksForSummary()}
                    />
                )}
            </Stack>
        </ModalComponent>
    )
}

export default CreateTasksModal