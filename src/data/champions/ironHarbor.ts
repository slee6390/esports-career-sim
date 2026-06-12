import type { ChampionData } from '../../sim/types.js'

const ironHarbor: ChampionData = {
  id: 'iron_harbor',
  name: 'Iron Harbor',
  roles: ['top', 'support'],
  identity: 'Tank initiator. Consistent throughout the game; peak value in 5v5 teamfights.',
  skills: [
    {
      name: 'Iron Bulwark',
      archetype: 'shield',
      damage: 0,
      cooldown: 10,
      range: 'short',
      risk: 0.1,
      secondaryEffect: 'peel',
    },
    {
      name: 'Harbor Slam',
      archetype: 'stun',
      damage: 45,
      cooldown: 14,
      range: 'melee',
      risk: 0.3,
    },
    {
      name: 'Tidal Crash',
      archetype: 'dashEngage',
      damage: 60,
      cooldown: 100,
      range: 'long',
      risk: 0.5,
      secondaryEffect: 'aoeDamage',
    },
  ],
  // Steady curve; initiating full teamfights is where this champion truly shines.
  scalingCurve: {
    lane:       58,
    earlyMid:   62,
    mid:        68,
    late:       74,
    finalFight: 82,
  },
}

export default ironHarbor
