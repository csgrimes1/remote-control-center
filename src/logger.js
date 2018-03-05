/* eslint-disable no-console */
class Logger {
    constructor(module) {
        this.module = module

        this.log = console.log
        this.debug = console.debug
        this.trace = console.trace
        this.warn = console.warn
        this.error = console.error
    }
}

module.exports = {
    create: module => new Logger(module),
}
