import axios from 'axios'
import store from '..'
import userApi from '../user/user-api'
import ordersSlice from './orders-slice'
import { selectOrders } from './orders-selector'
import { getSocket } from '../../socket/socket'
import dayjs from 'dayjs'
import { POSITIONS } from '../../const/Enums'

const ordersRoute = `${process.env.SERVER_URL}/order`

const loadOrders = async () => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.get(`${ordersRoute}/orders`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (response.status === 200) {
        store.dispatch(ordersSlice.actions.setOrders({orders: response.data.orders}))
        return response.data.orders
    }
}

const retriveOrders = async () => {
    let orders = selectOrders(store.getState());
    if (orders.length === 0) {
        orders = await loadOrders();
    }
    return orders
}

const getOrders = (state) => {
    return selectOrders(state)
}

const addNewOrder = async (data) => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.post(`${ordersRoute}/order`, data, {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    })
    if (response.status === 201) {
        const permissionLevel = userApi.getUserPermissionLevel(store.getState())
        if (permissionLevel === 5) {
            const socket = getSocket();
            socket.emit('new-order', {
                customerName: response.data.customerName,
                orderId: response.data.orderId
            })
        }
        const order = {
            ...response.data,
            deadline: dayjs(response.data.deadline).format('DD.MM.YYYY')
        }
        store.dispatch(ordersSlice.actions.addNewOrder({order}))
        return order
    }
}

const loadOrder = async (orderId) => {
    const token = userApi.getUserToken(store.getState());
    let order = {}
    const response = await axios.get(`${ordersRoute}/order/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    order = {...response.data.order}
    if (order.type === 1) {
        const imageResponse = await axios.get(`${ordersRoute}/image/${order.design}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        })
        const imageUrl = URL.createObjectURL(imageResponse.data)
        order = {
            ...order,
            imageUrl
        }
    }
    if (order.type === 2 || (order.type === 1 && order.status > 2)) {
        const modelImageResponse = await axios.get(`${process.env.SERVER_URL}/model/image/${order.image}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        })
        const modelImageUrl = URL.createObjectURL(modelImageResponse.data)
        order = {
            ...order,
            modelImageUrl
        }
    }
    return order
}

const updateOrderStatus = async (eventName, data) => {
    const socket = getSocket();
    socket.emit(eventName, data)
    await loadOrders()
}

const loadOrdersByStatus = async (status) => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.get(`${ordersRoute}/status/${status}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (response.status === 200) {
        return response.data.orders
    }
}

const createTasks = async (orderId, tasks) => {
    const token = userApi.getUserToken(store.getState());
    await axios.post(`${ordersRoute}/tasks/${orderId}`, {tasks}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

const getTasks = async (orderId) => {
    const token = userApi.getUserToken(store.getState());
    const tasks = await axios.get(`${ordersRoute}/tasks/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const tasksData = tasks.data.tasks.map((task, index) => {
        return {
            index: index + 1,
            employee: task.employeeName,
            description: task.description,
            position: POSITIONS[task.position],
            isCompleted: task.isCompleted
        }
    })
    console.log(tasksData)
    return tasksData

}

const getTaskByEmployee = async (employeeId, orderId) => {
    const token = userApi.getUserToken(store.getState());
    const response = await axios.get(`${ordersRoute}/task/${employeeId}/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const taskData = response.data.task
    const result =  {
            index: 1,
            taskId: taskData.taskId,
            employee: taskData.employeeName,
            description: taskData.description,
            position: POSITIONS[taskData.position],
            isCompleted: taskData.isCompleted,
            isBlocked: taskData.isBlocked
        }
    return result
}

const ordersApi = {
    loadOrders,
    retriveOrders,
    getOrders,
    addNewOrder,
    loadOrder,
    updateOrderStatus,
    loadOrdersByStatus,
    createTasks,
    getTasks,
    getTaskByEmployee
}

export default ordersApi