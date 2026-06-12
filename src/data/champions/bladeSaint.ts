import type { ChampionData } from '../../sim/types.js'

const bladeSaint: ChampionData = {
  id: 'blade_saint',
  name: 'Blade Saint',
  roles: ['top', 'mid'],
  identity: 'Lane-dominant duelist. Peaks early, falls off in extended late teamfights.',
  skills: [
    {
      name: 'Steel Edge',
      archetype: 'singleTargetDamage',
      damage: 55,
      cooldown: 5,
      range: 'melee',
      risk: 0.2,
      secondaryEffect: 'selfBuff',
    },
    {
      name: 'Blade Dash',
      archetype: 'dashEngage',
      damage: 30,
      cooldown: 14,
      range: 'short',
      risk: 0.4,
    },
    {
      name: 'Sovereign Cut',
      archetype: 'execute',
      damage: 90,
      cooldown: 100,
      range: 'melee',
      risk: 0.5,
    },
  ],
  // Strong laner; loses relevance once teamfights center on burst and engage.
  scalingCurve: {
    lane:       85,
    earlyMid:   75,
    mid:        60,
    late:       50,
    finalFight: 45,
  },
}

export default bladeSaint
