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

        const customer = {
            id: customerData.dataValues.userId,
            name: `${customerData.dataValues.User.dataValues.firstName} ${customerData.dataValues.User.dataValues.lastName}`,
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

    } catch (e) {
        next(e)
    }
}

module.exports = {
    getNewCustomersRequests,
    getCustomerById
}