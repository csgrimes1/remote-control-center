'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')

module.exports = async function start(port) {
    const  app = express()
    
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    
    // parse application/json
    app.use(bodyParser.json())

    app.get('/foo', require('./endpoints/ping'))
    app.get('/ping', require('./endpoints/ping'))
    app.get('/v1/sendButtonCommands', require('./endpoints/v1/send-button-commands'))

    return new Promise((resolve, reject) => {
        app.listen(port, (err, result) => {
            if (err)
                reject(err)
            else {
                console.log(`Server started on port ${port}.`)
                resolve(result)
            }
        })
    })
    // const listen = bluebird.promisify(app.listen, app)
    // return listen(port)
}
