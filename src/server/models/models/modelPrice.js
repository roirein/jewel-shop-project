const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid')
const JewelModel = require('./jewelModel')

class ModelPrice extends Model {} 

ModelPrice.init({
    priceId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    modelNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    materials: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priceWithMaterials: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    priceWithoutMaterials: {
        type: DataTypes.FLOAT,
        allowNull: false
    }

}, {
    sequelize,
    modelName: 'Price',
    timestamps: false
})

ModelPrice.beforeCreate((price) => {
    price.priceId = uuidv4()
})

JewelModel.hasOne(ModelPrice, {foreignKey: 'modelNumber'})
ModelPrice.belongsTo(JewelModel, {foreignKey: 'modelNumber'})

module.exports = ModelPrice