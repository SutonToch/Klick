import { gainPointsAudio, loseHPAudio } from "./audio.js"

// CONTAINERS to show and hide
const startScreenContainer = document.getElementsByClassName("start-screen-container")[0]
const gameScreen = document.getElementsByClassName("game-screen")[0]
const gameoverScreenContainer = document.getElementsByClassName("gameover-screen-container")[0]
const settingsBar = document.getElementsByClassName("settings-bar")[0]

// ELEMENTS to manipulate content
const hpElement = document.getElementsByClassName("hp")[0]
const pointsElement = document.getElementsByClassName("points")[0]
const endPointsElement = document.getElementsByClassName("end-points")[0]

// BUTTONS & Elements that get Event Listeners
const startGameBtn = document.getElementsByClassName("start-game-btn")[0]
const startNewGameBtn = document.getElementsByClassName("start-new-game-btn")[0]

// Variables for logic
const defaultHPValue = 3
const defaultPointsValue = 0
let currentHP : number
let currentPoints : number
let worker : Worker | undefined
let challenge = {
    current: 2,
    spawnTime: 2000,
    clickTime: 8000
}


// TODO: Consolidating startScreenContainer and gameoverScreenContainer into one,
//       would remove one Event Listener here
startGameBtn.addEventListener("click", () => {
    startScreenContainer.classList.remove("flex")
    gameScreen.classList.remove("hide")
    settingsBar.classList.remove("hide")

    startScreenContainer.classList.add("hide")
    gameScreen.classList.add("flex")
    settingsBar.classList.add("flex")

    setupGame()
})

startNewGameBtn.addEventListener("click", () => {
    gameoverScreenContainer.classList.remove("flex")
    gameScreen.classList.remove("hide")
    settingsBar.classList.remove("hide")

    gameoverScreenContainer.classList.add("hide")
    gameScreen.classList.add("flex")
    settingsBar.classList.add("flex")

    setupGame()
})


function setupGame() {
    currentHP = defaultHPValue
    currentPoints = defaultPointsValue
    updateHP("HP: " + currentHP)
    updatePoints("Points: " + currentPoints)
    startWorker()
}

function updateHP(infoBarHPText : string) {
    currentHP = Number(infoBarHPText.replace("HP: ", ""))
    hpElement.textContent = infoBarHPText
    if(currentHP < 1) {
        gameOver()
    }
}

function gameOver() {
    gameScreen.classList.remove("flex")
    gameoverScreenContainer.classList.remove("hide")
    settingsBar.classList.remove("hide")

    gameScreen.classList.add("hide")
    gameoverScreenContainer.classList.add("flex")
    settingsBar.classList.add("flex")

    endPointsElement.textContent = `Points: ${currentPoints}`

    stopWorker()

    // this wont work, because i haven't cleared the Interval of that child yet
    // gameScreen.childNodes.forEach(node => gameScreen.removeChild(node))
}

function stopWorker() {
    if(worker == undefined) {
        return
    }
    worker.terminate()
    worker = undefined
}

function updatePoints(infoBarPointsText : string) {
    currentPoints = Number(infoBarPointsText.replace("Points: ", ""))
    pointsElement.textContent = infoBarPointsText
}

function startWorker() {
    if(worker == undefined) {
        worker = new Worker("./src/scripts/worker.js", {type: "module"})
        worker.postMessage(4000 / challenge.current)
    }
    worker.onmessage = (msg) => generateBox(msg.data)
}

function generateBox(count: string) {
    const box = document.createElement("div")
    box.classList.add("box")

    //maybe the id is not necessary, but I'll leave it in for now
    box.setAttribute("id", count.toString())

    box.style.top = (window.innerHeight*0.1 + Math.floor(Math.random()*(window.innerHeight*0.8))).toString() + "px"
    box.style.left = (window.innerWidth*0.1 + Math.floor(Math.random()*(window.innerWidth*0.8))).toString() + "px"
    box.style.width = (Math.floor(Math.random()*50)+50).toString() + "px"
    box.style.height = (Math.floor(Math.random()*50)+50).toString() + "px"
    box.style.backgroundColor = `hsl(
        ${Math.floor(Math.random()*360)},
        ${Math.floor(Math.random()*100)}%,
        ${Math.floor(Math.random()*100)}%
    )`

    const intervalId = setInterval(() => {
        loseHPAudio.play()
        updateHP(`HP: ${currentHP-1}`)
        gameScreen.removeChild(box)
        clearInterval(intervalId)
    }, challenge.clickTime - 100)

    box.addEventListener("click", () => {
        const endTime = performance.now()
        gainPointsAudio.play()
        updatePoints(`Points: ${currentPoints+1}`)
        clearInterval(intervalId)
        gameScreen.removeChild(box)
        console.log(endTime-startTime)
        adjustChallenge(endTime-startTime)
    })

    const startTime = performance.now()

    gameScreen.appendChild(box)

    //works even though the box is already placed on the dom, which is pleasantly suprising
    box.style.animation = `fadeOut linear ${challenge.clickTime}ms`
}

function adjustChallenge(timeUntilClickMs: number) {

    if(timeUntilClickMs < 600) {
        challenge.current = Math.min(challenge.current + 0.2, 8)
    } else if(timeUntilClickMs < 800) { 
        challenge.current = Math.min(challenge.current + 0.1, 8)
    } else if(timeUntilClickMs > 2000) {
        challenge.current = Math.max(challenge.current - 0.1, 1)
    }

    challenge.spawnTime = 4000 / challenge.current
    challenge.clickTime = challenge.spawnTime * 4
    worker?.postMessage(challenge.spawnTime)

    console.log(challenge.current + " " + challenge.spawnTime + " " + challenge.clickTime)
}