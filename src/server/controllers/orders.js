const JewelOrder = require("../models/orders/jewelOrder")
const Order = require("../models/orders/order")
const OrderCustomer = require("../models/orders/orderCustomer")
const { createModelMetadata } = require("../utils/models")

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
        console.log(req.file)
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

module.exports = {
    createNewOrder
}