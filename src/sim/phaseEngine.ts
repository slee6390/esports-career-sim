import type { GamePhase, PlayerState, TeamState, EnemyState } from './types.js'
import { computeWinChance } from './winChance.js'
import { applyPlayerDelta, applyTeamDelta, applyEnemyDelta, clamp } from './stateUtils.js'
import type { PlayerDelta, TeamDelta, EnemyDelta } from './stateUtils.js'
import { makeEvent } from './events.js'
import type { GameEvent } from './events.js'
import type { RNG } from './rng.js'
import { rngInt, rngFloat } from './rng.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TickResult {
  events:      GameEvent[]
  playerDelta: PlayerDelta
  teamDelta:   TeamDelta
  enemyDelta:  EnemyDelta
}

export interface TicksResult {
  events: GameEvent[]
  player: PlayerState
  team:   TeamState
  enemy:  EnemyState
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function runTicks(
  phase:     GamePhase,
  startTick: number,
  endTick:   number,
  player:    PlayerState,
  team:      TeamState,
  enemy:     EnemyState,
  rng:       RNG,
): TicksResult {
  const events: GameEvent[] = []
  let p = player, t = team, e = enemy

  for (let tick = startTick; tick < endTick; tick++) {
    const wc = computeWinChance(p, t, e)
    const result = rollTick(phase, tick, p, t, e, wc, rng)

    events.push(...result.events)
    p = applyPlayerDelta(p, result.playerDelta)
    t = applyTeamDelta(t, result.teamDelta)
    e = applyEnemyDelta(e, result.enemyDelta)
  }

  return { events, player: p, team: t, enemy: e }
}

// ---------------------------------------------------------------------------
// Phase-specific tick handlers
// ---------------------------------------------------------------------------

function rollTick(
  phase: GamePhase,
  tick:  number,
  player: PlayerState,
  team:   TeamState,
  enemy:  EnemyState,
  wc:     number,
  rng:    RNG,
): TickResult {
  switch (phase) {
    case 'lane':       return laneTick(tick, player, team, enemy, wc, rng)
    case 'earlyMid':   return earlyMidTick(tick, player, team, enemy, wc, rng)
    case 'mid':        return midTick(tick, player, team, enemy, wc, rng)
    case 'late':       return lateTick(tick, player, team, enemy, wc, rng)
    case 'finalFight': return finalFightTick(tick, player, team, enemy, wc, rng)
  }
}

// ---------------------------------------------------------------------------
// Lane phase — farming, early trades, occasional skirmish
// ---------------------------------------------------------------------------

function laneTick(
  tick: number,
  player: PlayerState,
  team: TeamState,
  _enemy: EnemyState,
  wc: number,
  rng: RNG,
): TickResult {
  const events: GameEvent[] = []
  const pd: PlayerDelta = {}
  const td: TeamDelta   = {}
  const ed: EnemyDelta  = {}

  // CS gain — scaled by laning skill
  const csGain  = rngInt(rng, 14, 22) + Math.round((player.laning - 50) / 10)
  const csGold  = Math.round(csGain * 21)
  pd.cs   = csGain
  pd.gold = csGold
  td.goldDiff = rngInt(rng, -50, 100)  // small CS advantage variance; both teams farm
  events.push(makeEvent('csGain', 'lane', tick, `CS: +${csGain} (+${csGold}g)`, { csGain, gold: csGold }))

  // Kill opportunity (team) — P scales with winChance
  if (rng() < wc * 0.14) {
    const isPlayerKill = rng() < 0.45
    if (isPlayerKill) {
      pd.kills  = 1
      pd.gold   = (pd.gold ?? 0) + 300
      pd.mental = 10
    } else {
      pd.assists = 1
      pd.gold    = (pd.gold ?? 0) + 150
      pd.mental  = 5
    }
    td.goldDiff = (td.goldDiff ?? 0) + 300
    td.morale   = 10
    ed.threat   = -6
    events.push(makeEvent('kill', 'lane', tick,
      isPlayerKill ? 'You secure the solo kill. First blood advantage.' : 'Your team picks up a kill. You get the assist.',
      { playerKill: isPlayerKill }))
  }

  // Death (enemy retaliates) — P scales with how far behind
  if (rng() < (1 - wc) * 0.10) {
    pd.deaths = 1
    pd.mental = -10
    td.goldDiff = (td.goldDiff ?? 0) - 300
    td.morale   = -8
    ed.threat   = 5
    events.push(makeEvent('death', 'lane', tick, 'You get caught out. The enemy takes the kill bounty.'))
  }

  // Vision — small chance each tick
  if (rng() < 0.30) {
    const placed = rng() < (team.visionControl / 100 + 0.3)
    td.visionControl = placed ? 4 : -4
    events.push(makeEvent(
      placed ? 'visionPlaced' : 'visionDenied',
      'lane', tick,
      placed ? 'Ward placed in river. Vision secured.' : 'Enemy sweeper clears your ward.',
    ))
  }

  return { events, playerDelta: pd, teamDelta: td, enemyDelta: ed }
}

// ---------------------------------------------------------------------------
// EarlyMid phase — skirmishes, first dragon, roam potential
// ---------------------------------------------------------------------------

function earlyMidTick(
  tick: number,
  _player: PlayerState,
  team: TeamState,
  _enemy: EnemyState,
  wc: number,
  rng: RNG,
): TickResult {
  const events: GameEvent[] = []
  const pd: PlayerDelta = {}
  const td: TeamDelta   = {}
  const ed: EnemyDelta  = {}

  // Reduced CS (roaming)
  const csGain = rngInt(rng, 8, 14)
  pd.cs   = csGain
  pd.gold = csGain * 21
  events.push(makeEvent('csGain', 'earlyMid', tick, `CS: +${csGain} (roaming window)`, { csGain }))

  // Dragon contest — probability scales with objectiveControl
  const dragonP = clamp(team.objectiveControl / 100, 0, 1) * 0.35 + wc * 0.10
  if (tick >= 1 && rng() < dragonP) {
    td.objectiveControl = 10
    td.goldDiff         = 150
    td.morale           = 6
    ed.threat           = -8
    events.push(makeEvent('dragonTaken', 'earlyMid', tick,
      'Dragon secured. Objective gold and soul stack for your team.', { objective: 'dragon' }))
  }

  // Kill / skirmish
  if (rng() < wc * 0.18) {
    pd.kills  = rng() < 0.5 ? 1 : 0
    pd.assists = pd.kills ? 0 : 1
    pd.mental = 8
    td.goldDiff = (td.goldDiff ?? 0) + rngInt(rng, 150, 300)
    td.morale   = 10
    ed.threat   = -5
    events.push(makeEvent('kill', 'earlyMid', tick, 'Skirmish win — numbers advantage pays off.'))
  } else if (rng() < (1 - wc) * 0.12) {
    pd.deaths = 1
    pd.mental = -8
    td.morale = -10
    td.goldDiff = (td.goldDiff ?? 0) - 300
    events.push(makeEvent('death', 'earlyMid', tick, 'Caught in a bad position during the skirmish.'))
  }

  return { events, playerDelta: pd, teamDelta: td, enemyDelta: ed }
}

// ---------------------------------------------------------------------------
// Mid phase — teamfights, baron setup, macro decisions
// ---------------------------------------------------------------------------

function midTick(
  tick: number,
  _player: PlayerState,
  _team: TeamState,
  _enemy: EnemyState,
  wc: number,
  rng: RNG,
): TickResult {
  const events: GameEvent[] = []
  const pd: PlayerDelta = {}
  const td: TeamDelta   = {}
  const ed: EnemyDelta  = {}

  // Teamfight — high variance, multiple participants
  if (tick >= 1 && rng() < 0.45) {
    const fightWon = rng() < wc
    const killsGained = fightWon ? rngInt(rng, 1, 3) : rngInt(rng, 0, 1)
    const deathsTaken = fightWon ? rngInt(rng, 0, 1) : rngInt(rng, 1, 2)
    const goldSwing   = fightWon
      ? rngInt(rng, 200, 550)
      : -rngInt(rng, 150, 400)

    pd.kills  = killsGained > 0 && rng() < 0.5 ? 1 : 0
    pd.assists = killsGained - (pd.kills ?? 0)
    pd.deaths  = deathsTaken > 0 && rng() < 0.4 ? 1 : 0
    pd.mental  = fightWon ? 12 : -10

    td.goldDiff = goldSwing
    td.morale   = fightWon ? rngInt(rng, 12, 20) : -rngInt(rng, 8, 15)
    td.objectiveControl = fightWon ? rngInt(rng, 8, 18) : 0
    ed.positioning = fightWon ? -rngInt(rng, 12, 20) : rngInt(rng, 8, 15)
    ed.cooldowns   = rngFloat(rng, -0.3, -0.1)

    events.push(makeEvent(fightWon ? 'kill' : 'death', 'mid', tick,
      fightWon
        ? `Teamfight win. ${killsGained}K/${deathsTaken}D. Gold swing: +${goldSwing}g.`
        : `Teamfight loss. ${killsGained}K/${deathsTaken}D. Gold swing: ${goldSwing}g.`,
      { fightWon, killsGained, deathsTaken, goldSwing }))
  }

  // Tower pressure
  if (rng() < wc * 0.20) {
    td.objectiveControl = (td.objectiveControl ?? 0) + 10
    td.goldDiff         = (td.goldDiff ?? 0) + rngInt(rng, 80, 180)
    events.push(makeEvent('towerFall', 'mid', tick, 'Tower taken. Map pressure increases.'))
  }

  return { events, playerDelta: pd, teamDelta: td, enemyDelta: ed }
}

// ---------------------------------------------------------------------------
// Late phase — baron, elder, inhibitor pressure
// ---------------------------------------------------------------------------

function lateTick(
  tick: number,
  _player: PlayerState,
  team: TeamState,
  _enemy: EnemyState,
  wc: number,
  rng: RNG,
): TickResult {
  const events: GameEvent[] = []
  const pd: PlayerDelta = {}
  const td: TeamDelta   = {}
  const ed: EnemyDelta  = {}

  // Baron attempt — probability based on objectiveControl
  const baronP = (team.objectiveControl / 100) * 0.40 + wc * 0.15
  if (tick >= 1 && rng() < baronP) {
    const baronSecured = rng() < wc
    if (baronSecured) {
      td.objectiveControl = 18
      td.goldDiff         = rngInt(rng, 400, 700)
      td.morale           = 10
      ed.threat           = -10
      pd.mental           = 8
      events.push(makeEvent('baronTaken', 'late', tick,
        'Baron Nashor secured! Empowered minions begin pushing all lanes.', { secured: true }))
    } else {
      pd.deaths = 1
      pd.mental = -10
      td.morale = -10
      td.goldDiff = (td.goldDiff ?? 0) - 200
      ed.threat  = 15
      ed.positioning = 20
      events.push(makeEvent('death', 'late', tick,
        'Baron attempt fails. Enemy collapses and cleans up the overextension.', { secured: false }))
    }
  }

  // General gold accumulation
  const passiveGold = rngInt(rng, 50, 150)
  td.goldDiff = (td.goldDiff ?? 0) + (wc > 0.5 ? passiveGold : -passiveGold)

  return { events, playerDelta: pd, teamDelta: td, enemyDelta: ed }
}

// ---------------------------------------------------------------------------
// FinalFight phase — climactic teamfight sequence
// ---------------------------------------------------------------------------

function finalFightTick(
  tick: number,
  _player: PlayerState,
  _team: TeamState,
  _enemy: EnemyState,
  wc: number,
  rng: RNG,
): TickResult {
  const events: GameEvent[] = []
  const pd: PlayerDelta = {}
  const td: TeamDelta   = {}
  const ed: EnemyDelta  = {}

  if (tick === 0) {
    // Both sides position
    const betterPositioned = rng() < wc
    td.objectiveControl = betterPositioned ? 10 : -5
    ed.positioning      = betterPositioned ? -15 : 10
    events.push(makeEvent('visionPlaced', 'finalFight', tick,
      betterPositioned
        ? 'Your team establishes vision control. You have the angle.'
        : 'The enemy takes the high ground. Their positioning looks dangerous.'))
  }

  if (tick >= 1) {
    // Decisive fight breaks out
    const fought = rng() < 0.85
    if (fought) {
      const fightWon = rng() < wc
      const kills    = fightWon ? rngInt(rng, 2, 4) : rngInt(rng, 0, 2)
      const deaths   = fightWon ? rngInt(rng, 0, 2) : rngInt(rng, 2, 4)
      const gold     = fightWon ? rngInt(rng, 400, 900) : -rngInt(rng, 300, 700)

      pd.kills   = kills > 0 && rng() < 0.6 ? rngInt(rng, 1, Math.min(2, kills)) : 0
      pd.assists = Math.max(0, kills - (pd.kills ?? 0))
      pd.deaths  = deaths > 0 && rng() < 0.5 ? 1 : 0
      pd.mental  = fightWon ? 20 : -18

      td.goldDiff         = gold
      td.morale           = fightWon ? 15 : -15
      td.objectiveControl = fightWon ? 15 : -12
      ed.threat           = fightWon ? -25 : 20
      ed.positioning      = fightWon ? -20 : 15

      events.push(makeEvent(fightWon ? 'kill' : 'death', 'finalFight', tick,
        fightWon
          ? `TEAMFIGHT WON — ${kills}K/${deaths}D. The enemy nexus is open.`
          : `TEAMFIGHT LOST — ${kills}K/${deaths}D. Your team is scrambling to defend.`,
        { fightWon, kills, deaths, gold }))
    }
  }

  return { events, playerDelta: pd, teamDelta: td, enemyDelta: ed }
}
