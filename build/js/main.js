let callStack = []

function $(callback) {
    if (document.readyState === "complete") {
        return callback()
    }
    return callStack.push(callback)
}

window.onload = () => {
    while (callStack.length){
        return callStack.shift()
    }
}
