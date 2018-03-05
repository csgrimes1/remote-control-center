const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./logger').create(module)
const path = require('path')

module.exports = async function start(port) {
    const app = express()

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.get('/foo', require('./endpoints/ping')) //eslint-disable-line
    app.get('/ping', require('./endpoints/ping')) //eslint-disable-line
    app.get('/v1/sendButtonCommands', require('./endpoints/v1/send-button-commands')) //eslint-disable-line
    app.get('/v1/list-devices', require('./endpoints/v1/list-devices')) //eslint-disable-line

    const options = { index: 'devices.html' }
    app.use('/', express.static(path.resolve(__dirname, '../static'), options))

    return new Promise((resolve, reject) => {
        app.listen(port, (err, result) => {
            if (err) {
                reject(err)
            } else {
                logger.log(`Server started on port ${port}.`)
                resolve(result)
            }
        })
    })
    // const listen = bluebird.promisify(app.listen, app)
    // return listen(port)
}
