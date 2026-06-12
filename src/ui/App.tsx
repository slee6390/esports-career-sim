import { useState } from 'react'
import { SetupScreen }    from './screens/SetupScreen.js'
import { HomeScreen }     from './screens/HomeScreen.js'
import { TrainingScreen } from './screens/TrainingScreen.js'
import { MatchScreen }    from './screens/MatchScreen.js'
import { ResultScreen }   from './screens/ResultScreen.js'
import { createCareer, applyTraining, applyMatchResult } from '../sim/careerEngine.js'
import type { CareerState, TrainingStat } from '../sim/careerEngine.js'
import type { MatchResult } from '../sim/matchEngine.js'
import type { ChampionData } from '../sim/types.js'
import { buildConfigFromCareer } from './matchDefaults.js'

type Screen = 'setup' | 'home' | 'training' | 'match' | 'result'

export function App() {
  const [screen, setScreen]   = useState<Screen>('setup')
  const [career, setCareer]   = useState<CareerState | null>(null)
  const [result, setResult]   = useState<MatchResult | null>(null)

  function handleStart(champion: ChampionData) {
    setCareer(createCareer(champion))
    setScreen('home')
  }

  function handleTrain(stat: TrainingStat) {
    setCareer(c => c ? applyTraining(c, stat) : c)
    setScreen('home')
  }

  function handleMatchComplete(r: MatchResult) {
    setResult(r)
    setCareer(c => c
      ? applyMatchResult(c, r.won, r.evaluation, r.finalTeam.goldDiff)
      : c
    )
    setScreen('result')
  }

  function handleContinue() {
    setResult(null)
    setScreen('home')
  }

  if (screen === 'setup') {
    return <SetupScreen onStart={handleStart} />
  }

  if (screen === 'home' && career) {
    return (
      <HomeScreen
        career={career}
        onTrain={() => setScreen('training')}
        onPlayMatch={() => setScreen('match')}
      />
    )
  }

  if (screen === 'training' && career) {
    return (
      <TrainingScreen
        career={career}
        onComplete={handleTrain}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'match' && career) {
    return (
      <MatchScreen
        key={Date.now()}
        config={buildConfigFromCareer(career)}
        onComplete={handleMatchComplete}
      />
    )
  }

  if (screen === 'result' && result) {
    return <ResultScreen result={result} onContinue={handleContinue} />
  }

  return null
}
