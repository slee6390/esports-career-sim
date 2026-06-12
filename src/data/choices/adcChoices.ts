import type { PhasePoolMap } from './types.js'

export const adcPools: PhasePoolMap = {
  lane_decision: {
    id: 'lane_decision', phase: 'lane',
    situation: "You're up 20 CS on the enemy ADC. They're playing forward despite being behind.",
    options: [
      {
        id: 'lane_aggressive', text: 'Punish their aggression — trade back hard.',
        description: 'You have the stat lead. Make them pay for stepping up.',
        playerDelta: { kills: 1, gold: 300, mental: 7 },
        teamDelta:   { goldDiff: 140, morale: 6, teamSynergy: -4 },
        enemyDelta:  { threat: -6, positioning: -10 },
      },
      {
        id: 'lane_safe', text: 'Freeze the wave under your tower.',
        description: 'Deny them CS by keeping the wave frozen. Safer, but slower.',
        playerDelta: { cs: 18, gold: 260, mental: 3 },
        teamDelta:   { goldDiff: 110, visionControl: 4 },
      },
      {
        id: 'lane_rotate', text: 'Call for your support to all-in.',
        description: "Coordinate with support for a clean kill. Let them take the risk.",
        playerDelta: { kills: 1, assists: 0, mental: 5 },
        teamDelta:   { goldDiff: 150, teamSynergy: 7, morale: 5 },
        enemyDelta:  { threat: -5, positioning: -8 },
      },
    ],
  },

  early_objective: {
    id: 'early_objective', phase: 'earlyMid',
    situation: "Dragon fight in 30 seconds. Enemy bot lane just pushed you under tower and recalled.",
    options: [
      {
        id: 'early_group', text: 'Group for dragon immediately.',
        description: 'Your team needs all five. Sprint to dragon now.',
        playerDelta: { assists: 1, mental: 4 },
        teamDelta:   { objectiveControl: 8, morale: 5, teamSynergy: 6, goldDiff: 180 },
        enemyDelta:  { threat: -4 },
      },
      {
        id: 'early_pressure', text: 'Push the tower first, then rotate.',
        description: 'Get the plate gold while they recalled. Then join dragon.',
        playerDelta: { cs: 10, gold: 180 },
        teamDelta:   { goldDiff: 180, objectiveControl: 5, teamSynergy: -5 },
      },
      {
        id: 'early_ward', text: 'Ward dragon approaches as you rotate.',
        description: "Take your time. Set vision so you don't get caught on the way.",
        playerDelta: { mental: 2 },
        teamDelta:   { visionControl: 10, objectiveControl: 7, teamSynergy: 5 },
        enemyDelta:  { positioning: -5 },
      },
    ],
  },

  mid_fight: {
    id: 'mid_fight', phase: 'mid',
    situation: "Teamfight breaks out. You're at 65% HP and your team is engaging.",
    options: [
      {
        id: 'mid_baron_now', text: 'Flash in — commit to the fight.',
        description: "Your team needs your damage. Flash forward and carry.",
        playerDelta: { kills: 1, mental: 8 },
        teamDelta:   { goldDiff: 280, morale: 8, objectiveControl: 8, teamSynergy: -4 },
        enemyDelta:  { positioning: -12, threat: -10 },
      },
      {
        id: 'mid_bait', text: 'Kite from max range — sustained DPS.',
        description: "Stay safe. Your damage matters more if you survive the fight.",
        playerDelta: { assists: 1, mental: 6 },
        teamDelta:   { goldDiff: 220, morale: 6, teamSynergy: 6 },
        enemyDelta:  { threat: -6 },
      },
      {
        id: 'mid_delay', text: 'Back off — force them to disengage.',
        description: 'You missing from the fight pulls them back too. Reset and try again.',
        playerDelta: { mental: -4 },
        teamDelta:   { morale: -6, teamSynergy: 4, visionControl: 5 },
        enemyDelta:  { positioning: 3 },
      },
    ],
  },

  late_call: {
    id: 'late_call', phase: 'late',
    situation: "You're fully itemized. You're the win condition. Your team wants to fight.",
    options: [
      {
        id: 'late_flank', text: 'Flash aggressive — make the carry play.',
        description: 'Show your fans what you can do. High risk, maximum impact.',
        playerDelta: { kills: 1, mental: 10 },
        teamDelta:   { goldDiff: 300, morale: 10, teamSynergy: -8 },
        enemyDelta:  { threat: -12, positioning: -14 },
      },
      {
        id: 'late_baron', text: 'Hypercarry positioning — deal maximum DPS.',
        description: 'Stay safe at max range. You do the most damage if you survive.',
        playerDelta: { assists: 1, mental: 6 },
        teamDelta:   { goldDiff: 240, morale: 6, teamSynergy: 6 },
        enemyDelta:  { threat: -6 },
      },
      {
        id: 'late_siege', text: 'Request peel — ask support to stay on you.',
        description: 'Tell your team your positioning needs. Play as a unit.',
        playerDelta: { mental: 4 },
        teamDelta:   { teamSynergy: 10, morale: 4, goldDiff: 200 },
      },
    ],
  },

  final_engage: {
    id: 'final_engage', phase: 'finalFight',
    situation: "Final teamfight. You're fully stacked. You have a clear angle on their backline.",
    options: [
      {
        id: 'final_hard_engage', text: 'Hypercarry — perfect kiting, maximum output.',
        description: "This is what you scaled for. Stay healthy and deal consistent damage.",
        playerDelta: { kills: 1, assists: 1, mental: 10 },
        teamDelta:   { goldDiff: 350, morale: 10, objectiveControl: 8, teamSynergy: -4 },
        enemyDelta:  { positioning: -14, threat: -14 },
      },
      {
        id: 'final_kite', text: 'Play safe — let your support enable you.',
        description: 'Trust your team. Deal damage from the back, stay alive.',
        playerDelta: { assists: 1, mental: 6 },
        teamDelta:   { teamSynergy: 8, morale: 6, goldDiff: 220 },
        enemyDelta:  { threat: -8 },
      },
      {
        id: 'final_reset', text: 'Flash onto their backline carry.',
        description: "High risk play — go for their ADC directly. Fans will remember this.",
        playerDelta: { kills: 1, mental: 8 },
        teamDelta:   { morale: 10, goldDiff: 280, teamSynergy: -8 },
        enemyDelta:  { positioning: -18, threat: -10 },
      },
    ],
  },
}
