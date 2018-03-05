const request = require('request-promise')
const commonCommands = require('../provider-common/commands')
const logger = require('../logger').create(module)

// Many thanks to https://github.com/breunigs/bravia-auth-and-remote for
// the great examples of how to CURL the Bravia API!
class SonyBraviaController {
    constructor(ipAddress, commandMap, interfaceInfo) {
        this.ipAddress = ipAddress
        const commandDefs = commandMap.result[1]
            .map(def => ({ [def.name]: def.value }))
        const cm1 = Object.assign.apply(null, commandDefs)

        const deviceInfo = interfaceInfo.result[0]
        this.name = `SONY ${deviceInfo.productName} ${deviceInfo.modelName} at ${ipAddress}`
        this.authPin = '0000'

        const unmatched = '*NOMATCH*'
        const matches = Object.keys(cm1)
            .map(cmd => ({ [commonCommands.match(cmd) || unmatched]: cm1[cmd] }))
            .filter(pair => pair[unmatched] === undefined)
        const matchedCommon = Object.assign({}, ...matches)

        const strays = Object.keys(cm1)
            .filter(name => !commonCommands.match(name))

        this.commandMap = {
            ...cm1,
            ...matchedCommon,
            ok: cm1.DpadCenter,
            fastForward: cm1.Forward,
            previous: cm1.Previous,
        }
        logger.log('strays:', matchedCommon, strays)
    }

    send(commands) {
        const sentPromises = commands.map((cmd) => {
            const commandCode = this.commandMap[cmd]
            logger.log('command code:', cmd, commandCode)
            const url = `http://${this.ipAddress}/sony/IRCC`
            const soapPacket = `<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>${commandCode}</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`

            const params = {
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml; charset=UTF-8',
                    SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
                    'X-Auth-PSK': this.authPin,
                },
                body: soapPacket,
            }
            logger.log('sending', params)
            return request(params)
        })

        return Promise.all(sentPromises)
    }
}

module.exports = {
    async forIp(ipAddress) {
        const url = `http://${ipAddress}/sony/system`
        const params = {
            url,
            simple: true,
            resolveWithFullResponse: false,
            json: true,
            method: 'POST',
            body: { method: 'getRemoteControllerInfo',params: [], id: 10, version: '1.0' },
        }
        const commands = await request(params)
        const params2 = {
            ...params,
            body: { method: 'getInterfaceInformation', params: [], id: 2, version: '1.0' },
        }
        const interfaceInfo = await request(params2)
        return new SonyBraviaController(ipAddress, commands, interfaceInfo)
    },
}
