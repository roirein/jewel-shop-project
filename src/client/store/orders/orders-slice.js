import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: []
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders(state, action) {
            state.orders = action.payload.orders
        },
        addNewOrder(state, action) {
            state.orders = [...state.orders, action.payload.order]
        },
        clear: () => initialState
    }
})

export default ordersSlice