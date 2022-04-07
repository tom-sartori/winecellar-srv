/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("compartment", {}, { timestamps: false }
    )
}
