const express = require('express');
const { authorizeUser } = require('../middleware/authentication');
const { checkPermissions } = require('../middleware/authorization');
const { createNewModel, getModelsMetadata, getModelById, getModelImage, getModelComments, updateModel, updateModelPrice, getPriceData } = require('../controllers/models');
const {modelUpload} = require('../services/images/multer.config')
const router = express.Router();

router.post('/newModel', authorizeUser, checkPermissions([2]), modelUpload.single('model'), createNewModel);

router.get('/metadata', authorizeUser, checkPermissions([1, 2]), getModelsMetadata);

router.get('/model/:modelId', authorizeUser, checkPermissions([1, 2, 5]), getModelById);

router.get('/image/:imagePath', authorizeUser, checkPermissions([1, 2, 5]), getModelImage);

router.get('/comments/:modelNumber', authorizeUser, checkPermissions([1,2]), getModelComments)

router.put('/model/:modelNumber', authorizeUser, checkPermissions([2]), modelUpload.single('model') ,updateModel)

router.post('/price/:modelNumber', authorizeUser, checkPermissions([1]), updateModelPrice)

router.get('/price/:modelNumber', authorizeUser, checkPermissions([1,2,5]), getPriceData)

module.exports = router