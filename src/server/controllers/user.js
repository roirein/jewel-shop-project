const Customer = require("../models/users/customer");
const User = require("../models/users/user")
const HttpError = require("../utils/HttpError")
const bcrypt = require('bcrypt');
const {Op} = require('sequelize');
const { createNewUser, createNewCustomer } = require("../utils/user");
const Request = require("../models/users/requests");
const { sendNewCustomerNotification } = require("../services/sockets/socket");

const registerNewUser = async (req, res, next) => {
    try {
        if (req.body.password !== req.body.confirmPassword) {
            throw new HttpError('password-confirm-error', 400);
        }
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {email: req.body.email},
                    {phoneNumber: req.body.phoneNumber}
                ]
            }
        })
        const customer = await Customer.findOne({
            where: {
                businessId: req.body.businessId
            }
        })

        if (user || customer) {
            throw new Error('user-exist-error', 409)
        }

        const newUser = await createNewUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.phoneNumber, 5);
        await createNewCustomer(newUser.userId, req.body.businessName, req.body.businessId, req.body.businessPhoneNumber);
        await Request.create({customerId: newUser.userId});
        await sendNewCustomerNotification(`${req.body.firstName} ${req.body.lastName}`)
        res.status(201).send()
    } catch (e) {
        next(e)
    }
}

const loginUser = async (req, res ,next) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        let isPasswordMatch;
        if (user) {
            isPasswordMatch = await bcrypt.compare(req.body.password, user.dataValues.password)
        }
        if (!user || !isPasswordMatch) {
            throw new HttpError('authentication error', 401);
        }
        const token = await User.generateAuthToken(user.dataValues.userId)
        user.token = token
        await user.save()
        res.status(200).send({
            id: user.dataValues.userId,
            token,
            username: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
            permissionLevel: user.dataValues.permissionLevel
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    registerNewUser,
    loginUser
}

