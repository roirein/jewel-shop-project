import { createSelector } from "@reduxjs/toolkit";

export const ordersSelector = (state) => state.orders;

export const selectOrders = createSelector(ordersSelector, (orders) => orders.orders)

