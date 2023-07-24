import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    customers: [],
    requests: []
}

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        loadCustomers(state, action) {
            state.customers = action.payload.customers
        },
        loadRequests(state, action) {
            state.requests = action.payload.requests
        },
        clearCustomers(state) {
            state.customers = []
        },
        updateRequests(state, action) {
            const requests = [...state.requests];
            const requestIndex = requests.findIndex((req) => req.requestId === action.payload.request.requestId)
            requests[requestIndex] = action.payload.request
            state.requests = [...requests]
        },
        deleteCustomer(state, action) {
            const customers = [...state.customers]
            const index = customers.findIndex((cust) => action.payload.customer.id === cust.id)
            customers.splice(index, 1)
            state.customers = [...customers]
        }
    }
})

export default customersSlice