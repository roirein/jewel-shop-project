const JewelModel = require("../models/models/jewelModel")
const ModelMetadata = require("../models/models/modelMetadata")
const { sendNewModelNotification } = require("../services/sockets/socket")
const HttpError = require('../utils/HttpError')
const { createModelMetadata, createModel } = require("../utils/models")
const path = require('path')

const createNewModel = async (req, res, next) => {
    try {
        const existingModel = await JewelModel.findOne({
            where: {
                modelNumber: req.body.modelNumber
            }
        })
        if (existingModel) {
            throw new HttpError('model-exist', 409)
        }
        const modelMetadata = await createModelMetadata(req.body.setting, req.body.sideStoneSize, req.body.mainStoneSize, req.body.item);
        const model = await createModel(req.body.modelNumber, req.body.title, req.body.description, req.file.filename, modelMetadata.metadataId);
        //await sendNewModelNotification(modelMetadata.metadataId)
        res.status(201).send({model:{
            id: modelMetadata.dataValues.metadataId,
            modelNumber: model.dataValues.modelNumber,
            item: modelMetadata.dataValues.item,
            setting: modelMetadata.dataValues.setting,
            sideStoneSize: modelMetadata.dataValues.sideStoneSize,
            mainStoneSize: modelMetadata.dataValues.mainStoneSize,
            status: model.dataValues.status,
        }})
    } catch (e) {
        next(e)
    }
}

const getModelsMetadata = async (req, res, next) => {
    try {
        const modelsMetadata = await ModelMetadata.findAll({
            include: {
                model: JewelModel,
                attributes: ['status', 'modelNumber']
            }
        })

        console.log(modelsMetadata)

        const models = modelsMetadata.map((model) => {
            return {
                id: model.metadataId,
                modelNumber: model['Jewel Model'].modelNumber,
                item: model.item,
                setting: model.setting,
                sideStoneSize: model.sideStoneSize,
                mainStoneSize: model.mainStoneSize,
                status: model['Jewel Model'].status
            }
        })
        res.status(200).send({models})
    } catch (e) {
        console.log(e)
        next(e)
    }
}

const getModelById = async (req, res, next) => {
    try {
        const modelData = await JewelModel.findOne({
            where: {
                modelNumber: req.params.modelId
            }
        })

        const model = {
            modelNumber: modelData.dataValues.modelNumber,
            title: modelData.dataValues.title,
            description: modelData.dataValues.description,
            image: modelData.dataValues.image,
            status: modelData.dataValues.status
        }
        res.status(200).send({model})
    } catch (e) {
        next(e)
    }
}

const getModelImage = async (req, res, next) => {
    try {
        const file = req.params.imagePath
        const image = path.join(__dirname, '../../server/images/models', file);
        res.status(200).sendFile(image)
    } catch(e) {
        next (e)
    }
}

module.exports = {
    createNewModel,
    getModelsMetadata,
    getModelById,
    getModelImage
}