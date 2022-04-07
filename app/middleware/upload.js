const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloud = require('cloudinary').v2
const multer = require('multer')    // Used to upload images.
const CONSTANTS = include('config/constants')
const CONFIG = include('config/config')

cloud.config(CONFIG.cloud)

const storage = new CloudinaryStorage({
    cloudinary: cloud,
    params: {
        folder: CONSTANTS.ROOT.IMAGE.WALL_IMAGE_PATH,
        public_id: (request, file) => {
            return new Date().toISOString()
        }
    },
})

function checkFileType(file, cb) {
    const allowedFiletypes = /jpg|jpeg|png/

    const mimetype = allowedFiletypes.test(file.mimetype)
    if (mimetype) {
        // Accept file
        return cb(null, true)
    }
    else {
        // Reject file
        cb(null, false)
    }
}

module.exports = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

