const serverUrl = process.env.SERVER_URL

export const USER_ROUTES = {
    LOGIN:`${serverUrl}/user/login`,
    REGISTER:`${serverUrl}/user/register`,
    LOGOUT:`${serverUrl}/user/logout`,
    RESETPASSWORD:`${serverUrl}/user/resetPassword`,
    VERIFY_CODE: `${serverUrl}/user/verifyCode`,
    UPDATE_PASSWORD: `${serverUrl}/user/updatePassword`,
    USER: `${serverUrl}/user/user`,
    NOTIFICATIONS: (id) => `${serverUrl}/user/notifications/${id}`
}

export const CUSTOMER_ROUTES = {
    REQUESTS: `${serverUrl}/customer/requests`,
    CUSTOMER: (customerId) => `${serverUrl}/customer/customer/${customerId}`,
    CUSTOMERS: `${serverUrl}/customer/customers`
}

export const EMPLOYEES_ROUTES = {
    EMPLOYEES: `${serverUrl}/employee/employees`,
    ADD_EMPLOYEE: `${serverUrl}/employee/employee`,
    DELETE_EMPLOYEE: (id) => `${serverUrl}/employee/employee/${id}`,
    EMPLOYEES_ROLE: `${serverUrl}/employee/employees-role`
}

export const MODELS_ROUTES = {
    ADD_MODEL: `${serverUrl}/model/model`,
    GET_MODELS_METADATA: `${serverUrl}/model/metadata`,
    GET_MODEL: (id) => `${serverUrl}/model/model/${id}`,
    COMMENTS: (id) => `${serverUrl}/model/model/comments/${id}`,
    PRICE: (id) => `${serverUrl}/model/price/${id}`,
    IMAGE: (imagePath) => `${serverUrl}/model/image/${imagePath}`,
    UPDATE: (id) => `${serverUrl}/model/model/${id}`,
    GET_MODELS: `${serverUrl}/model/models`
}

export const ORDERS_ROUTES = {
    ADD_ORDER: `${serverUrl}/order/order`,
    GET_ORDERS: `${serverUrl}/order/orders`,
    GET_ORDER: (id) => `${serverUrl}/order/order/${id}`,
    IMAGE: (imagePath) => `${serverUrl}/order/image/${imagePath}`,
    ORDETS_BY_STATUS: (orderStatus) => `${serverUrl}/order/status/${orderStatus}`,
    TASKS: (id) => `${serverUrl}/order/tasks/${id}`,
    TASK_BY_EMPLOYEE: (orderId, employeeId) => `${serverUrl}/order/task/${employeeId}/${orderId}`
}