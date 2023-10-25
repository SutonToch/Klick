const backgroundAudio: HTMLAudioElement 
    = new Audio("./src/assets/seven-years-pixabay-keyframe_audio-2.mp3")
export const gainPointsAudio: HTMLAudioElement
    = new Audio("./src/assets/message-incoming-universfield_025.mp3")
export const loseHPAudio: HTMLAudioElement
    = new Audio("./src/assets/video-game-hit-noise-001-pixabay-EdR.mp3")

const audioMute = document.getElementsByClassName("audio-mute")
const audioMuteImg = document.getElementsByClassName("audio-mute-img")
let userInteracted = false 

window.addEventListener("load", () => {
    backgroundAudio.loop = true
    manageMuted(true)
})

for(const element of audioMute as any as HTMLElement[]) {
    element.addEventListener("click", () => {
        if(!userInteracted) {
            backgroundAudio.play()
            userInteracted = true;
        }
        for(const img of audioMuteImg as any as HTMLImageElement[]) {
            if(img.src.includes("Off")) {
                img.src = "src/assets/Picol-Picol-Speaker-Louder.256.png"
                manageMuted(false)
            } else if(img.src.includes("Louder")) {
                img.src = "src/assets/Picol-Picol-Speaker-Off.256.png"
                manageMuted(true)
            }
        }
    })
}

function manageMuted(isMuted:boolean) {
    if(isMuted) {
        backgroundAudio.volume = 0
        gainPointsAudio.volume = 0
        loseHPAudio.volume = 0
    } else if(!isMuted) {
        backgroundAudio.volume = 0.03
        gainPointsAudio.volume = 0.01
        loseHPAudio.volume = 0.02
    }
}