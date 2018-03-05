const fs = require('fs')
const path = require('path')

const instDirName = 'internal-providers'
const instDir = path.join(__dirname, instDirName)

module.exports = fs.readdirSync(instDir)
    .map(module => ({
        providerName: module, ...require(`./${instDirName}/${module}`) //eslint-disable-line
    }))
