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
        }
    }
})

export default customersSlice