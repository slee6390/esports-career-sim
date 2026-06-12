import { useState } from 'react'
import { SetupScreen } from './screens/SetupScreen.js'
import { MatchScreen } from './screens/MatchScreen.js'
import { ResultScreen } from './screens/ResultScreen.js'
import type { MatchConfig, MatchResult } from '../sim/matchEngine.js'

type Screen = 'setup' | 'match' | 'result'

export function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [config, setConfig] = useState<MatchConfig | null>(null)
  const [result, setResult] = useState<MatchResult | null>(null)

  if (screen === 'setup') {
    return (
      <SetupScreen
        onStart={cfg => { setConfig(cfg); setScreen('match') }}
      />
    )
  }

  if (screen === 'match' && config) {
    return (
      <MatchScreen
        // key forces a fresh component (and generator) on each new match
        key={config.seed}
        config={config}
        onComplete={r => { setResult(r); setScreen('result') }}
      />
    )
  }

  if (screen === 'result' && result) {
    return (
      <ResultScreen
        result={result}
        onPlayAgain={() => setScreen('setup')}
      />
    )
  }

  return null
}
