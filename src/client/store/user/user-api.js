import axios from 'axios'
import userSlice from './user-slice'
import store from '../index'
import { nameSelector, permissionLevelSelector, tokenSelector } from './user-selector';

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

const userApi = {
    loginUser,
    getUserPermissionLevel,
    getUserToken,
    getUsername,
    createNewUser
}

export default userApi