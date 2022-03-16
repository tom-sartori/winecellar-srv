require('./app/lib/file')   // Used to simplify requires.
const express = require('express')

const app = express()

// Launch server and db.
include('bin/launch')(app)


// Set encode.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// Set every routes.
const routes = include('routes')(app)

