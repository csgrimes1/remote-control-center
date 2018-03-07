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

const fireCommandMap = {
    cursorUp: 19,
    cursorDown: 20,
    cursorLeft: 21,
    cursorRight: 22,
    ok: 66,
    return: 4,
    home: 3,
    menu: 1,
    rewind: 88,
    play: 85,
    fastForward: 87,
}

const connection = {
    device: null,
    ticks: 0,
    async ensureConnected(device) {
        if (this.device !== device) {
            await exec('adb', 'connect', device)
            this.device = device
        }
        this.ticks = process.uptime()
    },

    checkTime() {
        if (process.uptime() - this.ticks > 10) {
            this.device = null
            console.log('Disconnecting ADB')
            exec('adb', 'disconnect')
        }
    },
}

setInterval(connection.checkTime.bind(connection), 5000)

class FireTv {
    constructor(ip) {
        this.ipAddress = ip
        this.name = `Fire TV at ${ip}`
        this.pageUrl = `/firetv-remote.html?deviceIp=${ip}`
    }

    async send(commands) {
        const sendCommand = fireCommandMap[commands[0]]
        await connection.ensureConnected(this.ipAddress)
        await exec('adb', 'shell', 'input', 'keyevent', `${sendCommand}`)
    }
}

module.exports = {
    forIp: async (ip) => {
        await ping(ip)
        logger.log(`${ip} is an ADB device`)
        return new FireTv(ip)
    },
}
