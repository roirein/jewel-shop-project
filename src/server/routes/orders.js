const express = require('express');
const { designUpload } = require('../services/images/multer.config');
const { createNewOrder, getOrders, getOrderById, getOrderImage, getOrderByStatus, setTasksForOrder, getAllOrdersTaks, getTaskByEmployeeAndOrder } = require('../controllers/orders');
const { authorizeUser } = require('../middleware/authentication');
const { checkPermissions } = require('../middleware/authorization');
const router = express.Router();

router.post('/order',authorizeUser, checkPermissions([1, 5]), designUpload.single('design'), createNewOrder)

router.get('/orders', authorizeUser, checkPermissions([1,2,3,4,5]), getOrders)

router.get('/order/:orderId', authorizeUser, checkPermissions([1,2,3,4,5]), getOrderById);

router.get('/image/:imagePath', authorizeUser, getOrderImage)

router.get('/status/:type', authorizeUser, checkPermissions([1]), getOrderByStatus)

router.post('/tasks/:orderId', authorizeUser, checkPermissions([3]), setTasksForOrder)

router.get('/tasks/:orderId', authorizeUser, checkPermissions([1, 3]), getAllOrdersTaks)

router.get('/task/:employeeId/:orderId', authorizeUser, checkPermissions([4]), getTaskByEmployeeAndOrder)

module.exports = router