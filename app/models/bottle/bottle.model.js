/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

// Every foreign keys will be added in models/index.js.
module.exports = (sequelize) => {
    return sequelize.define("bottle", {}, { timestamps: false })
}
