import type { PhasePoolMap } from './types.js'

export const genericPools: PhasePoolMap = {
  lane_decision: {
    id: 'lane_decision', phase: 'lane',
    situation: 'The enemy laner is overstaying past the midpoint wave. Do you punish?',
    options: [
      {
        id: 'lane_aggressive', text: 'Go for the solo kill.',
        description: 'High risk. You could snowball hard or throw your lead.',
        playerDelta: { kills: 1, gold: 300, mental: 6 },
        teamDelta:   { goldDiff: 130, morale: 5, teamSynergy: -4 },
        enemyDelta:  { threat: -5, positioning: -8 },
      },
      {
        id: 'lane_safe', text: 'Farm safely and ping missing.',
        description: 'You keep your CS lead and give your team information.',
        playerDelta: { cs: 18, gold: 280 },
        teamDelta:   { goldDiff: 110, visionControl: 5 },
      },
      {
        id: 'lane_rotate', text: 'Let it go. Rotate to help mid.',
        description: 'Sacrifice lane CS to create a numbers advantage elsewhere.',
        playerDelta: { cs: -10, assists: 1, mental: 3 },
        teamDelta:   { goldDiff: 80, teamSynergy: 8, morale: 4 },
      },
    ],
  },

  early_objective: {
    id: 'early_objective', phase: 'earlyMid',
    situation: 'Dragon spawns in 30 seconds. Your team is pinging you to group.',
    options: [
      {
        id: 'early_group', text: 'Group for dragon now.',
        description: 'Teamwork pays off — if you win the fight.',
        playerDelta: { assists: 1, mental: 4 },
        teamDelta:   { objectiveControl: 8, morale: 5, teamSynergy: 6, goldDiff: 200 },
        enemyDelta:  { threat: -4 },
      },
      {
        id: 'early_pressure', text: "Push mid first. I'll be there.",
        description: 'You delay, but arrive with extra pressure on the tower.',
        playerDelta: { cs: 12, gold: 200 },
        teamDelta:   { goldDiff: 160, objectiveControl: 4, teamSynergy: -6 },
      },
      {
        id: 'early_ward', text: 'Ward the dragon pit first.',
        description: 'Vision wins macro games. You get there safely.',
        playerDelta: { mental: 2 },
        teamDelta:   { visionControl: 10, objectiveControl: 6, teamSynergy: 4 },
        enemyDelta:  { positioning: -6 },
      },
    ],
  },

  mid_fight: {
    id: 'mid_fight', phase: 'mid',
    situation: 'Baron Nashor has just spawned. The enemy team is split across the map.',
    options: [
      {
        id: 'mid_baron_now', text: 'Start baron immediately.',
        description: 'If the call lands, the game swings hard in your favor.',
        playerDelta: { mental: -4, assists: 1 },
        teamDelta:   { objectiveControl: 14, goldDiff: 350, morale: 7, teamSynergy: -5 },
        enemyDelta:  { threat: -8, positioning: -10 },
      },
      {
        id: 'mid_bait', text: 'Fake baron. Fight if they come.',
        description: 'Bait them into a bad engage and punish the mistake.',
        playerDelta: { kills: 1, mental: 7 },
        teamDelta:   { goldDiff: 250, morale: 8, objectiveControl: 7 },
        enemyDelta:  { threat: -6 },
      },
      {
        id: 'mid_delay', text: 'Not yet. Vision and next spawn.',
        description: "Play it safe. You'll get baron next time with better setup.",
        playerDelta: { mental: 2 },
        teamDelta:   { visionControl: 8, objectiveControl: 3, teamSynergy: 5 },
        enemyDelta:  { positioning: -4 },
      },
    ],
  },

  late_call: {
    id: 'late_call', phase: 'late',
    situation: "Your team has a gold lead. The enemy is scattered. How do you close this out?",
    options: [
      {
        id: 'late_flank', text: 'Solo flank. Make the highlight play.',
        description: 'High risk, high reward. Fans love it. Coaches might not.',
        playerDelta: { kills: 1, mental: 8 },
        teamDelta:   { goldDiff: 280, morale: 8, teamSynergy: -8 },
        enemyDelta:  { threat: -10, positioning: -12 },
      },
      {
        id: 'late_baron', text: 'Force baron right now.',
        description: 'Convert the lead into a concrete objective.',
        teamDelta: { objectiveControl: 12, goldDiff: 400, morale: 5 },
        enemyDelta: { threat: -6 },
      },
      {
        id: 'late_siege', text: 'Group and siege methodically.',
        description: 'Slower, but the team stays together and the lead compounds.',
        teamDelta: { teamSynergy: 8, objectiveControl: 10, goldDiff: 240, morale: 4 },
      },
    ],
  },

  final_engage: {
    id: 'final_engage', phase: 'finalFight',
    situation: 'Final teamfight. Everything is on the line. How do you play it?',
    options: [
      {
        id: 'final_hard_engage', text: 'Hard engage. Go in now.',
        description: "All or nothing. If your team follows, it's over.",
        playerDelta: { kills: 1, mental: 10 },
        teamDelta:   { morale: 10, objectiveControl: 8, goldDiff: 350, teamSynergy: -4 },
        enemyDelta:  { positioning: -18, threat: -14 },
      },
      {
        id: 'final_kite', text: 'Kite back and pick off stragglers.',
        description: 'Patient play. Let them overextend.',
        playerDelta: { kills: 1, assists: 1, mental: 6 },
        teamDelta:   { goldDiff: 240, morale: 6, visionControl: 6 },
        enemyDelta:  { positioning: -10, threat: -8 },
      },
      {
        id: 'final_reset', text: 'Call a reset. Regroup and try again.',
        description: 'Safe, but you lose tempo. Still might be the right call.',
        playerDelta: { mental: -5 },
        teamDelta:   { morale: -6, teamSynergy: 6, visionControl: 8 },
        enemyDelta:  { positioning: 4 },
      },
    ],
  },
}
