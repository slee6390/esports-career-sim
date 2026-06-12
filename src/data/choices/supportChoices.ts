import type { PhasePoolMap } from './types.js'

export const supportPools: PhasePoolMap = {
  lane_decision: {
    id: 'lane_decision', phase: 'lane',
    situation: "Enemy bot lane is playing aggressive. You have your engage available and they're overextended.",
    options: [
      {
        id: 'lane_aggressive', text: 'Engage — go for first blood.',
        description: 'Your hook is up. If it lands, your ADC takes the kill.',
        playerDelta: { assists: 1, mental: 6 },
        teamDelta:   { goldDiff: 130, morale: 6, teamSynergy: 5 },
        enemyDelta:  { threat: -6, positioning: -10 },
      },
      {
        id: 'lane_safe', text: 'Deep ward their jungle instead.',
        description: 'The information is more valuable than a risky trade right now.',
        playerDelta: { mental: 3 },
        teamDelta:   { visionControl: 12, objectiveControl: 5, teamSynergy: 5 },
        enemyDelta:  { positioning: -8 },
      },
      {
        id: 'lane_rotate', text: 'Shield the ADC and let them farm freely.',
        description: 'Play passive. Give your ADC a clean CS window.',
        playerDelta: { mental: 2 },
        teamDelta:   { goldDiff: 110, teamSynergy: 4, morale: 3 },
      },
    ],
  },

  early_objective: {
    id: 'early_objective', phase: 'earlyMid',
    situation: "Dragon spawns in 45 seconds. You can roam mid, ward the pit, or help your ADC take the tower.",
    options: [
      {
        id: 'early_group', text: 'Roam mid, then rotate to dragon.',
        description: 'Help your mid laner and arrive at dragon with numbers.',
        playerDelta: { assists: 1, mental: 4 },
        teamDelta:   { teamSynergy: 7, objectiveControl: 8, morale: 5 },
        enemyDelta:  { positioning: -5 },
      },
      {
        id: 'early_ward', text: 'Ward the dragon pit and tribush now.',
        description: 'Vision wins the objective fight before it starts.',
        playerDelta: { mental: 3 },
        teamDelta:   { visionControl: 14, objectiveControl: 8, teamSynergy: 5 },
        enemyDelta:  { positioning: -8 },
      },
      {
        id: 'early_pressure', text: 'Stay bot — help ADC take the tower.',
        description: 'Tower plates give guaranteed gold. Then you rotate together.',
        playerDelta: { assists: 1, mental: 2 },
        teamDelta:   { goldDiff: 160, objectiveControl: 5, teamSynergy: 4 },
      },
    ],
  },

  mid_fight: {
    id: 'mid_fight', phase: 'mid',
    situation: "Teamfight breaks out in the mid river. You have your ultimate up. Your ADC is safely positioned.",
    options: [
      {
        id: 'mid_baron_now', text: 'Initiate with your ultimate.',
        description: "Hard engage. Your team has the numbers advantage right now.",
        playerDelta: { assists: 1, mental: 5 },
        teamDelta:   { morale: 8, objectiveControl: 8, goldDiff: 250, teamSynergy: -4 },
        enemyDelta:  { positioning: -15, threat: -10 },
      },
      {
        id: 'mid_bait', text: 'Peel and shield your ADC.',
        description: 'Stay on your carry. Let the frontline engage, you keep the ADC alive.',
        playerDelta: { assists: 1, mental: 6 },
        teamDelta:   { teamSynergy: 8, morale: 6, goldDiff: 200 },
        enemyDelta:  { threat: -6 },
      },
      {
        id: 'mid_delay', text: 'Flank from the side — unexpected angle.',
        description: 'Circle around and engage their backline from fog of war.',
        playerDelta: { kills: 1, mental: 5 },
        teamDelta:   { morale: 8, objectiveControl: 7, goldDiff: 240, teamSynergy: -5 },
        enemyDelta:  { positioning: -14, threat: -8 },
      },
    ],
  },

  late_call: {
    id: 'late_call', phase: 'late',
    situation: "You're setting up baron vision. Enemy support is contesting your wards.",
    options: [
      {
        id: 'late_flank', text: 'Fight for the ward — contest aggressively.',
        description: "Don't let them have baron vision. Trade yours for theirs.",
        playerDelta: { mental: 5 },
        teamDelta:   { visionControl: 14, objectiveControl: 8, teamSynergy: -4, morale: 5 },
        enemyDelta:  { positioning: -10, threat: -8 },
      },
      {
        id: 'late_siege', text: 'Call your team to come contest together.',
        description: "Don't go alone. Group up and take vision control as five.",
        playerDelta: { mental: 3 },
        teamDelta:   { visionControl: 8, objectiveControl: 8, teamSynergy: 8, morale: 4 },
      },
      {
        id: 'late_baron', text: 'Place safe wards and disengage.',
        description: "Don't risk dying. Maintain what you have and stay alive.",
        playerDelta: { mental: 2 },
        teamDelta:   { visionControl: 10, objectiveControl: 5, teamSynergy: 5 },
        enemyDelta:  { positioning: -4 },
      },
    ],
  },

  final_engage: {
    id: 'final_engage', phase: 'finalFight',
    situation: "Final teamfight. Your ADC is perfectly positioned. Do you initiate or protect?",
    options: [
      {
        id: 'final_hard_engage', text: 'Initiate with your ultimate — start the fight.',
        description: "Hard engage. Give your carries the best possible target.",
        playerDelta: { assists: 1, mental: 8 },
        teamDelta:   { morale: 10, objectiveControl: 8, goldDiff: 350, teamSynergy: -4 },
        enemyDelta:  { positioning: -20, threat: -14 },
      },
      {
        id: 'final_kite', text: 'Peel for your ADC — keep them alive.',
        description: "Your carry wins the game if they stay healthy. Shield and peel.",
        playerDelta: { assists: 1, mental: 6 },
        teamDelta:   { teamSynergy: 10, morale: 6, goldDiff: 220 },
        enemyDelta:  { threat: -8 },
      },
      {
        id: 'final_reset', text: 'Look for an isolated pick before the main fight.',
        description: 'Catch one of their players out of position and start a 5v4.',
        playerDelta: { kills: 1, mental: 5 },
        teamDelta:   { morale: 8, objectiveControl: 7, goldDiff: 260, teamSynergy: -4 },
        enemyDelta:  { positioning: -12, threat: -8 },
      },
    ],
  },
}
