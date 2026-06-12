import type { PlayerState, TeamState, EnemyState } from './types.js'

// Tune balance by adjusting the constant here, not in formulas.
const DELTA_SCALE = 15
const GOLD_DIFF_RANGE = 5000  // ±5000 gold maps to the 0–100 scale

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function computeWinChance(
  player: PlayerState,
  team: TeamState,
  enemy: EnemyState,
): number {
  const delta = teamScore(team) + playerBonus(player) - enemyScore(enemy)
  return 1 / (1 + Math.exp(-delta / DELTA_SCALE))
}

function teamScore(team: TeamState): number {
  const goldNorm = clamp((team.goldDiff + GOLD_DIFF_RANGE) / 100, 0, 100)
  return (
    goldNorm              * 0.30 +
    team.objectiveControl * 0.25 +
    team.visionControl    * 0.15 +
    team.morale           * 0.10 +
    team.teamSynergy      * 0.10 +
    team.draftScaling     * 0.10
  )
}

function playerBonus(player: PlayerState): number {
  const base = (
    player.mechanics +
    player.laning +
    player.gameSense +
    player.teamfight +
    player.communication
  ) / 5
  const raw = clamp(base + player.executionVariance + player.focusModifier + player.form, 0, 100)
  // Centered at 50 so an average player contributes 0; range is -7.5 to +7.5.
  // Rookies (raw < 50) actively reduce win chance; stars (raw > 50) boost it.
  return (raw - 50) * 0.15
}

function enemyScore(enemy: EnemyState): number {
  return (
    enemy.power            * 0.35 +
    enemy.positioning      * 0.25 +
    enemy.threat           * 0.25 +
    (enemy.cooldowns * 100) * 0.15
  )
}

// ---------------------------------------------------------------------------
// draftScaling helper — call once per phase transition
// ---------------------------------------------------------------------------

import type { ChampionData, GamePhase } from './types.js'

export function computeDraftScaling(
  playerChampion: ChampionData,
  allies: ChampionData[],
  phase: GamePhase,
): number {
  // Player's champion is weighted 1.5× because that's the one the player influences.
  const allySum = allies.reduce((sum, c) => sum + c.scalingCurve[phase], 0)
  return (allySum + playerChampion.scalingCurve[phase] * 1.5) / (allies.length + 1.5)
}
