const dayjs = require("dayjs")
const ModelMetadata = require("../models/models/modelMetadata")
const FixOrder = require("../models/orders/fixOrder")
const JewelOrder = require("../models/orders/jewelOrder")
const Order = require("../models/orders/order")
const OrderCustomer = require("../models/orders/orderCustomer")
const OrderTimeline = require("../models/orders/orderTimeline")
const OrdersInCasting = require("../models/orders/ordersInCasing")
const OrdersInProduction = require("../models/orders/ordersInProduction")
const Task = require("../models/tasks/task")
const Employee = require("../models/users/employee")
const User = require("../models/users/user")
const { createModelMetadata } = require("../utils/models")
const { getOrderByPermissionLevel, getOrdersInCasting, createTaskForOrder, getOrdersInProduction, getOrdersInDesignForManager, getJewelOrderData, getFixOrderData } = require("../utils/orders")
const path = require('path')

const createNewOrder = async (req, res, next) => {
    const user = await User.getUserByEmail(req.body.email)
    try {
        const newOrder = await Order.create({
            type: req.body.orderType, 
            customerId: user.userId, 
            status: 0, 
            deadline: dayjs(req.body.deadline),
            created: dayjs()
        })
        const customerData = await OrderCustomer.create({
            orderId: newOrder.orderId,
            customerId: user.userId,
            customerName: req.body.customerName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        })
        if (req.body.orderType ===  '3' || req.body.orderType === 3) {
            await FixOrder.create({
                orderId: newOrder.orderId,
                item: req.body.item,
                description: req.body.description  
            })
        } else {
            console.log(req.body.orderType, req.body.orderType === 2)
            let modelMetadataId
            if (req.body.orderType === '1') {
                const metadata = await createModelMetadata(req.body.setting, req.body.sideStoneSize, req.body.mainStoneSize, req.body.item, newOrder.orderId, req.file.filename);
                modelMetadataId = metadata.metadataId
            }
            if (req.body.orderType === '2' || req.body.orderType === 2) {
                newOrder.price = req.body.price
                newOrder.status = 3
                await newOrder.save()
                console.log(req.body.modelNumber)
                const meta = await ModelMetadata.findOne({
                    where: {
                        modelNumber: req.body.modelNumber
                    }
                })
                modelMetadataId = meta.dataValues.metadataId
                if (req.body.casting || req.body.casting === 'false') {
                    await OrdersInCasting.create({
                        orderId: newOrder.orderId  
                    })
                }
            }
            let castingValue
            if (!req.body.casting || req.body.casting === 'undefined') {
                castingValue = false
            } else {
                castingValue = true
            }
            const newJewlOrder = await JewelOrder.create({
                orderId: newOrder.orderId,
                item: req.body.item,
                size: req.body.size,
                metal: req.body.metal,
                casting: castingValue,
                comments: req.body.comments,
                metadataId: modelMetadataId
            })
        }
        await OrderTimeline.create({orderId: newOrder.orderId, createdAt: dayjs()})
        res.status(201).send({
            ...newOrder.dataValues,
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
            include: OrderCustomer
        })

        let order = {
            orderId: orderData.dataValues.orderId,
            customerName: orderData.dataValues['Order Customer'].customerName,
            email: orderData.dataValues['Order Customer'].dataValues.email,
            phoneNumber: orderData.dataValues['Order Customer'].dataValues.phoneNumber,
            deadline: orderData.dataValues.deadline,
            status: orderData.dataValues.status,
            price: orderData.dataValues.price || null,
            type: orderData.dataValues.type
        }

        let additionalData

        if (order.type === 3) {
            additionalData = await getFixOrderData(order.orderId)
        } else {
            additionalData = await getJewelOrderData(order.orderId, order.type, order.status, req.permissionLevel)
        }

        order = {
            ...order,
            ...additionalData
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


        tasks[0].isBlocked = false
        await tasks[0].save();

        res.status(201).send({tasks})
    } catch (e) {
        console.log(e)
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
        console.log(tasksData)
        const tasks = tasksData.map((task) => {
            return {
                taskId: task.taskId,
                description: task.description,
                employeeName: `${task.Employee.User.firstName} ${task.Employee.User.lastName}`,
                isCompleted: task.isCompleted,
                position: task.position,
            }
        })

        res.status(200).send({tasks})
    } catch (e) {
        next(e)
    }
}

const getTaskByEmployeeAndOrder = async (req, res, next) => {
    try{
        const taskData = await Task.findOne({
            where: {
                employeeId: req.params.employeeId,
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
        const task = {
            taskId: taskData.dataValues.taskId,
            description: taskData.dataValues.description,
            employeeName: `${taskData.dataValues.Employee.dataValues.User.dataValues.firstName} ${taskData.dataValues.Employee.dataValues.User.dataValues.lastName}`,
            isCompleted: taskData.dataValues.isCompleted,
            position: taskData.dataValues.position,
            isBlocked: taskData.isBlocked
        } 
        res.status(200).send({task})
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