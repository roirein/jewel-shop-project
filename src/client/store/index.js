import  { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from './user/user-slice'
import customersSlice from "./customers/customer-slice";
import notificationsSlice from "./notifications/notification-slice";
import employeesSlice from "./employees/emplyees-slice";
import modelsSlice from "./models/models-slice";

const rootReducer = combineReducers({
    user: userSlice.reducer,
    customers: customersSlice.reducer,
    notifications: notificationsSlice.reducer,
    employees: employeesSlice.reducer,
    models: modelsSlice.reducer
})

const store = configureStore({
    reducer:  rootReducer
})

export default store