import { useState } from 'react'

import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOverScreen from './components/GameOverScreen'

let endPoints : number = 0;

export default function App() {
  const [showStartScreen, setshowStartScreen] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  function getEndPoints(points : number) {
    endPoints = points;
  }

  function startNewGame() {
    setGameOver(false)
    setshowStartScreen(true)
  }

  return (
    <>
      {showStartScreen && <StartScreen 
        setShowStartScreen={setshowStartScreen}
      />}
      {!showStartScreen && !gameOver && <Game 
        setGameOver={setGameOver}
        getEndPoints={getEndPoints}
      />}
      {gameOver && <GameOverScreen 
        points={endPoints}
        startNewGame={startNewGame}
      />}
    </>
  )
}
