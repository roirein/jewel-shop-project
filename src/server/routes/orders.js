const express = require('express');
const { designUpload } = require('../services/images/multer.config');
const { createNewOrder } = require('../controllers/orders');
const { authorizeUser } = require('../middleware/authentication');
const { checkPermissions } = require('../middleware/authorization');
const router = express.Router();

router.post('/newOrder',authorizeUser, checkPermissions([1, 5]), designUpload.single('design'), createNewOrder)

module.exports = router