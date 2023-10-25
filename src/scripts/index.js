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
var highscoreElement = document.getElementsByClassName("highscore")[0];
// BUTTONS & Elements that get Event Listeners
var startGameBtn = document.getElementsByClassName("start-game-btn")[0];
var startNewGameBtn = document.getElementsByClassName("start-new-game-btn")[0];
// Variables for logic
var defaultHPValue = 3;
var defaultPointsValue = 0;
var currentHP;
var currentPoints;
var worker;
var challenge = {
    current: 2,
    spawnTime: 2000,
    clickTime: 8000
};
var timeoutIds = [];
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
    challenge = {
        current: 2,
        spawnTime: 2000,
        clickTime: 8000
    };
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
    settingsBar.classList.remove("flex");
    gameScreen.classList.add("hide");
    gameoverScreenContainer.classList.add("flex");
    settingsBar.classList.add("hide");
    var highscore = localStorage.getItem("highscore") ? Number(localStorage.getItem("highscore")) : 0;
    if (currentPoints > highscore) {
        highscore = currentPoints;
        localStorage.setItem("highscore", JSON.stringify(currentPoints));
    }
    endPointsElement.textContent = "Points: ".concat(currentPoints);
    highscoreElement.textContent = "Highscore: ".concat(highscore);
    stopWorker();
    for (var i = gameScreen.children.length - 1; i > 1; i--) {
        clearInterval(timeoutIds[Number(gameScreen.children[i].id)]);
        gameScreen.children[i].remove();
    }
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
        worker.postMessage(4000 / challenge.current);
    }
    worker.onmessage = function (msg) { return generateBox(msg.data); };
}
function generateBox(count) {
    var box = document.createElement("div");
    box.classList.add("box");
    box.setAttribute("id", count.toString());
    box.style.top = (154 + Math.floor(Math.random() * (window.innerHeight - 154 - 150))).toString() + "px";
    box.style.left = (50 + window.innerWidth * 0.1 + Math.floor(Math.random() * (window.innerWidth - 200 - (window.innerWidth * 0.2)))).toString() + "px";
    box.style.width = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.height = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.backgroundColor = "hsl(\n        ".concat(Math.floor(Math.random() * 360), ",\n        ").concat(Math.floor(Math.random() * 100), "%,\n        ").concat(Math.floor(Math.random() * 100), "%\n    )");
    var intervalId = setInterval(function () {
        loseHPAudio.play();
        updateHP("HP: ".concat(currentHP - 1));
        gameScreen.removeChild(box);
        clearInterval(intervalId);
    }, challenge.clickTime - 100);
    timeoutIds[Number(count)] = intervalId;
    box.addEventListener("click", function boxClicked() {
        var endTime = performance.now();
        gainPointsAudio.play();
        updatePoints("Points: ".concat(currentPoints + 1));
        clearInterval(intervalId);
        box.removeEventListener('click', boxClicked);
        box.style.animation = "boxClicked linear 0.8s";
        setTimeout(function () { return gameScreen.removeChild(box); }, 700);
        adjustChallenge(endTime - startTime);
    });
    var startTime = performance.now();
    gameScreen.appendChild(box);
    //works even though the box is already placed on the dom, which is pleasantly suprising
    box.style.animation = "fadeOut linear ".concat(challenge.clickTime, "ms");
}
function adjustChallenge(timeUntilClickMs) {
    if (currentPoints > 150) {
        challenge.current = Math.max(challenge.current, 8);
    }
    else if (currentPoints > 50) {
        challenge.current = Math.max(challenge.current, 4);
    }
    else if (currentPoints > 10) {
        challenge.current = Math.max(challenge.current, 2);
    }
    if (timeUntilClickMs < 600) {
        challenge.current = Math.min(challenge.current + 0.2, 8);
    }
    else if (timeUntilClickMs < 800) {
        challenge.current = Math.min(challenge.current + 0.1, 8);
    }
    else if (timeUntilClickMs > 2000) {
        challenge.current = Math.max(challenge.current - 0.1, 1);
    }
    challenge.spawnTime = 4000 / challenge.current;
    challenge.clickTime = challenge.spawnTime * 4;
    worker === null || worker === void 0 ? void 0 : worker.postMessage(challenge.spawnTime);
}
