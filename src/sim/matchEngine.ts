import type { GamePhase, PlayerState, TeamState, EnemyState, ChampionData } from './types.js'
import { computeWinChance, computeDraftScaling } from './winChance.js'
import { initMatchPlayer, applyPlayerDelta, applyTeamDelta, applyEnemyDelta } from './stateUtils.js'
import { runTicks } from './phaseEngine.js'
import { makeEvent } from './events.js'
import type { EventLog, GameEvent } from './events.js'
import { makeRng } from './rng.js'
import type { RNG } from './rng.js'
import { CHOICE_POOLS } from '../data/choices.js'
import type { ChoicePool, ChoiceOption } from '../data/choices.js'

// ---------------------------------------------------------------------------
// Config and result types
// ---------------------------------------------------------------------------

export interface MatchConfig {
  playerChampion: ChampionData
  allies:         ChampionData[]   // exactly 4
  playerState:    PlayerState      // career attributes; in-match fields are reset
  initialTeam:    TeamState
  initialEnemy:   EnemyState
  seed:           number
}

export interface ChoiceRequest {
  id:        string
  phase:     GamePhase
  situation: string
  options:   ChoiceOption[]
}

export interface ChoiceSelection {
  optionId: string
}

// Yielded on each choice point — contains all events since the previous yield.
export interface MatchStep {
  newEvents:     EventLog
  choiceRequest: ChoiceRequest
  winChance:     number   // current win chance when the choice is presented
}

export interface PlayerEvaluation {
  kda:                  number   // (kills + assists) / max(1, deaths)
  csTotal:              number
  objectiveInvolvement: number   // 0–100
  coachRating:          number   // 0–100
  fanReaction:          number   // 0–100
}

export interface MatchResult {
  won:            boolean
  finalWinChance: number
  log:            EventLog
  finalPlayer:    PlayerState
  finalTeam:      TeamState
  finalEnemy:     EnemyState
  evaluation:     PlayerEvaluation
}

// ---------------------------------------------------------------------------
// Phase config
// ---------------------------------------------------------------------------

interface PhaseConfig {
  phase:           GamePhase
  ticks:           number
  choiceAfterTick: number
  choicePoolId:    string
}

const PHASE_CONFIGS: PhaseConfig[] = [
  { phase: 'lane',       ticks: 6, choiceAfterTick: 3, choicePoolId: 'lane_decision'   },
  { phase: 'earlyMid',   ticks: 4, choiceAfterTick: 2, choicePoolId: 'early_objective' },
  { phase: 'mid',        ticks: 5, choiceAfterTick: 2, choicePoolId: 'mid_fight'       },
  { phase: 'late',       ticks: 4, choiceAfterTick: 1, choicePoolId: 'late_call'       },
  { phase: 'finalFight', ticks: 3, choiceAfterTick: 1, choicePoolId: 'final_engage'    },
]

// ---------------------------------------------------------------------------
// Core generator — yields MatchStep, receives ChoiceSelection
// ---------------------------------------------------------------------------

export function* runMatchGen(
  config: MatchConfig,
  rng:    RNG,
): Generator<MatchStep, MatchResult, ChoiceSelection> {
  let player = initMatchPlayer(config.playerState, rng)
  let team   = { ...config.initialTeam }
  let enemy  = { ...config.initialEnemy }

  const fullLog: EventLog = []
  let batch:     GameEvent[] = []

  function emit(...events: GameEvent[]) {
    fullLog.push(...events)
    batch.push(...events)
  }

  function flush(): GameEvent[] {
    const b = batch
    batch = []
    return b
  }

  for (const pc of PHASE_CONFIGS) {
    team = { ...team, draftScaling: computeDraftScaling(config.playerChampion, config.allies, pc.phase) }

    emit(makeEvent('phaseStart', pc.phase, 0, `=== ${pc.phase.toUpperCase()} ===`))

    const pre = runTicks(pc.phase, 0, pc.choiceAfterTick, player, team, enemy, rng)
    player = pre.player
    team   = pre.team
    enemy  = pre.enemy
    emit(...pre.events)

    const pool: ChoicePool = CHOICE_POOLS[pc.choicePoolId]
    const choiceRequest: ChoiceRequest = {
      id: pool.id, phase: pc.phase, situation: pool.situation, options: pool.options,
    }
    emit(makeEvent('choicePresented', pc.phase, pc.choiceAfterTick, pool.situation))

    const wc = computeWinChance(player, team, enemy)
    const selection = yield { newEvents: flush(), choiceRequest, winChance: wc }

    const option = pool.options.find(o => o.id === selection.optionId)
    if (!option) throw new Error(`Unknown option: ${selection.optionId}`)

    player = applyPlayerDelta(player, option.playerDelta ?? {})
    team   = applyTeamDelta(team,     option.teamDelta   ?? {})
    enemy  = applyEnemyDelta(enemy,   option.enemyDelta  ?? {})

    emit(makeEvent('choiceMade', pc.phase, pc.choiceAfterTick, `→ ${option.text}`, { optionId: option.id }))

    const wcPost = computeWinChance(player, team, enemy)
    emit(makeEvent('winChanceUpdate', pc.phase, pc.choiceAfterTick,
      `Win chance: ${(wcPost * 100).toFixed(1)}%`, { winChance: wcPost }))

    const post = runTicks(pc.phase, pc.choiceAfterTick, pc.ticks, player, team, enemy, rng)
    player = post.player
    team   = post.team
    enemy  = post.enemy
    emit(...post.events)

    emit(makeEvent('phaseEnd', pc.phase, pc.ticks,
      `--- ${pc.phase} complete ---`))
  }

  const finalWc = computeWinChance(player, team, enemy)
  const won     = rng() < finalWc

  emit(makeEvent('matchResult', 'finalFight', 99, won ? 'VICTORY' : 'DEFEAT',
    { won, finalWinChance: finalWc }))

  return {
    won,
    finalWinChance: finalWc,
    log:       fullLog,
    finalPlayer: player,
    finalTeam:   team,
    finalEnemy:  enemy,
    evaluation:  computeEvaluation(player, team),
  }
}

// ---------------------------------------------------------------------------
// Headless wrapper — supply all choices upfront (tests & AI)
// ---------------------------------------------------------------------------

export function runMatch(
  config:  MatchConfig,
  choices: ChoiceSelection[],
  rng:     RNG,
): MatchResult {
  const gen = runMatchGen(config, rng)
  let step = gen.next()
  let idx  = 0

  while (!step.done) {
    if (idx >= choices.length) throw new Error(`Not enough choices supplied (needed index ${idx})`)
    step = gen.next(choices[idx++])
  }

  return step.value
}

export function runMatchFromSeed(config: MatchConfig, choices: ChoiceSelection[]): MatchResult {
  return runMatch(config, choices, makeRng(config.seed))
}

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

function computeEvaluation(player: PlayerState, team: TeamState): PlayerEvaluation {
  const kda = (player.kills + player.assists) / Math.max(1, player.deaths)
  const objectiveInvolvement = Math.min(100, team.objectiveControl * 0.6 + player.assists * 8)

  // Coach values stability, teamwork, and not feeding.
  // KDA contribution caps at 40 (hits ceiling around KDA 5) so synergy matters.
  const kdaScore     = Math.min(40, kda * 8)
  const synergyScore = team.teamSynergy * 0.35   // 0–35 pts
  const mentalScore  = player.mental    * 0.15   // 0–15 pts
  const objScore     = objectiveInvolvement * 0.10  // 0–10 pts
  const coachRating  = Math.round(Math.min(100, kdaScore + synergyScore + mentalScore + objScore))

  // Fans value highlight plays and team energy.
  // Kill contribution caps at 48 (~4 kills); deaths penalise; morale amplifies.
  const killScore    = Math.min(48, player.kills   * 12)
  const assistBonus  = Math.min(20, player.assists *  4)
  const deathPenalty = player.deaths * 7
  const moraleBonus  = team.morale   * 0.30   // 0–30 pts
  const fanReaction  = Math.round(Math.max(0, Math.min(100,
    killScore + assistBonus - deathPenalty + moraleBonus,
  )))

  return {
    kda:                  Math.round(kda * 100) / 100,
    csTotal:              player.cs,
    objectiveInvolvement: Math.round(objectiveInvolvement),
    coachRating:          Math.max(0, coachRating),
    fanReaction,
  }
}
