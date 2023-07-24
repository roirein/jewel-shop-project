import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    employees: []
}

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        loadEmployees(state, action) {
            state.employees = action.payload.employees;
        },
        addNewEmployee(state, action) {
            state.employees = [...state.employees, action.payload.employee]
        },
        deleteEmployee(state, action) {
            const employees = [...state.employees]
            const index = employees.findIndex((emp) => action.payload.employee.id === emp.id)
            employees.splice(index, 1)
            state.employees = [...employees]
        },
        clear: () => initialState
    }
})

export default employeesSlice