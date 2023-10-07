import './../css/StartScreen.css'

interface Props {
    setShowStartScreen: (arg0: boolean) => void;
}

export default function StartScreen(props : Props) {
    return(
        <div className="start-screen-container">
            <div className="start-screen">
                <h1>Klick</h1>
                <button className="start" onClick={() => props.setShowStartScreen(false)}>Start Game</button>
            </div>
        </div>
    )
}