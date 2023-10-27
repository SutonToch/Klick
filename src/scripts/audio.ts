const backgroundAudio: HTMLAudioElement 
    = new Audio("./src/assets/audio/seven-years-pixabay-keyframe_audio-2.mp3")
export const gainPointsAudio: HTMLAudioElement
    = new Audio("./src/assets/audio/message-incoming-universfield_025.mp3")
export const loseHPAudio: HTMLAudioElement
    = new Audio("./src/assets/audio/video-game-hit-noise-001-pixabay-EdR.mp3")

const audioMute = document.getElementsByClassName("audio-mute")
const audioMuteImg = document.getElementsByClassName("audio-mute-img")
let userInteracted = false
let backgroundAudioVolume : number = 0.02

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
                img.src = "src/assets/icons/Picol-Picol-Speaker-Louder.256.png"
                manageMuted(false)
            } else if(img.src.includes("Louder")) {
                img.src = "src/assets/icons/Picol-Picol-Speaker-Off.256.png"
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
        backgroundAudio.volume = backgroundAudioVolume
        gainPointsAudio.volume = 0.006
        loseHPAudio.volume = 0.025
    }
}

export function adjustAudio(adjustment:number) {
    backgroundAudioVolume = backgroundAudioVolume + adjustment
    backgroundAudio.volume = backgroundAudioVolume 
    console.log(backgroundAudio.volume)
}