import type { MatchConfig } from '../sim/matchEngine.js'
import type { CareerState } from '../sim/careerEngine.js'
import { champions } from '../data/champions/index.js'

const DEFAULT_TEAM  = { goldDiff: 0, visionControl: 50, objectiveControl: 50, teamSynergy: 50, morale: 55, draftScaling: 50 }
const DEFAULT_ENEMY = { power: 52, positioning: 50, cooldowns: 0.5, threat: 50 }

export function buildConfigFromCareer(career: CareerState): MatchConfig {
  return {
    playerChampion: career.champion,
    allies:         champions.filter(c => c.id !== career.champion.id),
    playerState:    career.player,
    initialTeam:    { ...DEFAULT_TEAM },
    initialEnemy:   { ...DEFAULT_ENEMY },
    seed:           Date.now(),
  }
}
