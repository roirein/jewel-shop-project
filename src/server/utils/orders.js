const JewelModel = require("../models/models/jewelModel")
const ModelMetadata = require("../models/models/modelMetadata")
const Order = require("../models/orders/order")
const {Op} = require('sequelize')
const OrderCustomer = require("../models/orders/orderCustomer")
const JewelOrder = require("../models/orders/jewelOrder")

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
                include: {
                    model: ModelMetadata,
                    attributes: ['item', 'setting', 'sideStoneSize', 'mainStoneSize', 'modelNumber'],
                    include: {
                        model: JewelModel,
                        attributes: ['status']
                    }
                }
            },
            {
                model: OrderCustomer,
                attributes: ['customerName']
            }
        ],
        attributes: ['orderId', 'createdAt', 'deadline'],
    })

    const orders = ordersData.forEach((order) => {
        return {
            orderId: order.orderId,
            customerName: order['Order Customer'].customerName,
            created: order.createdAt,
            deadline: order.deadline,
            item: order['Jewel Order']['Model Metadata'].item,
            setting: order['Jewel Order']['Model Metadata'].setting,
            sideStoneSize: order['JewelOrder']['Model Metadata'].sideStoneSize,
            mainStoneSize: order['Jewel Order']['Model Metadata'].mainStoneSize,
            modelNumber: order['Jewel Order']['Model Metadata'].modelNumber,
            modelStatus: order['Jewel Order']['Model Metadata'].Model.status
        }
    })

    return orders
}


const getAllOrders = async () => {
    const ordersData = await Order.findAll({
        include: {
            model: OrderCustomer,
            attributes: ['customerName']
        }
    });
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


const getOrderByPermissionLevel = async (permissionLevel) => {
    let orders;
    switch (permissionLevel) {
        case 1: 
            orders = await getAllOrders();
            break
        case 2:
            orders = await getOrdersInDesign();
        default: 
            orders = []
    }
    return orders
}

module.exports = {
    getOrderByPermissionLevel
}