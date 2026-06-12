import type { ChampionData } from '../../sim/types.js'

const neonViper: ChampionData = {
  id: 'neon_viper',
  name: 'Neon Viper',
  roles: ['adc', 'mid'],
  identity: 'Late-game hyper carry. Weak laning; becomes the primary win condition if protected.',
  skills: [
    {
      name: 'Voltage Round',
      archetype: 'poke',
      damage: 40,
      cooldown: 8,
      range: 'long',
      risk: 0.2,
    },
    {
      name: 'Phase Step',
      archetype: 'escape',
      damage: 0,
      cooldown: 20,
      range: 'short',
      risk: 0.1,
    },
    {
      name: 'Overload',
      archetype: 'aoeDamage',
      damage: 95,
      cooldown: 120,
      range: 'long',
      risk: 0.45,
      secondaryEffect: 'execute',
    },
  ],
  // Almost no early impact; worth protecting through the lane phase.
  scalingCurve: {
    lane:       28,
    earlyMid:   42,
    mid:        60,
    late:       88,
    finalFight: 95,
  },
}

export default neonViper
