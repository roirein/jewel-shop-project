const jwt = require('jsonwebtoken');
const User = require('../models/users/user');
const HttpError = require('../utils/HttpError')

const authorizeUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        const userId = decodedToken._id
        const user = await User.findOne({
            where: {
                userId
            }
        })
        if (!user) {
            throw new HttpError('not authorized', 401)
        }
        req.userId = userId
        next()
    } catch(e) {
        if (e.name === 'TokenExpiredError') {
            res.status(401).send('token-expired')
        } else {
            next(e)   
        }

    }
}

module.exports = {
    authorizeUser
}