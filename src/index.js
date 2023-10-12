var startScreenContainer = document.getElementsByClassName("start-screen-container")[0];
var infoBar = document.getElementsByClassName("info-bar")[0];
var gameScreen = document.getElementsByClassName("game-screen")[0];
var gameoverScreenContainer = document.getElementsByClassName("gameover-screen-container")[0];
var hpElement = document.getElementsByClassName("hp")[0];
var pointsElement = document.getElementsByClassName("points")[0];
var endPointsElement = document.getElementsByClassName("end-points")[0];
var startGameBtn = document.getElementsByClassName("start-game-btn")[0];
var startNewGameBtn = document.getElementsByClassName("start-new-game-btn")[0];
var hp = 3;
var points = 0;
var worker;
// EVENT LISTENERS
startGameBtn.addEventListener("click", function () {
    startScreenContainer.classList.remove("flex");
    infoBar.classList.remove("hide");
    gameScreen.classList.remove("hide");
    startScreenContainer.classList.add("hide");
    infoBar.classList.add("flex");
    gameScreen.classList.add("flex");
    setupGame();
});
startNewGameBtn.addEventListener("click", function () {
    hp = 3;
    points = 0;
    worker = undefined;
    gameoverScreenContainer.classList.remove("flex");
    infoBar.classList.remove("hide");
    gameScreen.classList.remove("hide");
    gameoverScreenContainer.classList.add("hide");
    infoBar.classList.add("flex");
    gameScreen.classList.add("flex");
    setupGame();
});
function setupGame() {
    updateHP("HP: " + hp);
    updatePoints("Points: " + points);
    startWorker();
}
function updateHP(textContent) {
    hp = Number(textContent.slice(-1));
    hpElement.textContent = textContent;
    if (hp == 0) {
        gameOver();
    }
}
function updatePoints(textContent) {
    points = Number(textContent.slice(-1));
    pointsElement.textContent = textContent;
}
function startWorker() {
    if (worker == undefined) {
        worker = new Worker("src/worker.js", { type: "module" });
    }
    worker.onmessage = function (count) { return generateBox(count.data); };
}
function stopWorker() {
    if (worker == undefined) {
        return;
    }
    worker.terminate();
    worker = undefined;
}
function generateBox(count) {
    var box = document.createElement("div");
    box.classList.add("box");
    box.setAttribute("id", count.toString());
    box.style.top = (window.innerHeight * 0.1 + Math.floor(Math.random() * (window.innerHeight * 0.8))).toString() + "px";
    box.style.left = (window.innerWidth * 0.1 + Math.floor(Math.random() * (window.innerWidth * 0.8))).toString() + "px";
    box.style.width = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.height = (Math.floor(Math.random() * 50) + 50).toString() + "px";
    box.style.backgroundColor = "hsl(\n        ".concat(Math.floor(Math.random() * 360), ",\n        ").concat(Math.floor(Math.random() * 100), "%,\n        ").concat(Math.floor(Math.random() * 100), "%\n    )");
    var intervalId = setInterval(function () {
        updateHP("HP: ".concat(hp - 1));
        gameScreen.removeChild(box);
        clearInterval(intervalId);
    }, 4900);
    box.addEventListener("click", function () {
        updatePoints("Points: ".concat(points + 1));
        clearInterval(intervalId);
        gameScreen.removeChild(box);
    });
    gameScreen.appendChild(box);
    var boxElement = document.getElementById(count.toString());
    if (boxElement) {
        boxElement.style.animation = "fadeOut linear 5s";
    }
}
function gameOver() {
    infoBar.classList.remove("flex");
    gameScreen.classList.remove("flex");
    gameoverScreenContainer.classList.remove("hide");
    infoBar.classList.add("hide");
    gameScreen.classList.add("hide");
    gameoverScreenContainer.classList.add("flex");
    endPointsElement.textContent = "Points: ".concat(points);
    worker === null || worker === void 0 ? void 0 : worker.terminate();
    gameScreen.childNodes.forEach(function (node) { return gameScreen.removeChild(node); });
}
