import { createSelector } from "@reduxjs/toolkit";

export const employeesSelector = (state) => state.employees

export const selectEmployees = createSelector(employeesSelector, (employees) => employees.employees)