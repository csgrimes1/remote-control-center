const logger = require('../logger').create(module)
const childProcess = require('child_process')
const portCheck = require('../devices/port-check')

function exec(cmd, ...args) {
    return new Promise((resolve, reject) => {
        childProcess.execFile(cmd, args, (err, stdout, stderr) => {
            const result = { stdout, stderr }
            logger.log('output:', stdout)
            logger.error('error:', stderr)
            if (err) {
                reject(Object.assign(err, result))
            } else {
                resolve(result)
            }
        })
    })
}

function ping(ip) {
    return portCheck(ip, 5555)
}

class FireTv {
    constructor(ip) {
        this.ipAddress = ip
        this.name = `Fire TV at ${ip}`
        this.pageUrl = '/yo.html'
    }

    async send(commands) {
        await exec('adb', 'connect', this.ip)
        await exec('adb', 'shell', 'input', 'keyevent', commands[0])
        await exec('adb', 'disconnect')
    }
}

module.exports = {
    forIp: async (ip) => {
        await ping(ip)
        logger.log(`${ip} is an ADB device`)
        return new FireTv(ip)
    },
}
