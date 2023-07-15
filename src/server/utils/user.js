const Customer = require("../models/users/customer")
const Employee = require("../models/users/employee")
const Request = require("../models/users/requests")
const User = require("../models/users/user")
const bcrypt = require('bcrypt')

const createNewUser = async (firstName, lastName, email, password, phoneNumber, permissionLevel) => {
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        permissionLevel
    })

    return user
}

const createNewCustomer = async (userId, businessName, businessId, businessPhone = null) => {
    const customer = await Customer.create({
        userId,
        businessName,
        businessId,
        businessPhoneNumber: businessPhone
    })

    return customer
}

const createNewEmployee = async (userId, replacePassword, role) => {
    const employee = await Employee.create({
        userId,
        shouldReplacePassword: replacePassword,
        role
    })

    return employee
}


const genertaePassword = () => {
    const uppers = 'abcdefghijklmnopqrstuvwxyz';
    const lowers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '01234567890';
    const specials = '@#$*';

    const charsets = [uppers, lowers, numbers, specials];
    const shuffled = [...charsets];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    let password = ''

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < shuffled.length; j++) {
            const index = Math.floor(Math.random() * shuffled[j].length);
            const char = shuffled[j].charAt(index);
            password += char
        }
    }


    return password;

}

const generateVerificationCode = () => {
    const min = 100000
    const max = 999999
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode
}

const validateLoginCredentials = async (email, password) => {
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    let isPasswordMatch;
    if (user) {
        isPasswordMatch = await bcrypt.compare(password, user.dataValues.password)
    }
    if (!user || !isPasswordMatch) {
        return false
    }
    return true
}

const checkIfCustomerLoginValid = async (customerId) => {
     const request = await Request.findOne({
        where: {
            customerId
        }
     })
     return request.dataValues.status === 1
} 

const checkIfEmployeeLoginValid = async (employeeId) => {
    const employee = await Employee.findOne({
        where: {
            userId: employeeId
        }
    })
    console.log(employee)
    return employee.dataValues.shouldReplacePassword
}

const validateIsLoginValid = async (email) => {
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    let errMessage
    let res
    if (user.dataValues.permissionLevel === 5) {
         res = await checkIfCustomerLoginValid(user.dataValues.userId)
         if (!res) {
            errMessage = 'manager-approval-required'
         }
    } else {
        res = await checkIfEmployeeLoginValid(user.dataValues.userId)
        if (res) {
            errMessage = 'replace-password-required'
         }
    }
    return {
        res,
        errMessage
    }

}

module.exports = {
    createNewUser,
    createNewCustomer,
    createNewEmployee,
    genertaePassword,
    generateVerificationCode,
    validateLoginCredentials,
    validateIsLoginValid
}