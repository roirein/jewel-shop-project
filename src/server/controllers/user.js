const User = require("../models/users/user")
const HttpError = require("../utils/HttpError")
const bcrypt = require('bcrypt');

const registerNewUser = async (req, res, next) => {
    try {

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

