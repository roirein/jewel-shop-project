const User = require("../models/users/user")
const HttpError = require("../utils/HttpError")

const checkPermissions = (allowdPermissions) => {
    return async (req, res, next) => {
        try {
            const user = await User.findOne({
                where: {
                    userId: req.userId
                }
            })
            if (!user) {
                throw new HttpError('forbidden', 403)
            }
            const isPermitted = allowdPermissions.find((permissionLevel) => user.dataValues.permissionLevel === permissionLevel)
            if (!isPermitted) {
                throw new HttpError('forbidden', 403)
            }
            req.permissionLevel = user.dataValues.permissionLevel
            next()
        } catch (e) {
            next(e)
        }
    }
}

module.exports = {
    checkPermissions
}