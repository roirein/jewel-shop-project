const multer = require('multer');
const path = require('path')
const crypto = require('crypto');

const generateFileName = (file) => {
    const randomString = crypto.randomBytes(16).toString('hex');
    const originalExtension = path.extname(file.originalname);
    const newFilename = `${randomString}${originalExtension}`;
    return newFilename
}

const modelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/server/images/models');
    },
    filename: (req, file, cb) => {
        const fileName = generateFileName(file)
        cb(null, fileName);
    },
})

const designStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/server/images/designs');
    },
    filename: (req, file, cb) => {
        const fileName = generateFileName(file)
        cb(null, fileName);
    },
})
const modelUpload = multer({storage: modelStorage})
const designUpload = multer({storage: designStorage})

module.exports = {
    modelUpload,
    designUpload
};