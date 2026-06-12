import type { PhasePoolMap } from './types.js'

export const topPools: PhasePoolMap = {
  lane_decision: {
    id: 'lane_decision', phase: 'lane',
    situation: "You have lane priority and the enemy jungler is visible bot side. Tower plates are exposed.",
    options: [
      {
        id: 'lane_aggressive', text: 'Extend the lead — dive the plates.',
        description: 'Push the advantage while their jungler is away. High gold, real risk.',
        playerDelta: { kills: 1, gold: 300, mental: 6 },
        teamDelta:   { goldDiff: 150, morale: 5, teamSynergy: -4 },
        enemyDelta:  { threat: -5, positioning: -8 },
      },
      {
        id: 'lane_safe', text: 'Teleport bot and snowball.',
        description: 'Use TP to turn your lead into a team advantage. You lose the wave.',
        playerDelta: { assists: 1, mental: 4, cs: -8 },
        teamDelta:   { goldDiff: 120, teamSynergy: 8, morale: 5 },
      },
      {
        id: 'lane_rotate', text: 'Recall and buy — consolidate.',
        description: 'Take the safe gold, come back stronger. The lead keeps itself.',
        playerDelta: { cs: 10, gold: 280, mental: 2 },
        teamDelta:   { goldDiff: 100 },
      },
    ],
  },

  early_objective: {
    id: 'early_objective', phase: 'earlyMid',
    situation: "Rift Herald is up. Your jungler pings for you to group at river.",
    options: [
      {
        id: 'early_group', text: 'Group for Herald.',
        description: 'Herald in a strong top side hand gives your team massive tower pressure.',
        playerDelta: { assists: 1, mental: 4 },
        teamDelta:   { objectiveControl: 10, goldDiff: 200, morale: 5, teamSynergy: 5 },
        enemyDelta:  { positioning: -6 },
      },
      {
        id: 'early_pressure', text: 'Split push, TP to Herald fight.',
        description: 'Push your wave in, teleport when the fight starts. Best of both worlds.',
        playerDelta: { cs: 12, gold: 200 },
        teamDelta:   { goldDiff: 180, objectiveControl: 7, teamSynergy: 3 },
      },
      {
        id: 'early_ward', text: 'Skip Herald — keep splitting top.',
        description: 'Your split pressure forces their TP. The lane is worth more.',
        playerDelta: { cs: 18, gold: 260, mental: 2 },
        teamDelta:   { goldDiff: 240, morale: -4, teamSynergy: -6, visionControl: 4 },
      },
    ],
  },

  mid_fight: {
    id: 'mid_fight', phase: 'mid',
    situation: "3v3 breaks out in mid river. Your split push is creating a 1-3-1 and their top laner just TPed.",
    options: [
      {
        id: 'mid_baron_now', text: 'TP to join the fight.',
        description: 'Rotate to mid — your team needs a fifth. Give up the split.',
        playerDelta: { assists: 1, mental: 5 },
        teamDelta:   { teamSynergy: 7, morale: 7, objectiveControl: 8, goldDiff: 200 },
        enemyDelta:  { positioning: -8 },
      },
      {
        id: 'mid_bait', text: 'Keep splitting — force their TP.',
        description: 'Push so hard they have to send their top laner back. 4v4 mid.',
        playerDelta: { cs: 10, gold: 180, mental: 4 },
        teamDelta:   { goldDiff: 280, objectiveControl: 8, teamSynergy: -6 },
      },
      {
        id: 'mid_delay', text: 'TP to baron. Macro play.',
        description: 'Skip the skirmish and take baron while they fight. High risk, huge reward.',
        playerDelta: { mental: -4, assists: 1 },
        teamDelta:   { objectiveControl: 14, goldDiff: 350, morale: 5, teamSynergy: -5 },
        enemyDelta:  { threat: -8, positioning: -10 },
      },
    ],
  },

  late_call: {
    id: 'late_call', phase: 'late',
    situation: "You have a massive item spike. Their top laner is two items behind. The side lane is open.",
    options: [
      {
        id: 'late_flank', text: 'Duel them and take the inhibitor.',
        description: "They can't match you right now. Solo carry the side lane.",
        playerDelta: { kills: 1, mental: 8 },
        teamDelta:   { objectiveControl: 14, goldDiff: 280, morale: 8, teamSynergy: -8 },
        enemyDelta:  { threat: -10, positioning: -14 },
      },
      {
        id: 'late_baron', text: 'Group for baron with the team.',
        description: "Don't solo carry. Win together and take the team objective.",
        teamDelta: { teamSynergy: 8, objectiveControl: 12, goldDiff: 240, morale: 6 },
        enemyDelta: { threat: -6 },
      },
      {
        id: 'late_siege', text: 'Keep pressure, TP when needed.',
        description: 'Split push and wait for the right moment to teleport in.',
        playerDelta: { mental: 3 },
        teamDelta:   { goldDiff: 200, objectiveControl: 8, teamSynergy: 4 },
      },
    ],
  },

  final_engage: {
    id: 'final_engage', phase: 'finalFight',
    situation: "Final teamfight at baron pit. You're the frontline. Your team needs you to start it.",
    options: [
      {
        id: 'final_hard_engage', text: 'Hard engage — absorb damage, enable your carries.',
        description: "Tank for the team. If you survive long enough, your carries win it.",
        playerDelta: { mental: 8 },
        teamDelta:   { morale: 10, objectiveControl: 8, goldDiff: 350, teamSynergy: -4 },
        enemyDelta:  { positioning: -20, threat: -14 },
      },
      {
        id: 'final_kite', text: "Wait for your backline to position first.",
        description: "Let your carries find their angle before you commit. Better engage.",
        playerDelta: { mental: 4 },
        teamDelta:   { teamSynergy: 8, morale: 5, goldDiff: 240 },
        enemyDelta:  { positioning: -8 },
      },
      {
        id: 'final_reset', text: 'Flank their backline.',
        description: 'Circle around the pit and hit their carries from behind.',
        playerDelta: { kills: 1, mental: 8 },
        teamDelta:   { morale: 8, objectiveControl: 7, goldDiff: 280, teamSynergy: -6 },
        enemyDelta:  { positioning: -14, threat: -10 },
      },
    ],
  },
}
