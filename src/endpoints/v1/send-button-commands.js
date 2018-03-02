'use strict'

const buttonDispatcher = require('../../devices/button-dispatcher')

async function sendButtonCommands(req, res) {
    try {
        const commands = (req.query.commands || '').trim().split(/(?:\,|\s+)/)
        console.log('query:', req.url, req.query, commands)
        await buttonDispatcher(req.query.deviceIp, commands)
        res.send('sent')
    } catch (x) {
        res.status(400).send(x.toString())
    }
}

module.exports = function (req, res) {
    return sendButtonCommands(req, res)
}