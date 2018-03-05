
const commonCommands = require('../../src/provider-common/commands')
const assert = require('assert')

describe('commands', () => {
    it('should do a case-insensitive lookup', () => {
        const result = commonCommands.match('CursorUP')
        assert.equal(result, 'cursorUp')
    })
})
