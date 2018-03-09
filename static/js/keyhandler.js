document.onkeydown = (e) => {
    const id = `${e.ctrlKey ? 'ctrl-' : ''}${e.code}`
    const el = document.getElementById(id)
    if (el) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        console.log('code:', e.code)
        setTimeout(() => {
            el.focus()
            el.click()
        }, 0)
        return false
    }
    return true
}
