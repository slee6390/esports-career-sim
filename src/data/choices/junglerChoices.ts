import type { PhasePoolMap } from './types.js'

export const junglerPools: PhasePoolMap = {
  lane_decision: {
    id: 'lane_decision', phase: 'lane',
    situation: 'Enemy jungler invaded your blue side and burned your mid\'s flash. You can counter-invade or set up a gank.',
    options: [
      {
        id: 'lane_aggressive', text: 'Counter-invade their red side.',
        description: 'Steal their camps and deny their income. High risk of a 1v1.',
        playerDelta: { kills: 1, gold: 200, mental: 6 },
        teamDelta:   { goldDiff: 150, morale: 5, teamSynergy: -4 },
        enemyDelta:  { threat: -6, positioning: -8 },
      },
      {
        id: 'lane_safe', text: 'Set up a gank bot lane.',
        description: 'Sacrifice clear tempo to give your ADC a kill opportunity.',
        playerDelta: { assists: 1, mental: 4 },
        teamDelta:   { goldDiff: 130, teamSynergy: 7, morale: 5 },
        enemyDelta:  { positioning: -6 },
      },
      {
        id: 'lane_rotate', text: 'Farm your side safely.',
        description: "Don't take risks. Stay healthy and scale into mid game.",
        playerDelta: { cs: 14, gold: 200, mental: 2 },
        teamDelta:   { goldDiff: 80 },
      },
    ],
  },

  early_objective: {
    id: 'early_objective', phase: 'earlyMid',
    situation: 'Scuttle Crab spawns in 15 seconds. Enemy jungler is farming their bot side.',
    options: [
      {
        id: 'early_group', text: 'Contest scuttle with mid priority.',
        description: 'River control sets up the next dragon fight. Your mid has wave advantage.',
        playerDelta: { mental: 4 },
        teamDelta:   { visionControl: 12, objectiveControl: 8, morale: 5 },
        enemyDelta:  { positioning: -6 },
      },
      {
        id: 'early_pressure', text: 'Let scuttle go — take their bot camps.',
        description: "Trade the objective for their jungle. You come out ahead in gold.",
        playerDelta: { cs: 14, gold: 200 },
        teamDelta:   { goldDiff: 180, objectiveControl: 4, teamSynergy: -5 },
      },
      {
        id: 'early_ward', text: 'Ping bot to help before you go in.',
        description: 'Wait for a numbers advantage before committing to the scuttle fight.',
        playerDelta: { mental: 2 },
        teamDelta:   { visionControl: 8, objectiveControl: 7, teamSynergy: 8 },
        enemyDelta:  { positioning: -4 },
      },
    ],
  },

  mid_fight: {
    id: 'mid_fight', phase: 'mid',
    situation: 'Baron spawns in 20 seconds. Enemy mid and support just burned ultimates bot.',
    options: [
      {
        id: 'mid_baron_now', text: 'Start baron before they reset.',
        description: "This is the window. If your team follows immediately, you win it.",
        playerDelta: { mental: -4, assists: 1 },
        teamDelta:   { objectiveControl: 14, goldDiff: 350, morale: 7, teamSynergy: -5 },
        enemyDelta:  { threat: -8, positioning: -12 },
      },
      {
        id: 'mid_bait', text: 'Fake baron — bait them to come.',
        description: "Smite the void bug, hover baron. If they come, you fight 5v3.",
        playerDelta: { kills: 1, mental: 7 },
        teamDelta:   { goldDiff: 250, morale: 8, objectiveControl: 7 },
        enemyDelta:  { threat: -6 },
      },
      {
        id: 'mid_delay', text: 'Set vision and wait for respawns.',
        description: "Don't force it. Control the pit and take baron next spawn safely.",
        playerDelta: { mental: 3 },
        teamDelta:   { visionControl: 10, objectiveControl: 5, teamSynergy: 6 },
        enemyDelta:  { positioning: -4 },
      },
    ],
  },

  late_call: {
    id: 'late_call', phase: 'late',
    situation: 'Elder Dragon spawns. Your team holds baron buff. Enemy is split and low.',
    options: [
      {
        id: 'late_flank', text: 'Force the Elder fight now.',
        description: 'Elder on top of baron buff ends the game. High commitment.',
        playerDelta: { kills: 1, mental: 8 },
        teamDelta:   { objectiveControl: 14, goldDiff: 280, morale: 8, teamSynergy: -6 },
        enemyDelta:  { threat: -10, positioning: -12 },
      },
      {
        id: 'late_baron', text: 'Use baron buff to siege instead.',
        description: "Don't get greedy. Baron buff wins games on its own — use it.",
        teamDelta:   { objectiveControl: 12, goldDiff: 400, morale: 5, teamSynergy: 4 },
        enemyDelta:  { threat: -6 },
      },
      {
        id: 'late_siege', text: 'Control vision, wait for a better angle.',
        description: 'Set deep wards and look for an isolated pick before committing.',
        playerDelta: { mental: 2 },
        teamDelta:   { visionControl: 14, objectiveControl: 8, teamSynergy: 6 },
        enemyDelta:  { positioning: -8 },
      },
    ],
  },

  final_engage: {
    id: 'final_engage', phase: 'finalFight',
    situation: 'Final teamfight. You have your ultimate. Their backline is out of position.',
    options: [
      {
        id: 'final_hard_engage', text: 'Commit your ultimate — hard engage.',
        description: "Full commit. If your carries follow up, this is over.",
        playerDelta: { kills: 1, mental: 10 },
        teamDelta:   { morale: 10, objectiveControl: 8, goldDiff: 350, teamSynergy: -4 },
        enemyDelta:  { positioning: -20, threat: -14 },
      },
      {
        id: 'final_kite', text: "Look for an isolated target first.",
        description: 'Pick off their backline before the main fight starts.',
        playerDelta: { kills: 1, assists: 1, mental: 6 },
        teamDelta:   { goldDiff: 240, morale: 7, visionControl: 6 },
        enemyDelta:  { positioning: -12, threat: -8 },
      },
      {
        id: 'final_reset', text: 'Hold ultimate — let your frontline go first.',
        description: 'Wait for a better angle before committing your CC.',
        playerDelta: { mental: -4 },
        teamDelta:   { teamSynergy: 8, morale: -4, visionControl: 8 },
        enemyDelta:  { positioning: 4 },
      },
    ],
  },
}
