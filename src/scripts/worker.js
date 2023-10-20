"use strict";
var timeUntilNextBoxInMs = 4000;
var idCounter = 0;
function timeOutForBox() {
    idCounter++;
    postMessage(idCounter.toString());
    setTimeout(timeOutForBox, timeUntilNextBoxInMs);
}
self.onmessage = function (msg) {
    timeUntilNextBoxInMs = msg.data;
};
timeOutForBox();
