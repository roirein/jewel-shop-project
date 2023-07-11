const serverUrl = process.env.SERVER_URL

export const USER_ROUTES = {
    LOGIN:`${serverUrl}/user/login`,
    REGISTER:`${serverUrl}/user/register`,
    LOGOUT:`${serverUrl}/user/logout`,
    RESETPASSWORD:`${serverUrl}/user/resetPassword`,
    VERIFY_CODE: `${serverUrl}/user/verifyCode`,
    UPDATE_PASSWORD: `${serverUrl}/user/updatePassword`,
    USER: `${serverUrl}/user/user`,
    REFRESH_TOKEN: `${serverUrl}/user/user/refresh-token`
}

export const CUSTOMER_ROUTES = {
    REQUESTS: `${serverUrl}/customer/requests`,
    CUSTOMER: (customerId) => `${serverUrl}/customer/customer/${customerId}`,
    CUSTOMERS: `${serverUrl}/customer/customers`
}