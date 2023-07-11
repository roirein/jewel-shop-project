const express = require('express')
const { authorizeUser } = require('../middleware/authentication')
const { checkPermissions } = require('../middleware/authorization')
const { getNewCustomersRequests, getCustomerById, getCustomers, deleteCustomer } = require('../controllers/customer')
const router = express.Router()

router.get('/requests', authorizeUser, checkPermissions([1]), getNewCustomersRequests);

router.get('/customer/:customerId', authorizeUser, checkPermissions([1]), getCustomerById);

router.get('/customers', authorizeUser, checkPermissions([1]), getCustomers)

router.delete('/customer/:customerId', authorizeUser, checkPermissions([1]), deleteCustomer)

module.exports = router