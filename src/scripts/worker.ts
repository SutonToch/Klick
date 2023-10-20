let timeUntilNextBoxInMs = 4000
let idCounter = 0

function timeOutForBox() {
    idCounter++
    postMessage(idCounter.toString())
    setTimeout(timeOutForBox, timeUntilNextBoxInMs)
}

self.onmessage = (msg) => {
    timeUntilNextBoxInMs = msg.data
}

timeOutForBox()
