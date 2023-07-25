const User = require("../../models/users/user");
const Customer = require('../../models/users/customer');
const {sendRequestApproveMail, sendOrderReadyMail} = require("../emails/emails");
const Request = require('../../models/users/requests');
const Notifications = require("../../models/notifications/notifications");
const JewelModel = require("../../models/models/jewelModel");
const Employee = require("../../models/users/employee");
const Order = require("../../models/orders/order");
const Comments = require("../../models/models/modelComments");
const OrdersInCasting = require("../../models/orders/ordersInCasing");
const OrdersInProduction = require("../../models/orders/ordersInProduction");
const FixOrder = require('../../models/orders/fixOrder');
const Task = require("../../models/tasks/task");
const OrderCustomer = require("../../models/orders/orderCustomer");
const OrderTimeline = require("../../models/orders/orderTimeline");
const ModelPrice = require("../../models/models/modelPrice");
const dayjs = require("dayjs");
const ModelMetadata = require("../../models/models/modelMetadata");
const createNotification = require("./utils");

let ioInstance = null;

const users = {}

const initSocket = (io) => {

    ioInstance = io

    ioInstance.on('connection', (socket) => {
        socket.on('login', (data) => {
            users[data.userId] = socket.id
        })

        socket.on('request-response', async (data) => {
            await updateRequestStatus(data.status, data.customerId)
        })

        socket.on('new-model', async (data) => {
            await onCreateNewModel(data.modelNumber, data.title)
        })

        socket.on('model-approve', async (data) => {
            await onModelApprove(data)
        })

        socket.on('model-reject', async (data) => {
            await onModelReject(data)
        })

        socket.on('model-update', async (data) => {
            await onModelUpdate(data)
        })

        socket.on('new-order', async (data) => {
            await onCreateNewOrder(data)
        })

        socket.on('new-design', async (data) => {
            await onNewDesignRequest(data)
        })

        socket.on('customer-design-complete', async (data) => {
            await onDesignComplete(data)
        })

        socket.on('customer-order-approval', async (data) => {
            await setOrderPrice(data)
        })

        socket.on('casting-start', async (data) => {
            await startCasting(data)
        })

        socket.on('casting-end', async (data) => {
            await endCasting(data)
        })

        socket.on('production-start', async (data) => {
            await startProduction(data)
        })

        socket.on('task-complete', async (data) => {
            await completeTask(data)
        })

        socket.on('production-end', async (data) => {
            await endProduction(data)
        })

        socket.on('order-ready', async (data) => {
            await updateCustomer(data)
        })

        socket.on('order-complete', async (data) => {
            await completeOrder(data)
        })

        socket.on('price-offer', async (data) => {
            await sendPriceOffer(data)
        })


        socket.on('read-notification', async (data) => {
            await readNotification(data)
        })
    })
}

const findUserSocket = (userId) => {
    console.log(users[userId])
    return users[userId]
}

const readNotification = async (data) => {
    await Notifications.update({
        isRead: true
    }, {
        where: {
            id: data.id
        }
    })
}

const sendNewCustomerNotification = async (customerName, customerId, managerId) => {
    const socketId = findUserSocket(managerId);
    const notification = await createNotification(managerId, 'customer', 'new_customer', customerId, {
        name: customerName
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const onCreateNewModel = async (modelNumber, modelTitle) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = findUserSocket(manager.dataValues.userId)
    const notification = await createNotification(manager.dataValues.userId, 'model', 'new-model', modelNumber, {
        modelNumber,
        modelTitle
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}


const onModelApprove = async (modelData) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 2
        }
    })
    const socketId = findUserSocket(manager.dataValues.userId)
    const notification = await createNotification(manager.dataValues.userId, 'model', 'model-approve', modelData.modelNumber, {
        modelNumber: modelData.modelNumber
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const onModelReject = async (data) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 2
        }
    })
    const socketId = findUserSocket(manager.dataValues.userId)
    const notification = await createNotification(manager.dataValues.userId, 'model', 'model-reject', data.modelNumber, {
        modelNumber: data.modelNumber
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const onModelUpdate = async (data) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = findUserSocket(manager.dataValues.userId)
    const notification = await createNotification(manager.dataValues.userId, 'model', 'model-update', data.modelNumber, {
        modelNumber: data.modelNumber
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}


const onCreateNewOrder = async (data) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = findUserSocket(manager.dataValues.userId)
    const notification = await createNotification(manager.dataValues.userId, 'order', 'new-order', data.orderId, {
        customerName: data.customerName
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const onNewDesignRequest = async (data) => {
    await Order.update({
        status: 2
    }, {
        where: {
            orderId: data.orderId
        }
    })

    await OrderTimeline.update({
        designStart: dayjs()
    }, {
        where: {
            orderId: data.orderId
        }
    })

    const designManager = await User.findOne({
        where: {
            permissionLevel: 2
        }
    })
    const socketId = findUserSocket(designManager.dataValues.userId)
    const notification = await createNotification(designManager.dataValues.userId, 'order', 'new-design', data.orderId, {
        orderId: data.orderId
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const onDesignComplete = async (data) => {
    const order = await Order.findOne({
        where: {
            orderId: data.orderId
        }
    })

    order.status = 4
    await order.save();

    const socketId = findUserSocket(order.dataValues.customerId)
    const notification = await createNotification(order.dataValues.customerId, 'order', 'customer-design-complete', data.orderId, {
        orderId: data.orderId
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const setOrderPrice = async (data) => {
    await Order.update({
        status: 5,
        price: data.price
    }, {
        where: {
            orderId: data.orderId
        }
    })

    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = findUserSocket(manager.dataValues.userId)
    const notification = await createNotification(manager.dataValues.userId, 'order', 'customer-order-approval', data.orderId, {
        orderId: data.orderId,
        customerName: data.customerName
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}


const startCasting = async (data) => {
    await OrdersInCasting.create({
        orderId: data.orderId,
        castingStatus: 2
    })

    await Order.update({
        status: 6
    }, {
        where: {
            orderId: data.orderId
        }
    })

    await OrderTimeline.update({
        castingStart: dayjs()
    }, {
        where: {
            orderId: data.orderId
        }
    })
}

const endCasting = async (data) => {
    await OrdersInCasting.update({
        castingStatus: 3
    }, {
        where: {
            orderId: data.orderId,
        }
    })

    await Order.update({
        status: 7
    }, {
        where: {
            orderId: data.orderId
        }
    })

    await OrderTimeline.update({
        castingEnd: dayjs()
    }, {
        where: {
            orderId: data.orderId
        }
    })
}

const startProduction = async (data) => {
    await OrdersInProduction.create({
        orderId: data.orderId
    })

    await Order.update({
        status: 8
    }, {
        where: {
            orderId: data.orderId
        }
    })

    await OrderTimeline.update({
        productionStart: dayjs()
    }, {
        where: {
            orderId: data.orderId
        }
    })

    const productionManager = await User.findOne({
        where: {
            permissionLevel: 3
        }
    })
    const socketId = findUserSocket(productionManager.dataValues.userId)
    const notification = await createNotification(productionManager.dataValues.userId, 'order', 'production-start', data.orderId, {
        orderId: data.orderId,
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}


const completeTask = async (data) => {
    const task = await Task.findOne({
        where: {
            taskId: data.taskId
        }
    })

    const nextTask = await Task.findOne({
        where: {
            taskId: task.dataValues.nextTask
        }
    })

    await OrdersInProduction.update({
        productionStatus: nextTask ? nextTask.dataValues.position + 1 : 6
    }, {
        where: {
            orderId: data.orderId
        }
    })

    task.isCompleted = true
    await task.save()
    if (nextTask) {
        nextTask.isBlocked = false;
        await nextTask.save()
    }

    const productionManager = await User.findOne({
        where: {
            permissionLevel: 3
        }
    })
    const socketId = findUserSocket(productionManager.dataValues.userId)
    const notification = await createNotification(productionManager.dataValues.userId, 'order', 'task-complete', data.orderId, {
        orderId: data.orderId,
        employeeName: data.username
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }

}

const endProduction = async (data) => {
    await Order.update({
        status: 9
    }, {
        where: {
            orderId: data.orderId
        }
    })

    await OrderTimeline.update({
        productionEnd: dayjs()
    }, {
        where: {
            orderId: data.orderId
        }
    })

    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = findUserSocket(manager.dataValues.userId)
    const notification = await createNotification(manager.dataValues.userId, 'order', 'production-end', data.orderId, {
        orderId: data.orderId,
        employeeName: data.username
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const updateCustomer = async (data) => {
    const order = await Order.findOne({
        where: {
            orderId: data.orderId
        }
    })

    order.status = 10
    await order.save();

    const customerDetails = await OrderCustomer.findOne({
        where: {
            customerId: order.dataValues.customerId
        }
    })

    sendOrderReadyMail(customerDetails.dataValues.customerName, customerDetails.dataValues.email, data.orderId)

    const socketId = findUserSocket(order.dataValues.customerId)
    const notification = await createNotification(order.dataValues.customerId, 'order', 'order-ready', data.orderId, {
        orderId: data.orderId,
    })
    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }
}

const completeOrder = async (data) => {
    await Order.update({
        status: 11
    }, {
        where: {
            orderId: data.orderId
        }
    })

    await OrderTimeline.update({
        delivered: dayjs()
    }, {
        where: {
            orderId: data.orderId
        }
    })
}

const updateRequestStatus = async (response, customerId) => {
    const customer = await User.findOne({
        where: {
            userId: customerId
        },
        attributes: ['email', 'firstName', 'lastName']
    })

    if (response === 1) {
        sendRequestApproveMail(`${customer.dataValues.firstName} ${customer.dataValues.lastName}`, customer.dataValues.email)
    }

    await Request.update({
        status: response
    }, {
        where: {
            customerId
        }
    })
}

const sendPriceOffer = async (data) => {
    await FixOrder.update({
        priceffer: data.price 
    }, {
        where: {
            orderId: data.orderId
        }
    })

    const order = await Order.findOne({
        where: {
            orderId: data.orderId
        }
    })

    order.status = 4
    await order.save();

    const socketId = findUserSocket(order.dataValues.customerId)
    const notification = await createNotification(order.dataValues.customerId, 'order', 'price-offer', data.orderId, {
        orderId: data.orderId
    })

    if (socketId) {
        ioInstance.to(socketId).emit('notification', notification)
    }

}

module.exports = {
    initSocket,
    sendNewCustomerNotification,
}