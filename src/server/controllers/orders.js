const ModelMetadata = require("../models/models/modelMetadata")
const JewelOrder = require("../models/orders/jewelOrder")
const Order = require("../models/orders/order")
const OrderCustomer = require("../models/orders/orderCustomer")
const { createModelMetadata } = require("../utils/models")
const { getOrderByPermissionLevel } = require("../utils/orders")
const path = require('path')

const createNewOrder = async (req, res, next) => {
    try {
        const newOrder = await Order.create({
            type: req.body.orderType, 
            customerId: req.userId, 
            status: 0, 
            deadline: new Date(req.body.deadline)
        })
        const customerData = await OrderCustomer.create({
            orderId: newOrder.orderId,
            customerId: req.userId,
            customerName: req.body.customerName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        })
        if (req.body.orderType ===  3) {

        } else {
            let modelMetadataId
            if (req.body.orderType === '1') {
                const metadata = await createModelMetadata(req.body.setting, req.body.sideStoneSize, req.body.mainStoneSize, req.body.item, newOrder.orderId, req.file.filename);
                modelMetadataId = metadata.metadataId
            }
            const newJewlOrder = await JewelOrder.create({
                orderId: newOrder.orderId,
                item: req.body.item,
                size: req.body.size,
                metal: req.body.metal,
                casting: req.body.casting,
                comments: req.body.comments,
                metadataId: modelMetadataId
            })  
        }
        // send notification 
        res.status(201).send({
            ...newOrder,
            customerName: customerData.customerName
        })
    } catch (e) {
        console.log(e)
        next(e)
    }
}


const getOrders = async (req, res, next) => {
    try {
        const orders = await getOrderByPermissionLevel(req.permissionLevel);
        res.status(200).send({orders})
    } catch(e) {
        next(e)
    }
}

const getOrderById = async (req, res, next) => {
    try {
        const orderData = await Order.findOne({
            where: {
                orderId: req.params.orderId
            },
            include: [
                {
                    model: JewelOrder,
                },
                {
                    model: OrderCustomer
                }
            ]
        })

        const metadata = await ModelMetadata.findOne({
            where: {
                metadataId: orderData['Jewel Order'].metadataId
            }
        })
        const order = {
            orderId: orderData.dataValues.orderId,
            item: metadata.dataValues.item,
            setting: metadata.dataValues.setting,
            sideStoneSize: metadata.dataValues.sideStoneSize,
            mainStoneSize: metadata.dataValues.mainStoneSize,
            design: metadata.dataValues.design,
            size: orderData.dataValues['Jewel Order'].size,
            metal: orderData.dataValues['Jewel Order'].metal,
            comments: orderData.dataValues['Jewel Order'].comments,
            casting: orderData.dataValues['Jewel Order'].casting,
            customerName: orderData.dataValues['Order Customer'].customerName,
            email: orderData.dataValues['Order Customer'].dataValues.email,
            phoneNumber: orderData.dataValues['Order Customer'].dataValues.phoneNumber,
            deadline: orderData.dataValues.deadline,
            status: orderData.dataValues.status
        }
        res.status(200).send({order})
    } catch (e) {
        console.log(e)
        next(e)
    }
}

const getOrderImage = async (req, res, next) => {
    try {
        const file = req.params.imagePath
        const image = path.join(__dirname, '../../server/images/designs', file);
        res.status(200).sendFile(image)
    } catch(e) {
        next (e)
    }
}


module.exports = {
    createNewOrder,
    getOrders,
    getOrderById,
    getOrderImage
}