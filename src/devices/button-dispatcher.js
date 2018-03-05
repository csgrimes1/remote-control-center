const scan = require('./scan')

module.exports = async function dispatchCommands(ipAddress, commands) {
    const devices = await scan()
    const target = devices[ipAddress]
    if (!target) {
        throw Object.assign(new Error(`No device at ${ipAddress}`), { name: 'DeviceNotFound' })
    }
    return target.send(commands)
}
