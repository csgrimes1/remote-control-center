const startServer = require('./server')
const scan = require('./devices/scan')

//Start scanning now
scan()
    .catch(err => console.error(err))
startServer(Number(process.env.SERVERPORT))
