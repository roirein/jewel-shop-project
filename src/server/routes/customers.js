const express = require('express')
const { authorizeUser } = require('../middleware/authentication')
const { checkPermissions } = require('../middleware/authorization')
const { getNewCustomersRequests, getCustomerById, getCustomers, deleteCustomer } = require('../controllers/customer')
const router = express.Router()

router.get('/getRequests', authorizeUser, checkPermissions([1]), getNewCustomersRequests);

router.get('/getCustomerById/:customerId', authorizeUser, checkPermissions([1]), getCustomerById);

router.get('/getCustomers', authorizeUser, checkPermissions([1]), getCustomers)

router.delete('/deleteCustomer/:customerId', authorizeUser, checkPermissions([1]), deleteCustomer)

module.exports = router