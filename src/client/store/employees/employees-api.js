import axios from 'axios';
import userApi from '../user/user-api';
import store from '..';
import employeesSlice from './emplyees-slice';
import { employeesSelector, selectEmployees } from './employees.selector';

const employeesRoute = `${process.env.SERVER_URL}/employee`

const loadEmployees = async () => {
    const token = userApi.getUserToken(store.getState());
    const response = await axios.get(`${employeesRoute}/employees`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (response.status === 200) {
        store.dispatch(employeesSlice.actions.loadEmployees({employees: response.data.employees}))
        return response.data.employees
    }
}

const retriveEmployees = async () => {
    let employees = selectEmployees(store.getState())
    if (employees.length === 0) {
        employees = await loadEmployees();
        return employees
    }
    return employees
}

const getEmployees = (state) => {
    return selectEmployees(state)
}

const addNewEmployee = async (data) => {
    try {
        const token = userApi.getUserToken(store.getState())
        const response = await axios.post(`${employeesRoute}/employee`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.status === 201) {
            store.dispatch(employeesSlice.actions.addNewEmployee({employee: response.data.employee}))
        }
    } catch (e) {
        throw (e)
    }
}

const deleteEmployee = async (employeeId) => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.delete(`${employeesRoute}/employee/${employeeId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (response.status === 200) {
        const employees = selectEmployees(store.getState())
        const employee = employees.find((emp) => emp.id === employeeId)
        store.dispatch(employeesSlice.actions.deleteEmployee({employee}))
        return true
    }
} 

const employeesApi = {
    loadEmployees,
    retriveEmployees,
    getEmployees,
    addNewEmployee,
    deleteEmployee
}

export default employeesApi