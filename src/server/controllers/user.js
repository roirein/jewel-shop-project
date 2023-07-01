const Customer = require("../models/users/customer");
const User = require("../models/users/user")
const HttpError = require("../utils/HttpError")
const bcrypt = require('bcrypt');
const {Op} = require('sequelize');
const { createNewUser, createNewCustomer, generateVerificationCode } = require("../utils/user");
const Request = require("../models/users/requests");
const { sendNewCustomerNotification } = require("../services/sockets/socket");
const { sendVerificationCodeMail } = require("../services/emails/emails");
const Codes = require("../models/users/codes");
const Employee = require("../models/users/employee");

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
            throw new HttpError('user-exist-error', 409)
        }

        const newUser = await createNewUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.phoneNumber, 5);
        await createNewCustomer(newUser.userId, req.body.businessName, req.body.businessId, req.body.businessPhoneNumber);
        await Request.create({customerId: newUser.userId});
        await sendNewCustomerNotification(`${req.body.firstName} ${req.body.lastName}`, newUser.userId)
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
        if (user.permissionLevel === 5) {
            const request = await Request.findOne({
                where: {
                    customerId: user.dataValues.userId
                }
            })
            if (request.dataValues.status !== 1) {
                throw new HttpError('user-unapproved', 403)
            }
        } else {
            const employee = await Employee.findOne({
                where: {
                    userId: user.dataValues.userId
                }
            })
            if (employee.dataValues.shouldReplacePassword) {
                throw new HttpError('replace-password', 403)
            }
        }
        res.status(200).send({
            user: {
                id: user.dataValues.userId,
                token,
                username: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
                permissionLevel: user.dataValues.permissionLevel,
                email: user.dataValues.email,
                phoneNumber: user.dataValues.phoneNumber
            }
        })
    } catch (e) {
        next(e)
    }
}

const logoutUser = async (req, res, next) => {
    try {
        await User.update({
            token: null
        }, {
            where: {
                userId: req.body.userId
            }
        })

        res.status(200).send()
    } catch(e) {
        next(e)
    }
}

const sendResetPasswordCode = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            throw new HttpError('No user found', 404)
        }
        const code = generateVerificationCode();
        await Codes.create({
            userId: user.dataValues.userId,
            code,
            expiryTime: new Date(Date.now() + 300000)
        })
        sendVerificationCodeMail(`${user.dataValues.firstName} ${user.dataValues.lastName}`, user.dataValues.email, code);
        res.status(201).send()
    } catch (e) {
        next(e)
    }
}

const verifyCode = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            },
            include: Codes
        })
        const code = user.Code
        if (!code) {
            throw new HttpError('no-code-error', 400)
        }
        if (req.body.code !== code.dataValues.code) {
            throw new HttpError('invalid-code', 400)
        }
        if (Date.now() >= code.dataValues.expiryTime.getTime()) {
            throw new HttpError('token-expired', 400)
        }
        res.status(200).send();
    } catch (e) {
        next(e)
    }
}

const updatePassword = async (req, res, next) => {
    try {
        if (req.body.password !== req.body.confirmPassword) {
            throw new HttpError('password-mismatch', 400)
        }
        await User.update({
            password: req.body.password
        }, {
            where: {
                email: req.body.email
            }
        })
        const employee = await Employee.findOne({
            include: {
                model: User,
                where: {
                    email: req.body.email
                }
            }
        })
        if (employee) {
            employee.shouldReplacePassword = false
            await employee.save()
        }
        res.status(200).send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    registerNewUser,
    loginUser,
    logoutUser,
    sendResetPasswordCode,
    verifyCode,
    updatePassword
}

