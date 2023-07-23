import { createSelector } from "@reduxjs/toolkit";

export const selectCustomers = (state) => state.customers;

export const customersSelectore = createSelector(selectCustomers, (customers) => customers.customers)

export const requestsSelector = createSelector(selectCustomers, (customers) => customers.requests)