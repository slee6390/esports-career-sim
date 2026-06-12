import type { MatchConfig } from '../sim/matchEngine.js'
import type { ChampionData } from '../sim/types.js'
import { champions } from '../data/champions/index.js'

const DEFAULT_PLAYER_STATS = {
  mechanics: 58, laning: 55, gameSense: 52, teamfight: 56, communication: 54,
  form: 0,
  executionVariance: 0, focusModifier: 0,
  mental: 70, cs: 0, gold: 0, kills: 0, deaths: 0, assists: 0,
}

const DEFAULT_TEAM = {
  goldDiff: 0, visionControl: 50, objectiveControl: 50,
  teamSynergy: 50, morale: 55, draftScaling: 50,
}

const DEFAULT_ENEMY = {
  power: 52, positioning: 50, cooldowns: 0.5, threat: 50,
}

export function buildConfig(playerChampion: ChampionData): MatchConfig {
  const allies = champions.filter(c => c.id !== playerChampion.id)

  const mastery: Record<string, number> = {}
  for (const c of champions) mastery[c.id] = c.id === playerChampion.id ? 72 : 40

  return {
    playerChampion,
    allies,
    playerState: { ...DEFAULT_PLAYER_STATS, championMastery: mastery },
    initialTeam:  { ...DEFAULT_TEAM },
    initialEnemy: { ...DEFAULT_ENEMY },
    seed: Date.now(),
  }
}
