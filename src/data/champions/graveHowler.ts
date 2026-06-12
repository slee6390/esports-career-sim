import type { ChampionData } from '../../sim/types.js'

const graveHowler: ChampionData = {
  id: 'grave_howler',
  name: 'Grave Howler',
  roles: ['jungle'],
  identity: 'Early ganking bruiser. Dominates the first 15 minutes then becomes a secondary threat.',
  skills: [
    {
      name: 'Rend',
      archetype: 'singleTargetDamage',
      damage: 60,
      cooldown: 6,
      range: 'melee',
      risk: 0.3,
    },
    {
      name: 'Howl Charge',
      archetype: 'dashEngage',
      damage: 40,
      cooldown: 16,
      range: 'short',
      risk: 0.35,
      secondaryEffect: 'stun',
    },
    {
      name: 'Pack Frenzy',
      archetype: 'selfBuff',
      damage: 50,
      cooldown: 90,
      range: 'melee',
      risk: 0.4,
      secondaryEffect: 'aoeDamage',
    },
  ],
  // Strongest in lane/gank windows; diminishing returns once enemies stabilize.
  scalingCurve: {
    lane:       90,
    earlyMid:   75,
    mid:        55,
    late:       38,
    finalFight: 30,
  },
}

export default graveHowler
