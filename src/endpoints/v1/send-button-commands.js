'use strict'

const buttonDispatcher = require('../../devices/button-dispatcher')
const logger = require('../../logger').create(module)

async function sendButtonCommands(req, res) {
    try {
        const commands = (req.query.commands || '').trim().split(/(?:\,|\s+)/)
        console.log('query:', req.url, req.query, commands)
        await buttonDispatcher(req.query.deviceIp, commands)
        res.send('sent')
    } catch (x) {
        logger.warn(x.message)
        res.status(400).send(x.message)
    }
}

module.exports = function sendButtonCommandsHandler(req, res) {
    return sendButtonCommands(req, res)
}
