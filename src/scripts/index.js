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
startGameBtn.addEventListener("click", function () {
    toggleVisibilityClass(startScreenContainer);
    toggleVisibilityClass(gameScreen);
    toggleVisibilityClass(settingsBar);
    setupGame();
});
startNewGameBtn.addEventListener("click", function () {
    toggleVisibilityClass(gameoverScreenContainer);
    toggleVisibilityClass(gameScreen);
    toggleVisibilityClass(settingsBar);
    setupGame();
});
function toggleVisibilityClass(container) {
    if (container.classList.contains("hide")) {
        container.classList.remove("hide");
        container.classList.add("flex");
    }
    else {
        container.classList.remove("flex");
        container.classList.add("hide");
    }
}
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
function startWorker() {
    if (worker == undefined) {
        worker = new Worker("./src/scripts/worker.js", { type: "module" });
        worker.postMessage(4000 / challenge.current);
    }
    worker.onmessage = function (msg) { return generateBox(msg.data); };
}
function updatePoints(infoBarPointsText) {
    currentPoints = Number(infoBarPointsText.replace("Points: ", ""));
    pointsElement.textContent = infoBarPointsText;
}
function stopWorker() {
    if (worker == undefined) {
        return;
    }
    worker.terminate();
    worker = undefined;
}
function gameOver() {
    toggleVisibilityClass(gameScreen);
    toggleVisibilityClass(settingsBar);
    toggleVisibilityClass(gameoverScreenContainer);
    var highscore = localStorage.getItem("highscore") ? Number(localStorage.getItem("highscore")) : 0;
    if (currentPoints > highscore) {
        highscore = currentPoints;
        localStorage.setItem("highscore", currentPoints.toString());
    }
    endPointsElement.textContent = "Points: ".concat(currentPoints);
    highscoreElement.textContent = "Highscore: ".concat(highscore);
    stopWorker();
    for (var i = gameScreen.children.length - 1; i > 1; i--) {
        clearInterval(timeoutIds[Number(gameScreen.children[i].id)]);
        gameScreen.children[i].remove();
    }
}
function generateBox(count) {
    var box = document.createElement("div");
    box.classList.add("box");
    box.setAttribute("id", count.toString());
    box.style.top = (154 + Math.floor(Math.random() * (window.innerHeight - 154 - 150))) + "px";
    box.style.left = (50 + window.innerWidth * 0.1 + Math.floor(Math.random() * (window.innerWidth - 200 - (window.innerWidth * 0.2)))) + "px";
    box.style.width = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.height = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.backgroundColor = "hsl(\n        ".concat(Math.floor(Math.random() * 360), ",\n        ").concat(Math.floor(Math.random() * 100), "%,\n        ").concat(Math.floor(Math.random() * 100), "%\n    )");
    var intervalId = setInterval(function () {
        loseHPAudio.play();
        hpLost();
        gameScreen.removeChild(box);
        clearInterval(intervalId);
    }, challenge.clickTime - 100);
    timeoutIds[Number(count)] = intervalId;
    box.addEventListener("click", function boxClicked() {
        var endTime = performance.now();
        gainPointsAudio.play();
        clearInterval(intervalId);
        pointGained();
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
function hpLost() {
    updateHP("HP: ".concat(currentHP - 1));
    var hpLost = document.createElement("p");
    hpLost.classList.add("hpLost");
    hpLost.textContent = "-1";
    if (window.innerWidth > 1440) {
        hpLost.style.left = (190 + ((window.innerWidth - 1440) / 2)) + (Math.random() * 20 - 10) + "px";
    }
    else {
        hpLost.style.left = 190 + (Math.random() * 20 - 10) + "px";
    }
    hpLost.style.top = (90 + (Math.random() * 10 - 5)) + "px";
    gameScreen.appendChild(hpLost);
    setTimeout(function () { return gameScreen.removeChild(hpLost); }, 900);
}
function pointGained() {
    updatePoints("Points: ".concat(currentPoints + 1));
    var pointGained = document.createElement("p");
    pointGained.classList.add("pointGained");
    pointGained.textContent = "+1";
    if (window.innerWidth > 1440) {
        pointGained.style.left = (window.innerWidth - 90 - ((window.innerWidth - 1440) / 2)) + (Math.random() * 20 - 10) + "px";
    }
    else {
        pointGained.style.left = (window.innerWidth - 90) + (Math.random() * 20 - 10) + "px";
    }
    pointGained.style.top = (90 + (Math.random() * 10 - 5)) + "px";
    gameScreen.appendChild(pointGained);
    setTimeout(function () { return gameScreen.removeChild(pointGained); }, 900);
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
