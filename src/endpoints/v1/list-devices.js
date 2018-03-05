const scan = require('../../devices/scan')

module.exports = function listDevices(req, res) {
    return scan().then((devices) => {
        res.send(devices)
    }).catch(err => res.status(500).send(err))
}
