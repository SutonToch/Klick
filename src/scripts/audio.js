var backgroundAudio = new Audio("./src/assets/seven-years-pixabay-keyframe_audio-2.mp3");
export var gainPointsAudio = new Audio("./src/assets/message-incoming-universfield_025.mp3");
export var loseHPAudio = new Audio("./src/assets/video-game-hit-noise-001-pixabay-EdR.mp3");
var audioMute = document.getElementsByClassName("audio-mute");
var audioMuteImg = document.getElementsByClassName("audio-mute-img");
var userInteracted = false;
window.addEventListener("load", function () {
    backgroundAudio.loop = true;
    manageMuted(true);
});
for (var _i = 0, _a = audioMute; _i < _a.length; _i++) {
    var element = _a[_i];
    element.addEventListener("click", function () {
        if (!userInteracted) {
            backgroundAudio.play();
            userInteracted = true;
        }
        for (var _i = 0, _a = audioMuteImg; _i < _a.length; _i++) {
            var img = _a[_i];
            if (img.src.includes("Off")) {
                img.src = "src/assets/Picol-Picol-Speaker-Louder.256.png";
                manageMuted(false);
            }
            else if (img.src.includes("Louder")) {
                img.src = "src/assets/Picol-Picol-Speaker-Off.256.png";
                manageMuted(true);
            }
        }
    });
}
function manageMuted(isMuted) {
    if (isMuted) {
        backgroundAudio.volume = 0;
        gainPointsAudio.volume = 0;
        loseHPAudio.volume = 0;
    }
    else if (!isMuted) {
        backgroundAudio.volume = 0.03;
        gainPointsAudio.volume = 0.01;
        loseHPAudio.volume = 0.02;
    }
}
