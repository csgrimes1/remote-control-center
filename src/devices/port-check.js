const net = require('net')

module.exports = function testPort(host, port) {
    const tester = net.createConnection({ port, host })
    tester.setTimeout(2000)

    return new Promise((resolve, reject) => {      
        tester.on('error', (err) => {
            tester.destroy()
            reject(err)
        })   
        tester.on('timeout', () => {
            tester.destroy()
            reject(new Error('TIMEOUT'))
        })
        tester.on('connect', () => {
            tester.destroy()
            resolve()
        })
    })
}

