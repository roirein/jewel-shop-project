const JewelModel = require("../models/models/jewelModel")
const ModelMetadata = require("../models/models/modelMetadata")
const Order = require("../models/orders/order")
const {Op} = require('sequelize')
const OrderCustomer = require("../models/orders/orderCustomer")
const JewelOrder = require("../models/orders/jewelOrder");
const OrdersInCasting = require('../models/orders/ordersInCasing')
const OrdersInProduction = require('../models/orders/ordersInProduction')
const Task = require("../models/tasks/task")
 
const getOrdersInDesign = async () => {
    const ordersData = await Order.findAll({
        where: {
            status: {
                [Op.or]: [1, 2]
            },
            type: 1
        },
        include: [
            {
                model: JewelOrder,
            },
            {
                model: OrderCustomer,
                attributes: ['customerName']
            }
        ],
        attributes: ['orderId', 'createdAt', 'deadline'],
    })

    let metadata = await ModelMetadata.findAll({
        include: {
            model: JewelModel,
            attributes: ['status']
        },
    })

    metadata.filter((met) => met.orderId !== null)

    const orders = ordersData.map((order) => {

        const orderModel = metadata.find((model) => model.orderId === order.orderId)

        return {
            orderId: order.orderId,
            customerName: order['Order Customer'].customerName,
            created: order.createdAt,
            deadline: order.deadline,
            item: orderModel.dataValues.item,
            setting: orderModel.setting,
            sideStoneSize: orderModel.sideStoneSize,
            mainStoneSize: orderModel.mainStoneSize,
        }
    })

    return orders
}


const getAllOrders = async (permissionLevel, userId) => {
    
    let ordersData = await Order.findAll({
        include: {
            model: OrderCustomer,
            attributes: ['customerName']
        }, 
    });

    if (permissionLevel === 5) {
        ordersData.filter((order) => {
            return order.customerId === userId
        })
    }
    const orders = ordersData.map((order) => {
        return {
            orderId: order.orderId,
            type: order.type,
            customerName: order['Order Customer'].customerName,
            created: new Date(order.createdAt).toLocaleDateString('he-IL'),
            deadline: new Date(order.deadline).toLocaleDateString('he-IL'),
            status: order.status
        }
    })
    return orders
}


const getOrderByPermissionLevel = async (permissionLevel, userId) => {
    let orders;
    switch (permissionLevel) {
        case 1: 
            orders = await getAllOrders(permissionLevel, userId);
            break
        case 2:
            orders = await getOrdersInDesign();
            break;
        case 3: 
            orders = await getOrdersInProduction();
            break;
        case 5: 
            orders = await getAllOrders(permissionLevel, userId)
            break;
        default: 
            orders = []
    }
    return orders
}

const getOrdersInCasting = async () => {
    const orderData = await Order.findAll({
        where: {
            status: {
                [Op.or]: [3, 4, 5]
            },
            type: {
                [Op.or]: [1, 2]
            }
        },
        include: [OrderCustomer, OrdersInCasting]
    })

    const orders = orderData.map((order) => {
        return {
            orderId: order.orderId,
            type: order.type,
            customerName: order['Order Customer'].customerName,
            deadline: new Date(order.deadline).toLocaleDateString('he-IL'),
            castingStatus: order['Orders in Casting'].castingStatus
        }
    })

    return orders
}

const getOrdersInProduction= async () => {
    const orderData = await Order.findAll({
        where: {
            status: 6
        },
        include: [OrderCustomer, OrdersInProduction]
    })

    const orders = orderData.map((order) => {
        return {
            orderId: order.orderId,
            type: order.type,
            customerName: order['Order Customer'].customerName,
            deadline: new Date(order.deadline).toLocaleDateString('he-IL'),
            productionStatus: order['Orders in Production'] ? order['Orders in Production'].productionStatus : null
        }
    })

    console.log(orders)

    return orders
}


const createTaskForOrder = async (taskData, orderId) => {
    console.log(taskData, orderId)
    const task = await Task.create({
        orderId: orderId,
        employeeId: taskData.employeeId,
        description: taskData.description,
        position: taskData.position
    })

    return task
}


const getOrdersInDesignForManager = async () => {
    const ordersData = await Order.findAll({
        where: {
            status: {
                [Op.or]: [1, 2]
            },
            type: 1
        },
        include: [
            {
                model: JewelOrder,
            },
            {
                model: OrderCustomer,
                attributes: ['customerName']
            }
        ],
        attributes: ['orderId', 'createdAt', 'deadline'],
    })

    let metadata = await ModelMetadata.findAll({
        include: {
            model: JewelModel,
            attributes: ['status']
        },
    })

    metadata.filter((met) => met.orderId !== null)

    const orders = ordersData.map((order) => {

        const orderModel = metadata.find((model) => model.orderId === order.orderId)

        return {
            orderId: order.orderId,
            customerName: order['Order Customer'].customerName,
            deadline: order.deadline,
            item: orderModel.dataValues.item,
            modelNumber: orderModel.dataValues.modelNumber || null
        }
    })

    return orders
}

module.exports = {
    getOrderByPermissionLevel,
    getOrdersInCasting,
    createTaskForOrder,
    getOrdersInProduction,
    getOrdersInDesignForManager
}