import './../css/GameOverScreen.css'

interface Props {
    points:number;
    startNewGame: () => void;
}

export default function GameOverScreen(props:Props) {
    return(
        <div className="gameover-screen-container">
            <div className="gameover-screen">
                <h1>Game Over</h1>
                <h2>Points: {props.points}</h2>
                <button className="startNewGame" onClick={props.startNewGame}>New Game</button>
            </div>
        </div>
    )
}