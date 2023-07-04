const JewelModel = require("../models/models/jewelModel")
const Comments = require("../models/models/modelComments")
const ModelMetadata = require("../models/models/modelMetadata")
const ModelPrice = require("../models/models/modelPrice")
const Order = require("../models/orders/order")
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
        let metadataId = req.body.metadataId
        if (metadataId !== 'undefined') {
            await ModelMetadata.update({
                modelNumber: req.body.modelNumber
            }, {
                where: {
                    metadataId: req.body.metadataId
                }
            })
        } else {
            const modelMetadata = await createModelMetadata(req.body.setting, req.body.sideStoneSize, req.body.mainStoneSize, req.body.item);
            metadataId = modelMetadata.metadataId
        }
        const model = await createModel(req.body.modelNumber, req.body.title, req.body.description, req.file.filename, metadataId);
        //await sendNewModelNotification(modelMetadata.metadataId)
        res.status(201).send({model:{
            id: metadataId,
            modelNumber: model.dataValues.modelNumber,
            item: req.body.item,
            setting: req.body.setting,
            sideStoneSize: req.body.sideStoneSize,
            mainStoneSize: req.body.mainStoneSize,
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

        const models = modelsMetadata.map((model) => {
            return {
                id: model.metadataId,
                modelNumber: model['Jewel Model']?.modelNumber ||  null,
                item: model.item,
                setting: model.setting,
                sideStoneSize: model.sideStoneSize,
                mainStoneSize: model.mainStoneSize,
                status: model['Jewel Model']?.status === null ? -1 : model['Jewel Model']?.status 
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

        let modelPrice = {};
        const modelPriceData = await ModelPrice.findOne({
            where: {
                modelNumber: req.params.modelId
            }
        })
        if (modelPriceData) {
            modelPrice = {
                materials: modelPriceData.dataValues.materials,
                priceWithMaterials: modelPriceData.dataValues.priceWithMaterials,
                priceWithoutMaterials: modelPriceData.dataValues.priceWithoutMaterials
            }
        }

        let model = {
            modelNumber: modelData.dataValues.modelNumber,
            title: modelData.dataValues.title,
            description: modelData.dataValues.description,
            image: modelData.dataValues.image,
            status: modelData.dataValues.status
        }
        if (modelPrice) {
            model = {
                ...model,
                ...modelPrice
            }
        }
        res.status(200).send({model})
    } catch (e) {
        next(e)
    }
}

const getModelComments = async (req, res, next) => {
    try {
        const commentData = await Comments.findAll({
            where: {
                modelNumber: req.params.modelNumber
            },
            attributes: ['content'], 
            order: [['createdAt', 'DESC']],
            limit: 1
        })

        res.status(200).send({comment: commentData[0].dataValues.content})
    } catch (e) {
        next(e)
    }
}

const updateModel = async (req, res, next) => {
    try {
        await JewelModel.update({
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename,
            status: 2
        },{
            where: {
                modelNumber: req.params.modelNumber
            }
        })
        res.status(200).send({newModel: {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            status: 2
        }})
    } catch(e) {
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

const updateModelPrice = async (req, res, next) => {
    try {
        await ModelPrice.create({
            modelNumber: req.params.modelNumber,
            materials: req.body.materials,
            priceWithMaterials: req.body.priceWithMaterials,
            priceWithoutMaterials: req.body.priceWithoutMaterials
        })
        await JewelModel.update({
            status: 4
        }, {
            where: {
                modelNumber: req.params.modelNumber
            }
        })
        const modelMetadata = await ModelMetadata.findOne({
            where: {
                modelNumber: req.params.modelNumber
            }
        })
        if (modelMetadata.dataValues.orderId) {
            await Order.update({
                status: 2
            }, {
                where: {
                    orderId: modelMetadata.dataValues.orderId
                }
            })
        }
        res.status(201).send();
    } catch (e) {
        console.log(e)
        next(e)
    }
}

const getPriceData = async (req, res, next) => {
    try {
        const priceData = await ModelPrice.findOne({
            where: {
                modelNumber: req.params.modelNumber
            }
        })
        const price = {
            materials: priceData.dataValues.materials,
            priceWithMaterials: priceData.dataValues.priceWithMaterials,
            priceWithoutMaterials: priceData.dataValues.priceWithoutMaterials
        }

        res.status(200).send({price})
    } catch (e) {
        next (e)
    }
}


module.exports = {
    createNewModel,
    getModelsMetadata,
    getModelById,
    getModelImage,
    getModelComments,
    updateModel,
    updateModelPrice,
    getPriceData
}