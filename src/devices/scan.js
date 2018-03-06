const path = require('path')
const childProcess = require('child_process')
const providers = require('../providers')
const logger = require('../logger').create(module)
const waveCollapse = require('wave-collapse').defaultApi

const arpScript = path.resolve(__dirname, '../../bin/scan.sh')

async function safeForIp(provider, addr) {
    try {
        return await provider.forIp(addr)
    } catch (err) {
        logger.warn(`TEST of ${provider.providerName}(${addr}) --> `, err.message)
        return null
    }
}

function testAddrForProvider(addr) {
    logger.log(`Testing IP ${addr}.`)
    return waveCollapse.iterateOver(providers.map(p => safeForIp(p, addr)))
        .skipWhile(x => !x)
        .take(1)
        .reduce((accum, current) => accum || current)
}

let devices = null

function hardCodedIps() {
    const file = '/etc/remote-control-center/iplist.json'
    try {
        return require(file)
    } catch (err) {
        logger.log(`Hard coded IPs not found at [${file}]: ${err.message}`)
        return []
    }
}

function load() {
    const output = childProcess.execFileSync(arpScript).toString()
    const testIps = new Set(output.split('\n')
        .filter(addr => addr)
        .map(testAddrForProvider)
        .concat(hardCodedIps()))
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
        logger.log('scan result:', `${Object.keys(devices).length} device(s) found.`)
    }
    return devices
}
