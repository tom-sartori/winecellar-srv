const multer = require('multer')    // Used to upload images.

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, abs_path('/uploads/'))
    },
    filename: function (request, file, callback) {
        callback(null, new Date().toISOString() + '.png')
        // callback(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (request, file, callback) => {
    callback(null, true)

    if (file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {
        // Accept
        callback(null, true)
    }
    else {
        // Reject file
        callback(null, false)
    }
}

module.exports = multer(
    {
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: fileFilter
    }
)
