const dotenv = require('dotenv')
dotenv.config()

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
            pool: {
                min: 0,
                max: 5,
                acquire: 30000,
                idle: 12000
            }
        },
        client: null
    },
    cloud: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
}
