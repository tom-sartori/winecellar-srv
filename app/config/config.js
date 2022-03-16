const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    postgres: {
        options: {
            database: process.env.DATABASE_NAME,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    // require: true,
                    rejectUnauthorized: false
                }
            },
        },
        client: null
    }
}
