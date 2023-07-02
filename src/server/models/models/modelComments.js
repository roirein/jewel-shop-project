const {DataTypes, Model, Sequelize} = require('sequelize');
const sequelize = require('../../database/connection');
const {v4: uuidv4} = require('uuid')
const JewelModel = require('./jewelModel')


class Comments extends Model {}

Comments.init({
    commentId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    modelNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Comments',
    timestamps: true
})

Comments.beforeCreate((comment) => {
    comment.commentId = uuidv4();
})

JewelModel.hasMany(Comments, {foreignKey: 'commentId'})
//Comments.hasOne(JewelModel, {foreignKey: 'modelNumber'})

module.exports = Comments