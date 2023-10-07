import { useState } from 'react'

import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOverScreen from './components/GameOverScreen'

export default function App() {
  const [showStartScreen, setshowStartScreen] = useState(true)
  const [gameOver, setGameOver] = useState(false)



  return (
    <>
      <div>
        {showStartScreen && <StartScreen 
          setShowStartScreen={setshowStartScreen}
        />}
        {!showStartScreen && <Game 
          setGameOver={setGameOver}
        />}
        {gameOver && <GameOverScreen />}
      </div>
    </>
  )
}
