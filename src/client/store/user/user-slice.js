import { createSlice } from "@reduxjs/toolkit";
import { initSocket } from "../../socket/socket";

const initialState = {
    userId: null,
    username: null,
    permissionLevel: null,
    email: null,
    phoneNumber: null,
    token: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess(state, action)  {
            state.userId = action.payload.id,
            state.username = action.payload.username,
            state.email = action.payload.email,
            state.phoneNumber = action.payload.phoneNumber,
            state.permissionLevel = action.payload.permissionLevel,
            state.token = action.payload.token
            initSocket(action.payload.id)
        }
    }
})

export default userSlice