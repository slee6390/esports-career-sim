import type { ChampionData } from '../../sim/types.js'

const starOracle: ChampionData = {
  id: 'star_oracle',
  name: 'Star Oracle',
  roles: ['support', 'mid'],
  identity: 'Utility controller. Weak laner; vision and objective bonuses compound into late game.',
  skills: [
    {
      name: 'Omen Bolt',
      archetype: 'poke',
      damage: 35,
      cooldown: 7,
      range: 'long',
      risk: 0.15,
    },
    {
      name: 'Starfield',
      archetype: 'vision',
      damage: 0,
      cooldown: 18,
      range: 'long',
      risk: 0.05,
      secondaryEffect: 'slow',
    },
    {
      name: 'Celestial Ward',
      archetype: 'shield',
      damage: 0,
      cooldown: 110,
      range: 'short',
      risk: 0.1,
      secondaryEffect: 'peel',
    },
  ],
  // Laning is passive; influence grows as macro levers (vision, objectives) matter more.
  scalingCurve: {
    lane:       40,
    earlyMid:   55,
    mid:        70,
    late:       80,
    finalFight: 85,
  },
}

export default starOracle
