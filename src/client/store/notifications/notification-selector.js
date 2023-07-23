import { createSelector } from "@reduxjs/toolkit";

export const notificationsSelect = (state) => state.notifications;

export const selectUnreadNotificationsAmount = createSelector(notificationsSelect, (notifications) => {
    const customersAmonut = notifications?.customers.filter((not) => !not.isRead)
    const ordersAmonut = notifications?.orders.filter((not) => !not.isRead)
    const modelsAmonut = notifications?.models.filter((not) => !not.isRead)
    return {
        customers: customersAmonut,
        orders: ordersAmonut,
        models: modelsAmonut
    }
})
