/**
 * Create table if not exists and set columns.
 */

const Datatype = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("utilisateur", {
            email: {
                type: Datatype.STRING,
                allowNull: false,
                primaryKey: true,
                validate: {
                    isEmail: true
                }
            },
            lastName: {
                type: Datatype.STRING,
                allowNull: false,
                validate: {
                    isAlpha: true
                }
            },
            firstName: {
                type: Datatype.STRING,
                allowNull: false,
                validate: {
                    isAlpha: true
                }
            },
            password: {
                type: Datatype.STRING,
                allowNull: false,
                // validate: {
                //     is: /^[0-9a-f]{64}$/i
                // },
                set (value) {
                    this.setDataValue('password', 'hashedValue')
                }
            }
        }
    )
}