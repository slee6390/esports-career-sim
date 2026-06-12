import type { GamePhase } from './types.js'

export type EventKind =
  | 'phaseStart'
  | 'phaseEnd'
  | 'kill'
  | 'death'
  | 'assist'
  | 'csGain'
  | 'goldSwing'
  | 'towerFall'
  | 'dragonTaken'
  | 'baronTaken'
  | 'visionPlaced'
  | 'visionDenied'
  | 'choicePresented'
  | 'choiceMade'
  | 'winChanceUpdate'
  | 'matchResult'

export interface GameEvent {
  kind: EventKind
  phase: GamePhase
  tick: number
  description: string
  data?: Record<string, unknown>
}

export type EventLog = GameEvent[]

export function makeEvent(
  kind: EventKind,
  phase: GamePhase,
  tick: number,
  description: string,
  data?: Record<string, unknown>,
): GameEvent {
  return { kind, phase, tick, description, data }
}
