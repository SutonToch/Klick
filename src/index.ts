const startScreenContainer = document.getElementsByClassName("start-screen-container")[0]
const infoBar = document.getElementsByClassName("info-bar")[0]
const gameScreen = document.getElementsByClassName("game-screen")[0]
const gameoverScreenContainer = document.getElementsByClassName("gameover-screen-container")[0]

const hpElement = document.getElementsByClassName("hp")[0]
const pointsElement = document.getElementsByClassName("points")[0]
const endPointsElement = document.getElementsByClassName("end-points")[0]

const startGameBtn = document.getElementsByClassName("start-game-btn")[0]
const startNewGameBtn = document.getElementsByClassName("start-new-game-btn")[0]


let hp : number = 3
let points : number = 0
let worker : Worker | undefined


// EVENT LISTENERS
startGameBtn.addEventListener("click", () => {
    startScreenContainer.classList.remove("flex")
    infoBar.classList.remove("hide")
    gameScreen.classList.remove("hide")

    startScreenContainer.classList.add("hide")
    infoBar.classList.add("flex")
    gameScreen.classList.add("flex")

    setupGame()
})

startNewGameBtn.addEventListener("click", () => {
    hp = 3
    points = 0

    gameoverScreenContainer.classList.remove("flex")
    infoBar.classList.remove("hide")
    gameScreen.classList.remove("hide")

    gameoverScreenContainer.classList.add("hide")
    infoBar.classList.add("flex")
    gameScreen.classList.add("flex")

    setupGame()
})



function setupGame() {
    updateHP("HP: " + hp)
    updatePoints("Points: " + points)
    startWorker()
}

function updateHP(textContent : string) {
    hp = Number(textContent.replace("HP: ", ""))
    hpElement.textContent = textContent
    if(hp == 0) {
        gameOver()
    }
}

function updatePoints(textContent : string) {
    points = Number(textContent.replace("Points: ", ""))
    pointsElement.textContent = textContent
}

function startWorker() {
    if(worker == undefined) {
        worker = new Worker("src/worker.js", {type: "module"})
    }
    worker.onmessage = (count) => generateBox(count.data)
}

function stopWorker() {
    if(worker == undefined) {
        return
    }
    worker.terminate()
    worker = undefined
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
        updateHP(`HP: ${hp-1}`)
        gameScreen.removeChild(box)
        clearInterval(intervalId)
    }, 4900)

    box.addEventListener("click", () => {
        updatePoints(`Points: ${points+1}`)
        clearInterval(intervalId)
        gameScreen.removeChild(box)
    })

    gameScreen.appendChild(box)

    //works even though the box is already placed on the dom, which is pleasantly suprising
    box.style.animation = "fadeOut linear 5s"
}

function gameOver() {
    infoBar.classList.remove("flex")
    gameScreen.classList.remove("flex")
    gameoverScreenContainer.classList.remove("hide")

    infoBar.classList.add("hide")
    gameScreen.classList.add("hide")
    gameoverScreenContainer.classList.add("flex")

    endPointsElement.textContent = `Points: ${points}`

    stopWorker()

    // this wont work, because i haven't cleared the Interval of that child yet
    // gameScreen.childNodes.forEach(node => gameScreen.removeChild(node))
}