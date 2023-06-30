const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const ModelMetadata = require('./modelMetadata');

class JewelModel extends Model {}

JewelModel.init({
    modelNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    metadataId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 0,
            max: 4
        }
    }
}, {
    timestamps: false,
    sequelize,
    modelName: 'Jewel Model'
})

ModelMetadata.hasOne(JewelModel, {foreignKey: 'metadataId'});
JewelModel.belongsTo(ModelMetadata, {foreignKey: 'metadataId', onDelete: 'CASCADE'})

module.exports = JewelModel