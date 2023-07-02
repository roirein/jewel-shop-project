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
                // include: {
                //     model: ModelMetadata,
                //     attributes: ['item', 'setting', 'sideStoneSize', 'mainStoneSize', 'modelNumber'],
                //     include: {
                //         model: JewelModel,
                //         attributes: ['status']
                //     }
                // }
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

    console.log(orders)

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
        case 5: 
            orders = await getAllOrders(permissionLevel, userId)
            break;
        default: 
            orders = []
    }
    return orders
}

module.exports = {
    getOrderByPermissionLevel
}