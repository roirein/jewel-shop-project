const Employee = require("../models/users/employee")
const User = require("../models/users/user")
const { sendPasswordMail } = require("../services/emails/emails")
const HttpError = require("../utils/HttpError")
const { genertaePassword, createNewEmployee, createNewUser } = require("../utils/user")
const {Op} = require('sequelize')

const addNewEmployee = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {email: req.body.email},
                    {phoneNumber: req.body.phoneNumber}
                ]
            }
        })
        if (user) {
            throw new HttpError('user-exist-error', 409)
        }
        const password = genertaePassword(); 
        const newUser = await createNewUser(req.body.firstName, req.body.lastName, req.body.email, password, req.body.phoneNumber, 4);
        const newEmployee = await createNewEmployee(newUser.userId, true, req.body.role)
        sendPasswordMail(`${req.body.firstName} ${req.body.lastName}`, req.body.email, password)
        res.status(201).send({
            employee: {
                id: newUser.dataValues.userId,
                name: `${newUser.dataValues.firstName} ${newUser.dataValues.lastName}`,
                role: newEmployee.dataValues.role,
                email: newUser.dataValues.email,
                phoneNumber: newUser.dataValues.phoneNumber,
                joined: new Date().toLocaleDateString('he-IL')
            }
        })
    } catch(e) {
        next(e)
    }
}

const getEmployees = async (req, res, next) => {
    try {
        const employeesData = await Employee.findAll({
            include: {
                model: User,
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }
        })

        const employees = employeesData.map((employee) => {
            return {
                id: employee.userId,
                name: `${employee.User.firstName} ${employee.User.lastName}`,
                role: employee.role,
                email: employee.User.email,
                phoneNumber: employee.User.phoneNumber,
                joined: new Date(employee.createdAt).toLocaleDateString('he-IL')
            }
        })
        res.status(200).send({employees})
    } catch (e) {
        next(e)
    }
}

const deleteEmployee = async (req, res, next) => {
    try {
        await User.destroy({
            where: {
                userId: req.params.employeeId
            }
        })
        res.status(200).send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    addNewEmployee,
    getEmployees,
    deleteEmployee
}