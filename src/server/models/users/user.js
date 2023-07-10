const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')
const bcrypt = require('bcrypt')

class User extends Model{
    static async getUserFullName(userId) {
        const user = await User.findByPk(userId, {
            attributes: ['firstName', 'lastName']
        })
        return `${user.dataValues.firstName} ${user.dataValues.lastName}`
    }

    static validatePassword(password) {
        const passwordLength = password.length
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$*])[A-Za-z\d@#$*]{8,}$/
        const isValid = passwordLength >= 8 && passwordRegex.test(password);
        return isValid
    }

    static async generateAccessToken(userId) {
        const user = await User.findByPk(userId);
        const accessToken = jwt.sign({_id: userId, permissions: user.dataValues.permissionLevel}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
        return accessToken
    }

    static async generateRefreshToken(userId, rememberMe) {
        const user = await User.findByPk(userId);
        const refreshToken = jwt.sign({_id: userId, permissions: user.dataValues.permissionLevel}, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn: rememberMe ? '3h' : '1y'})
        user.token = refreshToken
        await user.save();
        return refreshToken
    }


    static async getUserByEmail(email) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        return user.dataValues
    }
}

User.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{10}$/
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    permissionLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    sequelize,
    modelName: 'Users'
})

User.beforeCreate(async (user) => {
    user.userId = uuidv4()
    if (User.validatePassword(user.password)) {
        user.password = await bcrypt.hash(user.password, Number(process.env.HASH_SALT))
    } else {
        throw new Error('Invalid Password');
    }
})

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        if (User.validatePassword(user.password)) {
            user.password = await bcrypt.hash(user.password, Number(process.env.HASH_SALT))
        } else {
            throw new Error('Invalid Password');
        }
    }
})


module.exports = User

