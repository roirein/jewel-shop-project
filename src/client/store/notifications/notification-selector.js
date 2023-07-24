import { createSelector } from "@reduxjs/toolkit";

export const notificationsSelect = (state) => state.notifications;

export const selectNotifications = createSelector(notificationsSelect, (notifications) => {
    const customers = notifications?.customers
    const orders = notifications?.orders
    const models = notifications?.models
    return {
        customers: customers,
        orders: orders,
        models: models
    }
})
