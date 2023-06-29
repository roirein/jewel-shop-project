const express = require('express')
const { authorizeUser } = require('../middleware/authentication')
const { checkPermissions } = require('../middleware/authorization')
const { getNewCustomersRequests, getCustomerById } = require('../controllers/customer')
const router = express.Router()

router.get('/getRequests', authorizeUser, checkPermissions([1]), getNewCustomersRequests);

router.get('/getCustomerById/:customerId', authorizeUser, checkPermissions([1]), getCustomerById)

module.exports = router