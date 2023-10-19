import { gainPointsAudio, loseHPAudio } from "./audio.js";
// CONTAINERS to show and hide
var startScreenContainer = document.getElementsByClassName("start-screen-container")[0];
var gameScreen = document.getElementsByClassName("game-screen")[0];
var gameoverScreenContainer = document.getElementsByClassName("gameover-screen-container")[0];
var settingsBar = document.getElementsByClassName("settings-bar")[0];
// ELEMENTS to manipulate content
var hpElement = document.getElementsByClassName("hp")[0];
var pointsElement = document.getElementsByClassName("points")[0];
var endPointsElement = document.getElementsByClassName("end-points")[0];
// BUTTONS & Elements that get Event Listeners
var startGameBtn = document.getElementsByClassName("start-game-btn")[0];
var startNewGameBtn = document.getElementsByClassName("start-new-game-btn")[0];
// Variables for logic
var defaultHPValue = 3;
var defaultPointsValue = 0;
var currentHP;
var currentPoints;
var worker;
// TODO: Consolidating startScreenContainer and gameoverScreenContainer into one,
//       would remove one Event Listener here
startGameBtn.addEventListener("click", function () {
    startScreenContainer.classList.remove("flex");
    gameScreen.classList.remove("hide");
    settingsBar.classList.remove("hide");
    startScreenContainer.classList.add("hide");
    gameScreen.classList.add("flex");
    settingsBar.classList.add("flex");
    setupGame();
});
startNewGameBtn.addEventListener("click", function () {
    gameoverScreenContainer.classList.remove("flex");
    gameScreen.classList.remove("hide");
    settingsBar.classList.remove("hide");
    gameoverScreenContainer.classList.add("hide");
    gameScreen.classList.add("flex");
    settingsBar.classList.add("flex");
    setupGame();
});
function setupGame() {
    currentHP = defaultHPValue;
    currentPoints = defaultPointsValue;
    updateHP("HP: " + currentHP);
    updatePoints("Points: " + currentPoints);
    startWorker();
}
function updateHP(infoBarHPText) {
    currentHP = Number(infoBarHPText.replace("HP: ", ""));
    hpElement.textContent = infoBarHPText;
    if (currentHP < 1) {
        gameOver();
    }
}
function gameOver() {
    gameScreen.classList.remove("flex");
    gameoverScreenContainer.classList.remove("hide");
    settingsBar.classList.remove("hide");
    gameScreen.classList.add("hide");
    gameoverScreenContainer.classList.add("flex");
    settingsBar.classList.add("flex");
    endPointsElement.textContent = "Points: ".concat(currentPoints);
    stopWorker();
    // this wont work, because i haven't cleared the Interval of that child yet
    // gameScreen.childNodes.forEach(node => gameScreen.removeChild(node))
}
function stopWorker() {
    if (worker == undefined) {
        return;
    }
    worker.terminate();
    worker = undefined;
}
function updatePoints(infoBarPointsText) {
    currentPoints = Number(infoBarPointsText.replace("Points: ", ""));
    pointsElement.textContent = infoBarPointsText;
}
function startWorker() {
    if (worker == undefined) {
        worker = new Worker("./src/scripts/worker.js", { type: "module" });
    }
    worker.onmessage = function (msg) { return generateBox(msg.data); };
}
function generateBox(count) {
    var box = document.createElement("div");
    box.classList.add("box");
    //maybe the id is not necessary, but I'll leave it in for now
    box.setAttribute("id", count.toString());
    box.style.top = (window.innerHeight * 0.1 + Math.floor(Math.random() * (window.innerHeight * 0.8))).toString() + "px";
    box.style.left = (window.innerWidth * 0.1 + Math.floor(Math.random() * (window.innerWidth * 0.8))).toString() + "px";
    box.style.width = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.height = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.backgroundColor = "hsl(\n        ".concat(Math.floor(Math.random() * 360), ",\n        ").concat(Math.floor(Math.random() * 100), "%,\n        ").concat(Math.floor(Math.random() * 100), "%\n    )");
    var intervalId = setInterval(function () {
        loseHPAudio.play();
        updateHP("HP: ".concat(currentHP - 1));
        gameScreen.removeChild(box);
        clearInterval(intervalId);
    }, 3900);
    box.addEventListener("click", function () {
        gainPointsAudio.play();
        updatePoints("Points: ".concat(currentPoints + 1));
        clearInterval(intervalId);
        gameScreen.removeChild(box);
    });
    gameScreen.appendChild(box);
    //works even though the box is already placed on the dom, which is pleasantly suprising
    box.style.animation = "fadeOut linear 4000ms";
}
