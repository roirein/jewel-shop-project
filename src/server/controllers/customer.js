const Customer = require("../models/users/customer")
const Request = require("../models/users/requests")
const User = require("../models/users/user")

const getNewCustomersRequests = async (req, res, next) => {
    try {
        const requestsData = await Request.findAll({
            include: {
                model: Customer,
                include: {
                    model: User,
                    attributes: ['firstName', 'lastName']
                }
            },
            order: [['updatedAt', 'DESC']]
        })
        const requests = requestsData.map((request) => {
            return {
                requestId: request.requestId,
                customerId: request.customerId,
                status: request.status,
                customerName: `${request.Customer.User.firstName} ${request.Customer.User.lastName}`
            }
        })
        res.status(200).send({requests})
    } catch(e) {
        next(e)
    }
}

const getCustomers = async (req, res, next) => {
    try {
        const custmoresData = await Customer.findAll({
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
                },
                {
                    model: Request,
                    where: {
                        status: 1
                    },
                    attributes: ['updatedAt']
                }
            ]
        })

        const customers = custmoresData.map((customer) => {
            return {
                id: customer.userId,
                name: `${customer.User.firstName} ${customer.User.lastName}`,
                email: customer.User.email,
                phoneNumber: customer.User.phoneNumber,
                businessName: customer.businessName,
                businessPhone: customer.businessPhoneNumber,
                joined: new Date(customer.Request.updatedAt).toLocaleDateString('he-IL')
            }
        })

        res.status(200).send({customers})
    } catch (e) {
        next (e)
    }
}

const getCustomerById = async (req, res, next) => {
    try {
        const customerData = await Customer.findOne({
            where: {
                userId: req.params.customerId
            },
            include: {
                model: User,
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }
        })
        const customerFullName = await User.getUserFullName(customerData.dataValues.userId)
        const customer = {
            id: customerData.dataValues.userId,
            name: customerFullName,
            businessName: customerData.dataValues.businessName,
            email: customerData.dataValues.User.dataValues.email,
            phoneNumber: customerData.dataValues.User.dataValues.phoneNumber,
            businessPhone: customerData.dataValues.businessPhoneNumber
        }

        res.status(200).send({customer})
    } catch(e) {
        next(e)
    }
}

const deleteCustomer = async (req, res, next) => {
    try {
        await User.destroy({
            where: {
                userId: req.params.customerId
            }
        })
        res.status(200).send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getNewCustomersRequests,
    getCustomerById,
    getCustomers,
    deleteCustomer
}