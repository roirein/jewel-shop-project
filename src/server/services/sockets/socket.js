const User = require("../../models/users/user");
const Customer = require('../../models/users/customer');
const {sendRequestApproveMail} = require("../emails/emails");
const Request = require('../../models/users/requests');
const Notifications = require("../../models/notifications/notifications");

let ioInstance = null;

const users = {}

const initSocket = (io) => {

    ioInstance = io

    ioInstance.on('connection', (socket) => {
        socket.on('login', (data) => {
            console.log(data)
            users[data.userId] = socket.id
        })

        socket.on('requestResponse', (data) => {
            updateRequestStatus(data.status, data.customerId, data.requestId)
        })

        socket.on('read-notification', async (data) => {
            await Notifications.update({
                read: true
            }, {
                where: {
                    resourceId: data.resourceId
                }
            })
        })
    })


}

const sendNewCustomerNotification = async (customerName, customerId) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = users[manager.dataValues.userId]
    await Notifications.create({
        resource: 'Customer',
        type: 'new_customer',
        resourceId:  customerId,
        recipient: manager.dataValues.userId
    })
    if (socketId) {
        ioInstance.to(socketId).emit('newCustomer', {
            name: customerName
        })
    }
}


const sendNewModelNotification = async (modelId) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = users[manager.dataValues.userId]
    await Notifications.create({
        resource: 'Model',
        type: 'new_model',
        resourceId:  modelId,
        recipient: manager.dataValues.userId
    })
    if (socketId) {
        ioInstance.to(socketId).emit('newModel', {
            modelId
        })
    }
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

module.exports = {
    initSocket,
    sendNewCustomerNotification,
    sendNewModelNotification
}