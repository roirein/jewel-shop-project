const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const ModelMetadata = require('../models/modelMetadata')
const OrderCustomer = require('./orderCustomer');
const Order = require('./order');

class JewelOrder extends Model {}

JewelOrder.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    metadataId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    }, 
    item: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 4
        }
    },
    metal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 4
        }
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 3
        }
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    casting: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'Jewel Order'
})


Order.hasOne(JewelOrder, {foreignKey: 'orderId'})
JewelOrder.hasOne(ModelMetadata, {foreignKey: 'metadataId'})
JewelOrder.belongsTo(Order, {foreignKey: 'orderId'});

module.exports = JewelOrder