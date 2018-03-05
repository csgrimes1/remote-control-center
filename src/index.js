const startServer = require('./server')
const scan = require('./devices/scan')
const logger = require('./logger').create(module)

// Start scanning now
scan()
    .catch(err => logger.error(err))
startServer(Number(process.env.SERVERPORT))
