const serverUrl = process.env.SERVER_URL

export const USER_ROUTES = {
    LOGIN:`${serverUrl}/user/login`,
    REGISTER:`${serverUrl}/user/register`,
    LOGOUT:`${serverUrl}/user/logout`,
    RESETPASSWORD:`${serverUrl}/user/resetPassword`,
    VERIFY_CODE: `${serverUrl}/user/verifyCode`,
    UPDATE_PASSWORD: `${serverUrl}/user/updatePassword`,
    USER: (token) => `${serverUrl}/user/user/${token}`,
    REFRESH_TOKEN: `${serverUrl}/user/user/refresh-token`
}