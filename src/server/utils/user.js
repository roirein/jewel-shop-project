const Customer = require("../models/users/customer")
const Employee = require("../models/users/employee")
const User = require("../models/users/user")

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

const createNewEmployee = async (userId, replacePassword, field = null) => {
    const employee = await Employee.create({
        userId,
        shouldReplacePassword: replacePassword,
        field
    })

    return employee
}

module.exports = {
    createNewUser,
    createNewCustomer,
    createNewEmployee
}