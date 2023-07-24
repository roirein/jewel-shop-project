import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    customers: [],
    models: [],
    orders: [],
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        loadNotifications(state, action) {
            state.customers = action.payload.customers
            state.models = action.payload.models,
            state.orders = action.payload.orders
        },
        addNewNotification(state, action) {
            const resource = action.payload.notification.resource
            switch(resource) {
                case 'customer':
                    state.customers = [...state.customers, action.payload.notification]
                    break
                case 'order':
                    state.models = [...state.models, action.payload.notification]
                    break
                case 'model': 
                    state.orders = [...state.orders, action.payload.notification]
                    break;
                default: 
                    state = initialState
            }
        },
        readNotification(state, action) {
            const resource = action.payload.notification.resource
            let notifications;
            switch(resource) {
                case 'customer':
                    notifications = [...state.customers]
                    break
                case 'order':
                    notifications = [...state.orders]
                    break
                case 'model': 
                    notifications = [...state.models]
                    break;
                default: 
                    state = initialState
            }
            const index = notifications.findIndex((not) => not.id === action.payload.notification.id)
            notifications[index] = action.payload.notification;
            if (resource === 'customer') {
                state.customers = [...notifications]
            }
        },
        clear: () => initialState
    }
})

export default notificationsSlice