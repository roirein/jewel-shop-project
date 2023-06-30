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

module.exports = {
    createNewUser,
    createNewCustomer,
    createNewEmployee,
    genertaePassword,
    generateVerificationCode
}