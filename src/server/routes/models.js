const express = require('express');
const { authorizeUser } = require('../middleware/authentication');
const { checkPermissions } = require('../middleware/authorization');
const { createNewModel, getModelsMetadata, getModelById, getModelImage } = require('../controllers/models');
const {modelUpload} = require('../services/images/multer.config')
const router = express.Router();

router.post('/newModel', authorizeUser, checkPermissions([2]), modelUpload.single('model'), createNewModel);

router.get('/metadata', authorizeUser, checkPermissions([1, 2]), getModelsMetadata);

router.get('/model/:modelId', authorizeUser, checkPermissions([1, 2]), getModelById);

router.get('/image/:imagePath', authorizeUser, checkPermissions([1, 2]), getModelImage);

module.exports = router