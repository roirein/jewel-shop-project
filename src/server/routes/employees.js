const express = require('express');
const { addNewEmployee, getEmployees, deleteEmployee } = require('../controllers/employee');
const { checkPermissions } = require('../middleware/authorization');
const { authorizeUser } = require('../middleware/authentication');
const router = express.Router();

router.post('/addNewEmployee', authorizeUser, checkPermissions([1]), addNewEmployee);

router.get('/getEmployees', authorizeUser, checkPermissions([1]), getEmployees)

router.delete('/deleteEmployee/:employeeId', authorizeUser, checkPermissions([1]), deleteEmployee)

module.exports = router