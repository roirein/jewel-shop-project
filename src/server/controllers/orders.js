const ModelMetadata = require("../models/models/modelMetadata")
const FixOrder = require("../models/orders/fixOrder")
const JewelOrder = require("../models/orders/jewelOrder")
const Order = require("../models/orders/order")
const OrderCustomer = require("../models/orders/orderCustomer")
const OrdersInCasting = require("../models/orders/ordersInCasing")
const OrdersInProduction = require("../models/orders/ordersInProduction")
const Task = require("../models/tasks/task")
const Employee = require("../models/users/employee")
const User = require("../models/users/user")
const { createModelMetadata } = require("../utils/models")
const { getOrderByPermissionLevel, getOrdersInCasting, createTaskForOrder, getOrdersInProduction, getOrdersInDesignForManager } = require("../utils/orders")
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
        if (req.body.orderType ===  '3') {
            await FixOrder.create({
                orderId: newOrder.orderId,
                item: req.body.item,
                description: req.body.description  
            })
        } else {
            let modelMetadataId
            if (req.body.orderType === '1') {
                const metadata = await createModelMetadata(req.body.setting, req.body.sideStoneSize, req.body.mainStoneSize, req.body.item, newOrder.orderId, req.file.filename);
                modelMetadataId = metadata.metadataId
            }
            if (req.body.orderType === '2') {
                newOrder.price === req.body.price
                newOrder.status = 3
                await newOrder.save()
                const meta = await ModelMetadata.findOne({
                    where: {
                        modelNumber: req.body.modelNumber
                    }
                })
                console.log(req.body.modelNumber)
                console.log(meta)
                metadataId = meta.dataValues.modelNumber
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
        const orders = await getOrderByPermissionLevel(req.permissionLevel, req.userId);
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
                    model: FixOrder
                },
                {
                    model: OrderCustomer
                }, 
                {
                    model: OrdersInCasting
                },
                {
                    model: OrdersInProduction
                },
                {
                    model: Task
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
            status: orderData.dataValues.status,
            modelId: metadata.dataValues.modelNumber || null,
            price: orderData.dataValues.price || null,
            castingStatus: orderData.dataValues['Orders in Casting'] ? orderData.dataValues['Orders in Casting'].dataValues.castingStatus : null,
            productionStatus: orderData.dataValues['Orders in Production'] ? orderData.dataValues['Orders in Production'].dataValues.productionStatus : null,
            tasks: orderData.dataValues['Tasks'] ? orderData.dataValues['Tasks'].map(task => task.dataValues) : null
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

const getOrderByStatus = async (req, res, next) => {
    try {
        let orders = []
        if (req.params.type === 'design') {
            orders = await getOrdersInDesignForManager()
        }
        if (req.params.type === 'casting') {
            orders = await getOrdersInCasting();
        }
        if (req.params.type === 'production') {
            orders = await getOrdersInProduction();
        }
        res.status(200).send({orders})
    }
    catch(e) {
        next(e)
    }
}


const setTasksForOrder = async (req, res, next) => {
    try {
        const sortedTasksData = req.body.tasks.sort((a,b) => a.index - b.index);
        const tasks = [];
        for (const taskData of sortedTasksData) {
            const task = await createTaskForOrder(taskData, req.params.orderId)
            tasks.push(task)
        }

        for (let i = 1; i < tasks.length; i++) {
            tasks[i-1].nextTask = tasks[i].taskId
            await tasks[i-1].save()
        }

        tasks[0].blocked = false
        await tasks[0].save();

        res.status(201).send({tasks})
    } catch (e) {
        next (e)
    }
}

const getAllOrdersTaks = async (req, res, next) => {
    try {
        const tasksData = await Task.findAll({
            where: {
                orderId: req.params.orderId
            },
            include: {
                model: Employee,
                include: {
                    model: User,
                    attributes: ['firstName', 'lastName']
                }
            }
        })
    
        const tasks = tasksData.map((task) => {
            return {
                taskId: task.taskId,
                description: task.description,
                employeeName: `${task.Employee.User.firstName} ${task.Employee.User.lastName}`
            }
        })

        res.status(200).send({tasks})
    } catch (e) {
        next(e)
    }
}

const getTaskByEmployeeAndOrder = async (req, res, next) => {
    try{
        const task = await Task.findOne({
            where: {
                taskId: req.params.taskId,
                orderId: req.params.orderId
            }
        })
    } catch (e) {
        next (e)
    }
}

module.exports = {
    createNewOrder,
    getOrders,
    getOrderById,
    getOrderImage,
    getOrderByStatus,
    setTasksForOrder,
    getAllOrdersTaks,
    getTaskByEmployeeAndOrder
}