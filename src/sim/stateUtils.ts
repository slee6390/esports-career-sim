import type { PlayerState, TeamState, EnemyState } from './types.js'
import { rngNormal } from './rng.js'
import type { RNG } from './rng.js'

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

// ---------------------------------------------------------------------------
// Delta types — additive offsets applied to state fields
// ---------------------------------------------------------------------------

export interface PlayerDelta {
  cs?:            number
  gold?:          number
  mental?:        number
  focusModifier?: number
  kills?:         number
  deaths?:        number
  assists?:       number
}

export interface TeamDelta {
  goldDiff?:         number
  visionControl?:    number
  objectiveControl?: number
  teamSynergy?:      number
  morale?:           number
  draftScaling?:     number
}

export interface EnemyDelta {
  power?:       number
  positioning?: number
  cooldowns?:   number
  threat?:      number
}

// ---------------------------------------------------------------------------
// Applicators
// ---------------------------------------------------------------------------

export function applyPlayerDelta(s: PlayerState, d: PlayerDelta): PlayerState {
  return {
    ...s,
    cs:            s.cs            + (d.cs      ?? 0),
    gold:          s.gold          + (d.gold     ?? 0),
    mental:        clamp(s.mental        + (d.mental        ?? 0)),
    focusModifier: clamp(s.focusModifier + (d.focusModifier ?? 0), -20, 20),
    kills:         s.kills   + (d.kills   ?? 0),
    deaths:        s.deaths  + (d.deaths  ?? 0),
    assists:       s.assists + (d.assists  ?? 0),
  }
}

export function applyTeamDelta(s: TeamState, d: TeamDelta): TeamState {
  return {
    ...s,
    goldDiff:         s.goldDiff         + (d.goldDiff         ?? 0),
    visionControl:    clamp(s.visionControl    + (d.visionControl    ?? 0)),
    objectiveControl: clamp(s.objectiveControl + (d.objectiveControl ?? 0)),
    teamSynergy:      clamp(s.teamSynergy      + (d.teamSynergy      ?? 0)),
    morale:           clamp(s.morale           + (d.morale           ?? 0)),
    draftScaling:     clamp(s.draftScaling     + (d.draftScaling     ?? 0)),
  }
}

export function applyEnemyDelta(s: EnemyState, d: EnemyDelta): EnemyState {
  return {
    ...s,
    power:       clamp(s.power       + (d.power       ?? 0)),
    positioning: clamp(s.positioning + (d.positioning ?? 0)),
    cooldowns:   clamp(s.cooldowns   + (d.cooldowns   ?? 0), 0, 1),
    threat:      clamp(s.threat      + (d.threat      ?? 0)),
  }
}

// ---------------------------------------------------------------------------
// Match-start initialisation
// ---------------------------------------------------------------------------

// Rolls executionVariance from a normal distribution and zeros all match-only fields.
export function initMatchPlayer(career: PlayerState, rng: RNG): PlayerState {
  const variance = clamp(Math.round(rngNormal(rng, 0, 8)), -15, 15)
  return {
    ...career,
    executionVariance: variance,
    focusModifier: 0,
    mental: 70,
    cs: 0,
    gold: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
  }
}
