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

module.exports = {
    createModelMetadata,
    createModel
}