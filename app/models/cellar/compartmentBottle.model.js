/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("compartmentBottle", {
            quantity: {
                type: Datatype.INTEGER,
                allowNul: false,
                validate: {
                    isInt: true,
                    min: 0,
                }
            }
        },
        {
            timestamps: false,
            hooks: {
                afterUpdate:  (instance, options) => {
                    if (instance.previous().quantity < 0) {
                        // Delete the instance.
                        instance.destroy()
                    }
                }
            }
        }
    )
}
