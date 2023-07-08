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

        socket.on('model-response', async (data) => {
            await JewelModel.update({
                status: data.status
            }, {
                where: {
                    modelNumber: data.modelNumber
                }
            })
            if (data.comments) {
                await Comments.create({
                    modelNumber: data.modelNumber,
                    content: data.comments
                })
            } else {
                await OrderTimeline.update({
                    designEnd: Date.now()
                }, {
                    where: {
                        orderId: data.orderId
                    }
                })
            }
        })

        socket.on('new-design', async (data) => {
            await sendOrderToDesign(data.orderId)
            await OrderTimeline.update({
                designStart: Date.now()
            }, {
                where: {
                    orderId: data.orderId
                }
            })
        })

        socket.on('customer-approval', async (data) => {
            await Order.update({
                price: data.price,
                status: 3
            }, {
                where: {
                    orderId: data.orderId
                }
            })

            if (data.casting) {
                await OrdersInCasting.create({orderId: data.orderId})
            }
        })

        socket.on('update-casting-status', async (data) => {
            await OrdersInCasting.update({
                castingStatus: data.castingStatus
            }, {
                where: {
                    orderId: data.orderId
                }
            })
            let status
            if (data.castingStatus === 2) {
                status = 4
                await OrderTimeline.update({
                    castingStart: Date.now()
                }, {
                    where: {
                        orderId: data.orderId
                    }
                })
            }
            if (data.castingStatus === 3) {
                status = 5
                await OrderTimeline.update({
                    castingEnd: Date.now()
                }, {
                    where: {
                        orderId: data.orderId
                    }
                })
            }
            await Order.update({
                status: status
            }, {
                where: {
                    orderId: data.orderId
                }
            })
        })

        socket.on('send-order-to-production', async (data) => {
            await Order.update({
                status: data.status,
            }, {
                where: {
                    orderId: data.orderId
                }
            })
            await OrdersInProduction.create({
                orderId: data.orderId
            })
            await OrderTimeline.update({
                productionStart: Date.now()
            }, {
                where: {
                    orderId: data.orderId
                }
            })
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

        socket.on('send-price-offer', async (data) => {
            console.log(data)
            await FixOrder.update({
                priceffer: data.price
            }, {
                where: {
                    orderId: data.orderId
                }
            })
        })

        socket.on('accept-price-offer', async (data) => {
            await Order.update({
                status: 3,
                price: data.price
            }, {
                where: {
                    orderId: data.orderId
                }
            })
        })
        
        socket.on('on-task-completion', async (data) => {
            console.log(data)
            const currentTask = await Task.findOne({
                where: {
                    taskId: data.taskId
                }
            })
            currentTask.isCompleted = true,
            await currentTask.save()
            if (currentTask.dataValues.nextTask) {
                const nextTask = await Task.findOne({
                    where: {
                        taskId: currentTask.dataValues.nextTask
                    }
                })
                nextTask.isBlocked = false
                await nextTask.save()
            } else {
                const order = await OrdersInProduction.findOne({
                    where: {
                        orderId: data.orderId
                    }
                })
                order.productionStatus = 6
                await order.save();
            }
        })

        socket.on('on-production-complete', async (data) => {
            console.log(data, 1)
            await Order.update({
                status: 7
            }, {
                where: {
                    orderId: data.orderId
                }
            })
            await OrderTimeline.update({
                productionEnd: Date.now()
            }, {
                where: {
                    orderId: data.orderId
                }
            })
        }),

        socket.on('update-customer', async (data) => {
            const order = await Order.findOne({
                where: {
                    orderId: data.orderId
                },
                include: OrderCustomer
            })
            order.status = 8
            await order.save();

            sendOrderReadyMail(order.dataValues['Order Customer'].dataValues.customerName, order.dataValues['Order Customer'].dataValues.email, order.orderId)
        })
        
        socket.on('complete-order', async (data) => {
            await Order.update({
                status: 9
            }, {
                where: {
                    orderId: data.orderId
                }
            })
            await OrderTimeline.update({
                delivered: Date.now()
            }, {
                where: {
                    orderId: data.orderId
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
    // await Notifications.create({
    //     resource: 'Customer',
    //     type: 'new_customer',
    //     resourceId:  customerId,
    //     recipient: manager.dataValues.userId
    // })
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

const sendOrderToDesign = async (orderId) => {
    const designManager = Employee.findOne({
        where: {
            role: 2
        }
    })

    await Order.update({
        status: 1,
    }, {
        where: {
            orderId
        }
    })

    //const socketId = users[designManager.dataValues.userId];
}

module.exports = {
    initSocket,
    sendNewCustomerNotification,
    sendNewModelNotification
}