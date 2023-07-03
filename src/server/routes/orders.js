const express = require('express');
const { designUpload } = require('../services/images/multer.config');
const { createNewOrder, getOrders, getOrderById, getOrderImage, getOrderByStatus } = require('../controllers/orders');
const { authorizeUser } = require('../middleware/authentication');
const { checkPermissions } = require('../middleware/authorization');
const router = express.Router();

router.post('/newOrder',authorizeUser, checkPermissions([1, 5]), designUpload.single('design'), createNewOrder)

router.get('/orders', authorizeUser, checkPermissions([1,2,3,4,5]), getOrders)

router.get('/order/:orderId', authorizeUser, getOrderById);

router.get('/image/:imagePath', authorizeUser, getOrderImage)

router.get('/status/:type', authorizeUser, checkPermissions([1]), getOrderByStatus)

module.exports = router