const CryptoJS = require("crypto-js")

module.exports = (message) => {
    const bytes  = CryptoJS.AES.decrypt(message, process.env.VUE_APP_FRONT_SECRET)
    return bytes.toString(CryptoJS.enc.Utf8)
}
