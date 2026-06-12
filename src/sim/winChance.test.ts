import { describe, it, expect } from 'vitest'
import { computeWinChance, computeDraftScaling } from './winChance.js'
import type { PlayerState, TeamState, EnemyState, ChampionData } from './types.js'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

// Neutral player: all career attributes at 50, no in-match modifiers.
// With all states mirrored at 50, delta should be 0 → winChance ≈ 0.5.
const P: PlayerState = {
  mechanics: 50, laning: 50, gameSense: 50, teamfight: 50, communication: 50,
  championMastery: {}, form: 0,
  executionVariance: 0, focusModifier: 0,
  mental: 50, cs: 0, gold: 0, kills: 0, deaths: 0, assists: 0,
}

const T: TeamState = {
  goldDiff: 0, visionControl: 50, objectiveControl: 50,
  teamSynergy: 50, morale: 50, draftScaling: 50,
}

const E: EnemyState = {
  power: 50, positioning: 50, cooldowns: 0.5, threat: 50,
}

// ---------------------------------------------------------------------------
// computeWinChance
// ---------------------------------------------------------------------------

describe('computeWinChance', () => {
  it('returns ~0.5 on an evenly matched state', () => {
    expect(computeWinChance(P, T, E)).toBeCloseTo(0.5, 1)
  })

  it('exceeds 0.5 when team holds a large gold lead', () => {
    expect(computeWinChance(P, { ...T, goldDiff: 4000 }, E)).toBeGreaterThan(0.5)
  })

  it('falls below 0.5 when enemy power and threat are high', () => {
    expect(computeWinChance(P, T, { ...E, power: 90, threat: 90 })).toBeLessThan(0.5)
  })

  it('always stays strictly between 0 and 1', () => {
    const worst = computeWinChance(
      P,
      { ...T, goldDiff: -5000, morale: 0, objectiveControl: 0, visionControl: 0 },
      { ...E, power: 100, threat: 100, cooldowns: 1 },
    )
    expect(worst).toBeGreaterThan(0)
    expect(worst).toBeLessThan(1)

    const best = computeWinChance(
      P,
      { ...T, goldDiff: 5000, morale: 100, objectiveControl: 100, visionControl: 100 },
      { ...E, power: 0, threat: 0, cooldowns: 0 },
    )
    expect(best).toBeGreaterThan(0)
    expect(best).toBeLessThan(1)
  })

  it('higher executionVariance raises win chance', () => {
    const lo = computeWinChance({ ...P, executionVariance: -15 }, T, E)
    const hi = computeWinChance({ ...P, executionVariance:  15 }, T, E)
    expect(hi).toBeGreaterThan(lo)
  })

  it('positive focusModifier raises win chance', () => {
    const base  = computeWinChance(P, T, E)
    const focus = computeWinChance({ ...P, focusModifier: 10 }, T, E)
    expect(focus).toBeGreaterThan(base)
  })

  it('positive form raises win chance', () => {
    const slump  = computeWinChance({ ...P, form: -20 }, T, E)
    const streak = computeWinChance({ ...P, form:  20 }, T, E)
    expect(streak).toBeGreaterThan(slump)
  })

  it('enemy cooldowns at 0 (all on CD) lowers enemy score and raises win chance', () => {
    const allUp = computeWinChance(P, T, { ...E, cooldowns: 1.0 })
    const allCD = computeWinChance(P, T, { ...E, cooldowns: 0.0 })
    expect(allCD).toBeGreaterThan(allUp)
  })
})

// ---------------------------------------------------------------------------
// computeDraftScaling
// ---------------------------------------------------------------------------

const scaleCurve = (
  lane: number, earlyMid: number, mid: number, late: number, finalFight: number,
): ChampionData['scalingCurve'] => ({ lane, earlyMid, mid, late, finalFight })

const makeChamp = (id: string, curve: ChampionData['scalingCurve']): ChampionData => ({
  id, name: id, roles: ['mid'], identity: '',
  skills: [
    { name: 's1', archetype: 'poke', damage: 40, cooldown: 6, range: 'long', risk: 0.2 },
    { name: 's2', archetype: 'escape', damage: 0, cooldown: 12, range: 'short', risk: 0.1 },
    { name: 'ult', archetype: 'aoeDamage', damage: 80, cooldown: 90, range: 'long', risk: 0.5 },
  ],
  scalingCurve: curve,
})

describe('computeDraftScaling', () => {
  it('weights the player champion 1.5× vs allies', () => {
    const player = makeChamp('p', scaleCurve(100, 100, 100, 100, 100))
    const allies = [
      makeChamp('a1', scaleCurve(0, 0, 0, 0, 0)),
      makeChamp('a2', scaleCurve(0, 0, 0, 0, 0)),
      makeChamp('a3', scaleCurve(0, 0, 0, 0, 0)),
      makeChamp('a4', scaleCurve(0, 0, 0, 0, 0)),
    ]
    // 4 allies at 0, player at 100 weight 1.5 → 150 / 5.5 ≈ 27.3
    const result = computeDraftScaling(player, allies, 'lane')
    expect(result).toBeCloseTo(150 / 5.5, 5)
  })

  it('late-scaling team scores higher in finalFight than lane', () => {
    const carry = makeChamp('carry', scaleCurve(30, 45, 60, 90, 95))
    const others = [
      makeChamp('o1', scaleCurve(30, 50, 65, 80, 85)),
      makeChamp('o2', scaleCurve(30, 50, 65, 80, 85)),
      makeChamp('o3', scaleCurve(30, 50, 65, 80, 85)),
      makeChamp('o4', scaleCurve(30, 50, 65, 80, 85)),
    ]
    const laneScore  = computeDraftScaling(carry, others, 'lane')
    const finalScore = computeDraftScaling(carry, others, 'finalFight')
    expect(finalScore).toBeGreaterThan(laneScore)
  })
})
