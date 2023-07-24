import { createSelector } from "@reduxjs/toolkit";

export const selectUser = (state) => state?.user

export const tokenSelector = createSelector(selectUser, (user) => user?.token)

export const permissionLevelSelector = createSelector(selectUser, (user) => user?.permissionLevel);

export const nameSelector = createSelector(selectUser, (user) => user.username)

export const userSelector = createSelector(selectUser, (user) => {
    return {
        ...user
    }
})