import type { PlayerState, ChampionData } from './types.js'
import type { PlayerEvaluation } from './matchEngine.js'

export type TrainingStat = 'mechanics' | 'laning' | 'gameSense' | 'teamfight' | 'communication'

export interface MatchRecord {
  week:       number
  won:        boolean
  evaluation: PlayerEvaluation
  goldDiff:   number
}

export interface CareerState {
  champion: ChampionData
  player:   PlayerState
  history:  MatchRecord[]
  week:     number
}

const CAP = 99
const cap = (v: number) => Math.max(0, Math.min(CAP, Math.round(v)))

export function createCareer(champion: ChampionData): CareerState {
  const mastery: Record<string, number> = { [champion.id]: 68 }
  return {
    champion,
    player: {
      mechanics: 55, laning: 52, gameSense: 50, teamfight: 53, communication: 51,
      championMastery: mastery,
      form: 0,
      executionVariance: 0, focusModifier: 0,
      mental: 70, cs: 0, gold: 0, kills: 0, deaths: 0, assists: 0,
    },
    history: [],
    week: 1,
  }
}

export function applyTraining(career: CareerState, stat: TrainingStat): CareerState {
  const p = { ...career.player, [stat]: cap(career.player[stat] + 4) }
  return { ...career, player: p, week: career.week + 1 }
}

export function applyMatchResult(
  career:    CareerState,
  won:       boolean,
  evaluation: PlayerEvaluation,
  goldDiff:  number,
): CareerState {
  const p = { ...career.player }

  // Stat growth — small gains tied to what you demonstrated this match
  p.mechanics     = cap(p.mechanics     + (evaluation.kda >= 4 ? 2 : evaluation.kda >= 2 ? 1 : 0))
  p.gameSense     = cap(p.gameSense     + (evaluation.objectiveInvolvement >= 70 ? 1 : 0))
  p.laning        = cap(p.laning        + (evaluation.coachRating >= 70 ? 1 : 0))
  p.teamfight     = cap(p.teamfight     + (evaluation.fanReaction >= 70 ? 1 : 0))
  p.communication = cap(p.communication + (evaluation.coachRating >= 60 ? 1 : 0))

  // Form: win streak builds confidence, loss streak saps it
  p.form = Math.max(-20, Math.min(20, p.form + (won ? 4 : -4)))

  // Champion mastery ticks up each match played
  p.championMastery = {
    ...p.championMastery,
    [career.champion.id]: Math.min(99, (p.championMastery[career.champion.id] ?? 50) + (won ? 3 : 1)),
  }

  const record: MatchRecord = { week: career.week, won, evaluation, goldDiff }

  return { ...career, player: p, history: [...career.history, record], week: career.week + 1 }
}
