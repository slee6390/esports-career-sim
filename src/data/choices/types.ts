import type { GamePhase } from '../../sim/types.js'
import type { PlayerDelta, TeamDelta, EnemyDelta } from '../../sim/stateUtils.js'

export interface ChoiceOption {
  id:           string
  text:         string
  description:  string
  playerDelta?: PlayerDelta
  teamDelta?:   TeamDelta
  enemyDelta?:  EnemyDelta
}

export interface ChoicePool {
  id:        string
  phase:     GamePhase
  situation: string
  options:   ChoiceOption[]
}

export type PhasePoolMap = Record<string, ChoicePool>
