import axios from 'axios'
import userSlice from './user-slice'
import store from '../index'
import { nameSelector, permissionLevelSelector, tokenSelector, userSelector } from './user-selector';
import customersSlice from '../customers/customer-slice';
import employeesSlice from '../employees/emplyees-slice';
import notificationsSlice from '../notifications/notification-slice';
import notifcationsApi from '../notifications/notification-api';
import modelsSlice from '../models/models-slice';
import ordersSlice from '../orders/orders-slice';

const userRoute = `${process.env.SERVER_URL}/user`
const state = store.getState()

const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${userRoute}/login`, {
            email,
            password
        });
        if (response.status === 200) {
            store.dispatch(userSlice.actions.loginSuccess(response.data.user))
            return response.data.user
        }
    } catch (e) {
        throw (e)
    }
}


const getUserToken = (appState) => {
    return tokenSelector(appState)
}

const getUserPermissionLevel = (appState) => {
    return permissionLevelSelector(appState)
}

const getUsername = (appState) => {
    return nameSelector(appState)
}

const getUser = (appState) => {
    return userSelector(appState)
}

const createNewUser = async (userData) => {
    try {
        const response = await axios.post(`${userRoute}/register`, userData);
        if (response.status === 201) {
            return true
        }
    } catch (e) {
        throw(e)
    }
}

const getResetPasswordCode = async (email) => {
    try {
        const response = await axios.post(`${userRoute}/reset-code`, {
            email
        })
        if (response.status === 201) {
            return true
        }
    } catch (e) {
        throw (e)
    }
}

const verifyResetPasswordCode = async (email, code) => {
    try {
        const response = await axios.post(`${userRoute}/verify-code`, {
            email,
            code
        })
        if (response.status === 200) {
            return true
        }
    } catch (e) {
        throw (e)
    }
}

const resetPassword = async (email, password, confirmPassword) => {
    try {
        const response = await axios.patch(`${userRoute}/reset-password `, {
            email,
            password,
            confirmPassword
        })
        if (response.status === 200) {
            return true
        }
    } catch (e) {
        console.log(e)
        throw (e)
    }
}

const loadUser = async () => {
    let token = sessionStorage.getItem('token');
    if (!token) {
        token = localStorage.getItem('token')
    }

    if (token) {
        const response = await axios.post(`${userRoute}/user`, {
            token
        })

        store.dispatch(userSlice.actions.loginSuccess({token, ...response.data.user}))
    }
}

const logoutUser = async () => {
    const user = userSelector(store.getState())
    await axios.post(`${userRoute}/logout`, {
        userId: user.userId
    }, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })

    const slices = [userSlice, customersSlice, employeesSlice, notificationsSlice, modelsSlice, ordersSlice]
    slices.forEach(slice => {
        store.dispatch(slice.actions.clear())
    })   
}

const userApi = {
    loginUser,
    getUserPermissionLevel,
    getUserToken,
    getUsername,
    createNewUser,
    getResetPasswordCode,
    verifyResetPasswordCode,
    resetPassword,
    loadUser,
    getUser,
    logoutUser
}

export default userApi