require('./app/lib/file')   // Used to simplify requires.
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const CONSTANTS = include('config/constants')

// Launch server and db.
include('bin/launch')(app)


// Set encode.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(CONSTANTS.ROOT.API + CONSTANTS.ROOT.IMAGE.MUR_IMAGE_PATH + '/', express.static(abs_path('/uploads/')))


// Set every routes.
const routes = include('routes')(app)

