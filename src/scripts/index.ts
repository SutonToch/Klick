import { gainPointsAudio, loseHPAudio } from "./audio.js"

interface ChallengeObject {
    current: number,
    spawnTime: number,
    clickTime: number
}

// CONTAINERS to show and hide
const startScreenContainer = document.getElementsByClassName("start-screen-container")[0]
const gameScreen = document.getElementsByClassName("game-screen")[0]
const gameoverScreenContainer = document.getElementsByClassName("gameover-screen-container")[0]
const settingsBar = document.getElementsByClassName("settings-bar")[0]

// ELEMENTS to manipulate content
const hpElement = document.getElementsByClassName("hp")[0]
const pointsElement = document.getElementsByClassName("points")[0]
const endPointsElement = document.getElementsByClassName("end-points")[0]
const highscoreElement = document.getElementsByClassName("highscore")[0]

// BUTTONS & Elements that get Event Listeners
const startGameBtn = document.getElementsByClassName("start-game-btn")[0]
const startNewGameBtn = document.getElementsByClassName("start-new-game-btn")[0]

// Variables for logic
const defaultHPValue = 3
const defaultPointsValue = 0
let currentHP : number
let currentPoints : number
let worker : Worker | undefined
let challenge : ChallengeObject = {
    current: 2,
    spawnTime: 2000,
    clickTime: 8000
}
let timeoutIds:NodeJS.Timeout[] = []


startGameBtn.addEventListener("click", () => {
    toggleVisibilityClass(startScreenContainer)
    toggleVisibilityClass(gameScreen)
    toggleVisibilityClass(settingsBar)

    setupGame()
})

startNewGameBtn.addEventListener("click", () => {
    toggleVisibilityClass(gameoverScreenContainer)
    toggleVisibilityClass(gameScreen)
    toggleVisibilityClass(settingsBar)

    setupGame()
})

function toggleVisibilityClass(container:Element) {
    if(container.classList.contains("hide")) {
        container.classList.remove("hide")
        container.classList.add("flex")
    } else {
        container.classList.remove("flex")
        container.classList.add("hide")
    }
}

function setupGame() {
    currentHP = defaultHPValue
    currentPoints = defaultPointsValue
    challenge = {
        current: 2,
        spawnTime: 2000,
        clickTime: 8000
    }

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

function startWorker() {
    if(worker == undefined) {
        worker = new Worker("./src/scripts/worker.js", {type: "module"})
        worker.postMessage(4000 / challenge.current)
    }
    worker.onmessage = (msg) => generateBox(msg.data)
}

function updatePoints(infoBarPointsText : string) {
    currentPoints = Number(infoBarPointsText.replace("Points: ", ""))
    pointsElement.textContent = infoBarPointsText
}

function stopWorker() {
    if(worker == undefined) {
        return
    }
    worker.terminate()
    worker = undefined
}

function gameOver() {
    toggleVisibilityClass(gameScreen)
    toggleVisibilityClass(settingsBar)
    toggleVisibilityClass(gameoverScreenContainer)

    let highscore : number = localStorage.getItem("highscore") ? Number(localStorage.getItem("highscore")) : 0
    if(currentPoints > highscore) {
        highscore = currentPoints
        localStorage.setItem("highscore", currentPoints.toString())
    }

    endPointsElement.textContent = `Points: ${currentPoints}`
    highscoreElement.textContent = `Highscore: ${highscore}`

    stopWorker()

    for(let i=gameScreen.children.length-1; i>1; i--) {
        clearTimeout(timeoutIds[Number(gameScreen.children[i].id)])
        gameScreen.children[i].remove()
    }
}

function generateBox(count: string) {
    const box = document.createElement("div")
    box.classList.add("box")

    box.setAttribute("id", count.toString())

    box.style.top = (154 + Math.floor(Math.random()*(window.innerHeight-154-150))) + "px"
    box.style.left = (50 + window.innerWidth*0.1 + Math.floor(Math.random() * (window.innerWidth - 200 - (window.innerWidth*0.2)))) + "px"
    box.style.width = (Math.floor(Math.random()*50)+50).toString() + "px"
    box.style.height = (Math.floor(Math.random()*50)+50).toString() + "px"
    box.style.backgroundColor = `hsl(
        ${Math.floor(Math.random()*360)},
        ${Math.floor(Math.random()*100)}%,
        ${Math.floor(Math.random()*100)}%
    )`

    const timeoutId = setTimeout(() => {
        loseHPAudio.play()
        hpLost()
        gameScreen.removeChild(box)
    }, challenge.clickTime - 100)

    timeoutIds[Number(count)] = timeoutId

    box.addEventListener("click", function boxClicked() {
        const endTime = performance.now()
        gainPointsAudio.play()
        clearTimeout(timeoutId)

        pointGained()

        box.removeEventListener('click', boxClicked)

        box.style.animation = "boxClicked linear 0.8s"
        setTimeout(() => gameScreen.removeChild(box), 700)

        adjustChallenge(endTime-startTime)
    })

    const startTime = performance.now()

    gameScreen.appendChild(box)

    //works even though the box is already placed on the dom, which is pleasantly suprising
    box.style.animation = `fadeOut linear ${challenge.clickTime}ms`
}

function hpLost() {
    updateHP(`HP: ${currentHP-1}`)
    const hpLost = document.createElement("p")
    hpLost.classList.add("hpLost")
    hpLost.textContent = "-1"

    if(window.innerWidth > 1440) {
        hpLost.style.left = (190+((window.innerWidth-1440)/2)) + (Math.random()*20-10) + "px"
    } else {
        hpLost.style.left = 190 + (Math.random()*20-10) + "px"
    }

    hpLost.style.top = (90 + (Math.random()*10-5)) + "px"
    gameScreen.appendChild(hpLost)
    setTimeout(() => gameScreen.removeChild(hpLost), 900)
}

function pointGained() {
    updatePoints(`Points: ${currentPoints+1}`)

    const pointGained = document.createElement("p")
    pointGained.classList.add("pointGained")
    pointGained.textContent = "+1"

    if(window.innerWidth > 1440) {
        pointGained.style.left = (window.innerWidth-90-((window.innerWidth-1440)/2)) + (Math.random()*20-10) + "px"
    } else {
        pointGained.style.left = (window.innerWidth-90) + (Math.random()*20-10) + "px"
    }

    pointGained.style.top = (90 + (Math.random()*10-5)) + "px"
    gameScreen.appendChild(pointGained)
    setTimeout(() => {
        //If gameover occurs during this timeout, the gameover handler removes all children, 
        //including 'pointGained' -> that's why this check is necessary
        if(gameScreen.children.length > 0) {
            gameScreen.removeChild(pointGained)
        }
    }, 900)
}

function adjustChallenge(timeUntilClickMs: number) {
    if(currentPoints > 150) {
        challenge.current = Math.max(challenge.current, 8)
    } else if(currentPoints > 50) {
        challenge.current = Math.max(challenge.current, 4)
    } else if(currentPoints > 10) {
        challenge.current = Math.max(challenge.current, 2)
    }

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
}