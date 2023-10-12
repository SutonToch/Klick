var idCounter = 0;
function timeOutForBox() {
    idCounter++;
    postMessage(idCounter.toString());
    setTimeout(timeOutForBox, 5000);
}
timeOutForBox();
