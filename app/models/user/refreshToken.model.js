/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("refreshToken", {
        token: {
            type: Datatype.STRING,
        },
        expiryDate: {
            type: Datatype.DATE,
        },
    })
}
