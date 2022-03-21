require('./app/lib/file')   // Used to simplify requires.
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

// Launch server and db.
include('bin/launch')(app)


// Set encode.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// Set every routes.
const routes = include('routes')(app)

