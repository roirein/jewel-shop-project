const express = require('express');
const { authorizeUser } = require('../middleware/authentication');
const { checkPermissions } = require('../middleware/authorization');
const { createNewModel, getModelsMetadata, getModelById, getModelImage, getModelComments, updateModel, updateModelPrice, getPriceData, getModelsForOrders, getModelByStatus } = require('../controllers/models');
const {modelUpload} = require('../services/images/multer.config')
const router = express.Router();

router.post('/model', authorizeUser, checkPermissions([2]), modelUpload.single('model'), createNewModel);

router.get('/metadata', authorizeUser, checkPermissions([1, 2]), getModelsMetadata);

router.get('/metatdata/:status', authorizeUser, checkPermissions([1, 2]), getModelByStatus)

router.get('/model/:modelId', authorizeUser, checkPermissions([1, 2, 3, 4, 5]), getModelById);

router.get('/image/:imagePath', authorizeUser, checkPermissions([1, 2, 3, 4, 5]), getModelImage);

router.get('/model/comments/:modelNumber', authorizeUser, checkPermissions([1,2]), getModelComments)

router.put('/model/:modelNumber', authorizeUser, checkPermissions([2]), modelUpload.single('model') ,updateModel)

router.post('/model/price/:modelNumber', authorizeUser, checkPermissions([1]), updateModelPrice)

router.get('/price/:modelNumber', authorizeUser, checkPermissions([1,2,5]), getPriceData)

router.get('/models', authorizeUser, checkPermissions([1, 5]), getModelsForOrders)

module.exports = router