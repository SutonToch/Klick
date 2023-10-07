import { useState, useEffect } from 'react'
import './../css/Game.css'

interface Props {
    setGameOver: (arg0: boolean) => void;
    getEndPoints: (points: number) => void;
}

export default function Game(props:Props) {
    const [hp, setHP] = useState(3)
    const [points, setPoints] = useState(0)

    if(hp < 1) {
        props.getEndPoints(points)
        props.setGameOver(true)
    }

    useEffect(() => {
        const intervalID = setInterval(() => {
            console.log("timed out")
            setHP(prevState => prevState-1)
        }, 10000)

        return () => clearInterval(intervalID);
    }, [hp, points])

    function handleClick() {
        setPoints(prevState => prevState+1)
    }

    const rdmPosX = window.innerWidth*0.1 + Math.floor(Math.random()*(window.innerWidth*0.8))
    const rdmPosY = window.innerHeight*0.1 + Math.floor(Math.random()*(window.innerHeight*0.8))
    // console.log("window width: " + window.innerWidth)
    // console.log("window height: " + window.innerHeight)

    const box = <div className="box" style={{top: rdmPosY, left: rdmPosX}} onClick={handleClick}></div>

    return(
        <>
            <div className="info-bar">
                <p>HP: {hp}</p>
                <p>Points: {points}</p>
            </div>
            {box}
        </>
    )
}