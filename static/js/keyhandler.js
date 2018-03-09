document.onkeydown = (e) => {
    const el = document.getElementById(e.code)
    if (el) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        console.log('code:', e.code)
        setTimeout(() => el.click(), 0)
    }
}
