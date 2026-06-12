export type ChampionId = string;
export type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support';
export type GamePhase = 'lane' | 'earlyMid' | 'mid' | 'late' | 'finalFight';

export type SkillArchetype =
  | 'singleTargetDamage'
  | 'poke'
  | 'dashEngage'
  | 'escape'
  | 'shield'
  | 'heal'
  | 'stun'
  | 'slow'
  | 'aoeDamage'
  | 'execute'
  | 'selfBuff'
  | 'peel'
  | 'vision'
  | 'objectiveBurst'
  | 'globalJoin';

export interface SkillData {
  name: string;
  archetype: SkillArchetype;
  damage: number;       // 0–100 relative scale
  cooldown: number;     // seconds
  range: 'melee' | 'short' | 'long';
  risk: number;         // 0–1; how dangerous to use
  secondaryEffect?: SkillArchetype;
}

export interface ChampionData {
  id: ChampionId;
  name: string;
  roles: Role[];
  identity: string;
  skills: [SkillData, SkillData, SkillData];  // skill1, skill2, ultimate
  scalingCurve: Record<GamePhase, number>;    // 0–100 power at each phase
}

// ---------------------------------------------------------------------------
// Match states
// ---------------------------------------------------------------------------

export interface PlayerState {
  // Career attributes — persist between matches, grow via training/evaluation
  mechanics:       number;  // 0–100
  laning:          number;  // 0–100
  gameSense:       number;  // 0–100
  teamfight:       number;  // 0–100
  communication:   number;  // 0–100
  championMastery: Record<ChampionId, number>;  // 0–100 per champion
  form:            number;  // -20 to +20; pre-match hot streak / slump

  // In-match state — reset at match start, mutable by choices and events
  executionVariance: number;  // seeded RNG draw at match start, -15 to +15
  focusModifier:     number;  // starts 0; choices add/subtract
  mental:            number;  // 0–100; live mental form
  cs:                number;
  gold:              number;
  kills:             number;
  deaths:            number;
  assists:           number;
}

export interface TeamState {
  goldDiff:         number;  // us minus enemy in raw gold (e.g. -5000 to +5000)
  visionControl:    number;  // 0–100
  objectiveControl: number;  // 0–100
  teamSynergy:      number;  // 0–100
  morale:           number;  // 0–100
  draftScaling:     number;  // 0–100; recomputed each phase from ChampionData
}

export interface EnemyState {
  power:       number;  // 0–100; team rating × meta fit × phase scaling
  positioning: number;  // 0–100
  cooldowns:   number;  // 0–1; fraction of key abilities currently available
  threat:      number;  // 0–100; combined danger for next interaction
}
