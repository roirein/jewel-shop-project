const express = require('express');
const { addNewEmployee, getEmployees, deleteEmployee, getEmployeesByRole } = require('../controllers/employee');
const { checkPermissions } = require('../middleware/authorization');
const { authorizeUser } = require('../middleware/authentication');
const router = express.Router();

router.post('/employee', authorizeUser, checkPermissions([1]), addNewEmployee);

router.get('/employees', authorizeUser, checkPermissions([1]), getEmployees)

router.delete('/employee/:employeeId', authorizeUser, checkPermissions([1]), deleteEmployee)

router.get('/employees-role', authorizeUser, checkPermissions([1,3]), getEmployeesByRole)

module.exports = router