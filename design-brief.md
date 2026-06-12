# Esports Player Career Simulation — Design Brief

> Idea brief for developer review — not a final design document.

**Core idea:** Not a fully controllable MOBA. The player watches an automated pixel/2D match simulation while developing one esports player over a long career. At key moments, the game pauses for choices, and those choices affect match state, player evaluation, and long-term career outcomes.

---

## 1. Concept Summary

The game focuses on **one player career**, not full team management. The player could start as a solo queue prospect, academy trainee, substitute, or second-team player, then work toward a starting position, transfers, international tournaments, and a legendary career arc.

| Item | Direction |
|---|---|
| Genre | Esports player career RPG + automated match simulation |
| Perspective | The user is the pro player, not the coach, GM, or owner |
| Control | No direct champion control. The user influences strategic direction and key decisions |
| Presentation | Pixel/2D match viewer with cut-in decision moments |
| Differentiation | Closer to a Road to the Show-style career mode than a Teamfight Manager-style team sim |

## 2. Why the Idea Has Potential

- There are esports team management games, but fewer games focused on the long-term career of a single esports player.
- Even without direct control, showing the match and highlights can create much stronger immersion than a text-only choice game.
- The format naturally supports growth systems: champion mastery, meta shifts, contracts, team status, fan reaction, coaching trust, and personal form.
- It can generate streamable moments: first pro kill, failed solo kill, Baron steal, benching, rivalry match, promotion, and Worlds qualification.

## 3. Development Approach 1 — Lightweight Simulation First

This is the smallest version. Before building pixel auto-combat, test whether the match state and choice loop is fun.

| Component | Description |
|---|---|
| Match presentation | Text log, icons, simple state graphs |
| Choices | Key situations: lane phase, roaming, objectives, teamfights |
| Calculation | Choices modify sub-states such as CS, gold, vision, objectives, teamwork, and mental state |
| Pros | Fast to prototype. Good for testing whether the core simulation loop works |
| Cons | Less visually engaging, weaker spectator appeal |

**Recommended use:**
- Useful as a 2–4 week internal prototype.
- If the loop is not fun here, adding pixel combat will probably not fix the core issue.

## 4. Development Approach 2 — Pixel Match Viewer + Key Choices

This is the **recommended baseline**. The match runs automatically in a pixel/2D viewer. At important moments, the game shows a cut-in decision, then applies the result to the next match state.

| Element | Description |
|---|---|
| Match pacing | Compress a 30-minute match into around 5–8 minutes of gameplay |
| Player intervention | Around 4–6 key choices per match |
| Example choices | Join dragon fight, push one more wave, attempt solo kill, secure vision first, stop a risky Baron call |
| Internal logic | Phase-based state calculation + choice result + next phase recalculation |
| Pros | Good balance between visual appeal and manageable development scope |

**Key point:** The pixel viewer should be treated as a **visualization layer** for match states and event outcomes, not as a full MOBA engine. The user should feel like they are watching a real match, but the underlying model can remain state/event based.

## 5. Development Approach 3 — Automated MOBA Combat Sim

This is the more ambitious version. There is still no direct control, but champions visibly lane, trade, cast skills, use ultimates, and fight with cooldowns and damage values.

| Implementation Area | Suggested Approach |
|---|---|
| Champion count | Target 20–30 for a demo/full version, but prototype with 5–10 first |
| Skill structure | Three skills per champion: skill 1, skill 2, ultimate |
| Skill data | Damage, cooldown, range/type, accuracy, risk, secondary effect |
| AI decisions | Use 1–3 second ticks or event rounds, not frame-by-frame reasoning |
| Map handling | Detailed sim around the player lane/fight; abstract state simulation elsewhere |
| Teamfights | Round-based logic: engage, key skills, damage/CC, kills, retreat/chase |

**What to avoid:**
- Building real MOBA-level physics: skillshot trajectories, wall collision, bush vision, and precise real-time movement.
- Making all 90 skills fully unique in code. Reuse 12–15 skill types and vary numbers, effects, and visuals.
- Running detailed AI for all 10 champions across the full map at all times. The real burden will be design and balancing, not raw computation.

## 6. Simulation Logic Idea

It is better **not** to directly add or subtract win chance from choices. Choices should change lower-level match states, and win chance should be calculated from those states.

| State Group | Examples |
|---|---|
| Player state | Mechanics, Laning, Game Sense, Teamfight, Mental, Communication, Champion Mastery |
| Team state | Gold Diff, Vision Control, Objective Control, Team Synergy, Morale, Draft Scaling |
| Enemy state | Enemy Power, Enemy Positioning, Enemy Cooldowns, Enemy Threat |
| Choice effects | CS, gold, objectives, vision, team trust, fan reaction, coach evaluation, mental changes |
| Win chance | Calculated from the score difference between our team state and enemy team state |

**Simple flow:**
Match start → lane phase state → choice 1 → state update → objective phase → choice 2 → state update → mid-game fight → choice 3 → final outcome → player evaluation and career impact

## 7. Champion Design Direction

A 20–30 champion pool is possible, as long as each champion does not require a totally unique engine. The safer method is to build common skill types and create variety through numbers, effects, tags, and visuals.

| Role | Example Initial Pool |
|---|---|
| Top | 2 tanks, 2 bruisers, 1 split pusher, 1 lane bully |
| Jungle | 2 gankers, 1 scaling jungler, 1 objective specialist, 1 tank, 1 assassin |
| Mid | 2 assassins, 2 control mages, 1 roamer, 1 scaling carry |
| ADC | 2 hyper carries, 2 lane bullies, 1 utility marksman, 1 burst marksman |
| Support | 2 engage supports, 2 enchanters, 1 roamer, 1 poke support |

**Reusable skill types:**
Single target damage, poke, dash engage, escape, shield, heal, stun, slow, AoE damage, execute, self-buff, peel, vision, objective burst, global/teleport join.

**Example champions:**

| Champion | Role | Identity | Skill Direction |
|---|---|---|---|
| Blade Saint | Top/Mid | Lane-dominant duelist | Trade enhancer, gank escape, solo-kill ultimate |
| Star Oracle | Support/Mid | Utility controller | Vision bonus, shield, objective fight modifier |
| Grave Howler | Jungle | Early ganking bruiser | Gank success, enemy jungle read, skirmish ultimate |
| Neon Viper | ADC/Mid | Late-game hyper carry | Scaling damage, positioning modifier, teamfight burst ultimate |
| Iron Harbor | Top/Support | Tank initiator | Lane sustain, ally protection, teamfight engage ultimate |

## 8. Career Loop

The real hook is not only winning one match. It is the long-term consequence of decisions on the player's career identity.

| Stage | Content |
|---|---|
| Weekly training | Choose laning, mechanics, champion pool, mental, communication, or streaming/branding |
| Match/scrim | Automated match viewer + key decision moments |
| Evaluation | KDA, CS, objective involvement, teamwork, coach rating, fan reaction |
| Growth | Stats, champion mastery, form, mental state |
| Career | Academy call-up, first-team competition, transfer offers, overseas leagues, international tournaments |

**Good choice design:**

| Choice Type | Upside | Risk |
|---|---|---|
| Aggressive | Big reward, star power, fan reaction | Deaths, loss of team trust |
| Safe | Stable rating, low risk | Less carry potential, fewer highlights |
| Team-focused | Teamwork and coach trust | Lower personal hype or stat growth |
| Self-focused | Signature plays, star identity | Possible decline in teamplay evaluation |

**Important design principles:**
- A player should be able to lose the match but still improve their personal evaluation.
- A player should also be able to win while damaging coach trust through repeated reckless decisions.
- Choices should not be about finding the correct answer; they should shape the player's style and reputation.

## 9. Recommended MVP Ladder

Even if the final target is 20–30 champions and all roles, development should start with small validation steps.

| Stage | Scope | Goal |
|---|---|---|
| Prototype | 5 champions, 1–2 roles, text/icon simulation | Test whether the choice and state loop is fun |
| Vertical Slice | 10–15 champions, all role events, basic pixel viewer | Validate role feel and match presentation |
| Demo | 20–30 champions, one league, season/contracts/growth | Build something presentable to external users |
| Full Scope | Patch meta, multi-year career, internationals, rivals, fanbase | Strengthen long saves and replayability |

## 10. Risks and Scope Controls

| Risk | Scope Control |
|---|---|
| Becoming a full MOBA engine | Avoid direct control, precise physics, and detailed full-map 10-player AI |
| Champion balancing hell | Reuse skill types, vary values, limit initial champion count |
| Repetitive choices | Use role-specific event pools and vary outcomes by meta, enemy, champion, and personality |
| Pixel viewer feeling fake | Actually track cooldowns, HP, damage, ultimates, kill logs, and key combat numbers |
| League sim overload | Only the player's match needs detail. Sim other league matches with team rating, form, and meta fit |

## Final Summary

The most realistic shape is an automated MOBA combat simulation with no direct control, a pixel match viewer, key decision moments, and long-term development of one esports player. The goal is **not** to fully build a real MOBA. The goal is to provide enough combat data and visual feedback that the player believes they are watching and influencing a real esports career.
