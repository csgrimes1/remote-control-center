document.onkeydown = (e) => {
    const el = document.getElementById(e.code)
    if (el) {
        console.log('code:', e.code)
        setTimeout(() => el.click(), 0)
    }
}
