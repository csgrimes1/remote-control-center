const path = require('path')
const childProcess = require('child_process')
const providers = require('../providers')
const logger = require('../logger').create(module)
const waveCollapse = require('wave-collapse').defaultApi

const arpScript = path.resolve(__dirname, '../../bin/scan.sh')

async function safeForIp(provider, addr) {
    try {
        const device = await provider.forIp(addr)
        // console.log('device found', device)
        return device
    } catch (err) {
        // logger.warn(`TEST of ${provider.providerName}(${addr}) --> `, err.message)
        return null
    }
}

async function testAddrForProvider(addr) {
    logger.log(`Testing IP ${addr}.`)
    const result = await waveCollapse.iterateOver(providers.map(p => safeForIp(p, addr)))
        .skipWhile(x => !x)
        .reduce(waveCollapse.toArray)
        .then(ar => ar[0])

    return result
}

let devices = null

function hardCodedIps() {
    const file = `${process.env.HOME}/.remote-control-center/iplist.json`
    try {
        const ips = require(file) // eslint-disable-line
        logger.log(`Hard coded IPs ${ips} added to scan.`)
        return ips
    } catch (err) {
        logger.log(`Hard coded IPs not found at [${file}]: ${err.message}`)
        return []
    }
}

function load() {
    const output = childProcess.execFileSync(arpScript).toString()
    const uniqueIps = new Set(output.split('\n')
        .filter(addr => addr)
        .concat(hardCodedIps()))
    const testIps = Array.from(uniqueIps).map(testAddrForProvider)
    return Promise.all(testIps)
        .then((results) => {
            const asObjects = results.filter(x => x)
                .map(device => ({ [device.ipAddress]: device }))
            return Object.assign({}, ...asObjects)
        })
        .catch((x) => {
            logger.error(x)
            return {}
        })
}

module.exports = async function scan(refresh = false) {
    if (refresh || !devices) {
        try {
            devices = await load()
        } catch (x) {
            devices = {}
        }
        logger.log('scan result:',
            `${Object.keys(devices).length} device(s) found.`,
            Object.values(devices).map(d => d.name),
        )
    }
    return devices
}
