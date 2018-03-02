'use strict'

const path = require('path')
const arpScript = path.resolve(__dirname, '../../bin/scan.sh')
const childProcess = require('child_process')
const providers = require('../providers')

async function testAddrForProvider (addr) {
    console.log('checking IP', addr)
    for(const provider of providers) {
        try {
            const device = await provider.forIp(addr)
            if (device)
                return device
        } catch (err) {
            console.warn(`${provider.providerName}(${addr}) --> `, err.message)
        }
    }
}

let devices = null;

function load() {
    const output = childProcess.execFileSync(arpScript).toString()
    const candidates = output.split('\n')
        .filter(addr => addr)
        .map(testAddrForProvider)
    return Promise.all(candidates)
        .then(candidates => {
            const asObjects = candidates.filter(x => x)
                .map(device => ({[device.ipAddress]: device}))
            return Object.assign({}, ...asObjects)
        })
        .catch(x => {
            console.error(x)
            return {}
        })
}

module.exports = async function scan (refresh = false) {
    if (refresh || !devices)
    {
        try {
            devices = await load()
        } catch (x) {
            devices = {}
        }
        console.log('scan result:', `${Object.keys(devices).length} device(s) found.`)
    }
    return devices
}
