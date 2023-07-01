const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid')

class ModelMetadata extends Model {}

ModelMetadata.init({
    metadataId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    modelNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    item: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            max: 4,
            min: 1
        }
    },
    setting: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sideStoneSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    mainStoneSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    design: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false,
    sequelize,
    modelName: 'Model Metadata'
})

ModelMetadata.beforeCreate((metadata) => {
    metadata.metadataId = uuidv4();
})

module.exports = ModelMetadata;