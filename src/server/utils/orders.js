const JewelModel = require("../models/models/jewelModel")
const ModelMetadata = require("../models/models/modelMetadata")
const ModelPrice = require('../models/models/modelPrice')
const Order = require("../models/orders/order")
const {Op} = require('sequelize')
const OrderCustomer = require("../models/orders/orderCustomer")
const JewelOrder = require("../models/orders/jewelOrder");
const OrdersInCasting = require('../models/orders/ordersInCasing')
const OrdersInProduction = require('../models/orders/ordersInProduction')
const Task = require("../models/tasks/task")
const FixOrder = require("../models/orders/fixOrder")
 
const getOrdersInDesign = async () => {
    const ordersData = await Order.findAll({
        where: {
            status: {
                [Op.gte]: 1
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
        attributes: ['orderId', 'created', 'deadline'],
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

        let status = null;
        if (orderModel['Jewel Model']) {
            status = orderModel['Jewel Model'].status
        }

        return {
            orderId: order.orderId,
            customerName: order['Order Customer'].customerName,
            created: order.created,
            deadline: order.deadline,
            item: orderModel.dataValues.item,
            setting: orderModel.setting,
            sideStoneSize: orderModel.sideStoneSize,
            mainStoneSize: orderModel.mainStoneSize,
            modelNumber: orderModel.modelNumber,
            modelStatus: status,
            modelMetadataId: orderModel.metadataId
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
            price: order.price,
            customerName: order['Order Customer'].customerName,
            created: new Date(order.created).toLocaleDateString('he-IL'),
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
                [Op.or]: [6, 7]
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
                [Op.or]: [2, 3]
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
        attributes: ['orderId', 'created', 'deadline'],
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
        console.log(orderModel?.dataValues['Jewel Model'].dataValues.status)

        return {
            orderId: order.orderId,
            customerName: order['Order Customer'].customerName,
            deadline: order.deadline,
            item: orderModel.dataValues.item,
            modelNumber: orderModel?.dataValues.modelNumber || null,
            modelStatus: orderModel?.dataValues['Jewel Model'].dataValues.status
        }
    })

    return orders
}

const getModelDataDForOrder = async (modelMetadataId, orderId, orderType, orderStatus, permissionLevel) => {
    const modelData = await ModelMetadata.findOne({
        where: {
            metadataId: modelMetadataId,
        }
    })


    let model = {
        setting: modelData.dataValues.setting,
        sideStoneSize: modelData.dataValues.sideStoneSize,
        mainStoneSize: modelData.mainStoneSize,
        design: modelData.dataValues.design
    }

    if (orderType === 1) {
        if (orderStatus >= 2) {
            const orderModelData = await JewelModel.findOne({
                where: {
                    status: 2,
                    metadataId: modelData.dataValues.metadataId
                }
            })

            if (orderModelData) {
                model = {
                    ...model,
                    title: orderModelData.dataValues.title,
                    description: orderModelData.dataValues.description,
                    image: orderModelData.dataValues.image
                }

                const priceData = await ModelPrice.findOne({
                    where: {
                        modelNumber: orderModelData.dataValues.modelNumber
                    }
                })

                if (priceData) {
                    model = {
                        ...model,
                        materials: priceData.dataValues.materials,
                        priceWithMaterials: priceData.dataValues.priceWithMaterials,
                        priceWithoutMaterials: priceData.dataValues.priceWithoutMaterials
            
                    }
                }
            }
        }
            
    }
    if (orderType === 2) {
        const orderModelData = await JewelModel.findOne({
            where: {
                status: 4,
                metadataId: modelData.dataValues.metadataId
            }
        })
        model = {
            title: orderModelData.dataValues.title,
            description: orderModelData.dataValues.description,
            image: orderModelData.dataValues.image
        }
    }

    return model
}

const getJewelOrderData = async (orderId, orderType, orderStatus, permissionLevel) => {
    const jewelOrderData = await JewelOrder.findOne({
        where: {
            orderId
        }
    })

    let jewelOrder = {
        item: jewelOrderData.dataValues.item,
        metal: jewelOrderData.dataValues.metal,
        size: jewelOrderData.dataValues.size,
        comments: jewelOrderData.dataValues.comments,
        casting: jewelOrderData.dataValues.casting
    }

    const modelData = await getModelDataDForOrder(jewelOrderData.dataValues.metadataId, orderId, orderType, orderStatus, permissionLevel)

    jewelOrder = {
        ...jewelOrder,
        ...modelData
    }

    return jewelOrder
}

const getFixOrderData = async (orderId) => {
    const fixOrderData = await FixOrder.findOne({
        where: {
            orderId
        }
    })
    return {
        item: fixOrderData.dataValues.item,
        description: fixOrderData.dataValues.description,
        priceOffer: fixOrderData.dataValues.priceffer ? fixOrderData.dataValues.priceffer : null
    }
}


module.exports = {
    getOrderByPermissionLevel,
    getOrdersInCasting,
    createTaskForOrder,
    getOrdersInProduction,
    getOrdersInDesignForManager,
    getJewelOrderData,
    getFixOrderData
}