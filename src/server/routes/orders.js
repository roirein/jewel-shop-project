const express = require('express');
const { designUpload } = require('../services/images/multer.config');
const { createNewOrder } = require('../controllers/orders');
const router = express.Router();

router.post('/newOrder', designUpload.single('design'), createNewOrder)

module.exports = router