let timeUntilNextBoxInMs = 4000
let idCounter = 0

function timeOutForBox() {
    idCounter++
    postMessage(idCounter.toString())
    //You'd think setInterval() is perfect here, since a function is called repeatedly,
    //but, turns out, setInterval() can't change it's timer once it's set
    setTimeout(timeOutForBox, timeUntilNextBoxInMs)
}

self.onmessage = (msg) => {
    timeUntilNextBoxInMs = msg.data
}

timeOutForBox()
