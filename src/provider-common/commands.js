/* eslint-disable no-plusplus
*/

let n = 1
const commands = {
    sleep: n++,
    wake: n++,
    powerDown: n++,
    powerUp: n++,
    source: n++,
    num0: n++,
    num1: n++,
    num2: n++,
    num3: n++,
    num4: n++,
    num5: n++,
    num6: n++,
    num7: n++,
    num8: n++,
    num9: n++,
    previous: n++,
    rewind: n++,
    record: n++,
    play: n++,
    pause: n++,
    stop: n++,
    fastForward: n++,
    next: n++,
    mute: n++,
    volumeUp: n++,
    volumeDown: n++,
    channelUp: n++,
    channelDown: n++,
    menu: n++,
    exit: n++,
    back: n++,
    cursorUp: n++,
    cursorDown: n++,
    cursorLeft: n++,
    cursorRight: n++,
    pageUp: n++,
    pageDown: n++,
    enter: n++,
    help: n++,
    red: n++,
    green: n++,
    yellow: n++,
    blue: n++,
    zoom: n++,
    captions: n++,
    hdmi1: n++,
    hdmi2: n++,
    hdmi3: n++,
    hdmi4: n++,
    component1: n++,
    component2: n++,
    video1: n++,
    video2: n++,
    pictureMode: n++,
    home: n++,
    powerOff: n++,
    tv: n++,
    input: n++,
    wakeUp: n++,
}
// Add some non-semantic values likely to appear as codes in vendor implementations.
const commandsWithAliases = {
    ...commands,
    prev: commands.previous,
    subTitle: commands.captions,
    closedCaption: commands.captions,
    rec: commands.record,
    return: commands.last,
    pmode: commands.pictureMode,
    back: commands.return,
}

const lcMap = new Map(Object.keys(commandsWithAliases)
    .map(cmd => [cmd.toLowerCase(), cmd]))

module.exports = {
    ...commandsWithAliases,

    match(cmd) {
        return lcMap.get(cmd.toLowerCase())
    },
}
