const JewelModel = require("../models/models/jewelModel")
const ModelMetadata = require("../models/models/modelMetadata")

const createModelMetadata = async (setting, sideStoneSize, mainStoneSize, item, orderId = null, design = null) => {
    const metadata = await ModelMetadata.create({
        setting,
        sideStoneSize,
        mainStoneSize,
        item,
        orderId,
        design
    })

    console.log(metadata)

    return metadata
}

const createModel = async (modelNumber, title, description, image, metadataId) => {
    const model = await JewelModel.create({
        modelNumber,
        metadataId,
        title,
        description,
        image
    })
    return model
}


const preapareModels = (modelsList) => {
    const models = modelsList.map((model) => {
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

    return models
}


const getModelByStatus = async (status) => {
    let models = await ModelMetadata.findAll({
        include: {
            model: JewelModel,
            attributes: ['status', 'modelNumber']
        },
        order: [['updatedAt', 'DESC']]
    })

    if (status === 'ready') {
        models = models.filter((model) => model['JewelModel'].status === 3)
    } else {
        models = models.filter((model) => model['JewelModel'].status !== 3)
    }

    return preapareModels(models)
}

module.exports = {
    createModelMetadata,
    createModel,
    getModelByStatus,
    preapareModels
}