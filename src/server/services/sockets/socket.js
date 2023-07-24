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
    const socketId = users[manager.dataValues.userId]
    const notificationData = {
        resource: 'order',
        type: 'new-order',
        resourceId: data.orderId,
        recipient: manager.dataValues.userId,
        data: {
            customerName: data.customerName,
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('new-order', notification)
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
    const socketId = users[designManager.dataValues.userId]
    const notificationData = {
        resource: 'order',
        type: 'new-design',
        resourceId: data.orderId,
        recipient: designManager.dataValues.userId,
        data: {
            orderId: data.orderId,
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('new-design', notification)
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

    const socketId = users[order.dataValues.customerId]
    const notificationData = {
        resource: 'order',
        type: 'customer-design-complete',
        resourceId: data.orderId,
        recipient: order.dataValues.customerId,
        data: {
            orderId: data.orderId,
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('customer-design-complete', notification)
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
    const socketId = users[manager.dataValues.userId]
    const notificationData = {
        resource: 'order',
        type: 'customer-order-approval',
        resourceId: data.orderId,
        recipient: manager.dataValues.userId,
        data: {
            orderId: data.orderId,
            customerName: data.customerName,
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('customer-order-approval', notification)
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
    const socketId = users[productionManager.dataValues.userId]
    const notificationData = {
        resource: 'order',
        type: 'production-start',
        resourceId: data.orderId,
        recipient: productionManager.dataValues.userId,
        data: {
            orderId: data.orderId,
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('production-start', notification)
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

    const socketId = users[productionManager.dataValues.userId]
    const notificationData = {
        resource: 'order',
        type: 'task-complete',
        resourceId: data.orderId,
        recipient: productionManager.dataValues.userId,
        data: {
            orderId: data.orderId,
            employeeName: data.username
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('task-complete', notification)
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
    const socketId = users[manager.dataValues.userId]
    const notificationData = {
        resource: 'order',
        type: 'production-end',
        resourceId: data.orderId,
        recipient: manager.dataValues.userId,
        data: {
            orderId: data.orderId,
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('production-end', notification)
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

    const socketId = users[order.dataValues.customerId]
    const notificationData = {
        resource: 'order',
        type: 'order-ready',
        resourceId: data.orderId,
        recipient: order.dataValues.customerId,
        data: {
            orderId: data.orderId,
        }
    }

    const customerDetails = await OrderCustomer.findOne({
        where: {
            customerId: order.dataValues.customerId
        }
    })

    sendOrderReadyMail(customerDetails.dataValues.customerName, customerDetails.dataValues.email, data.orderId)

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('order-ready', notification)
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

    const socketId = users[order.dataValues.customerId]
    const notificationData = {
        resource: 'order',
        type: 'price-offer',
        resourceId: data.orderId,
        recipient: order.dataValues.customerId,
        data: {
            orderId: data.orderId,
        }
    }

    const notification = await Notifications.create(notificationData)
    if (socketId) {
        ioInstance.to(socketId).emit('price-offer', notification)
    }

}

module.exports = {
    initSocket,
    sendNewCustomerNotification,
}