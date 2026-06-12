# CLAUDE.md — Esports Player Career Sim

## What this project is

A single-player esports **career simulation** game. The user plays one pro player's career (like MLB The Show's Road to the Show, but for a fictional MOBA esport). Matches run automatically; the user makes 4–6 key strategic decisions per match and manages long-term career growth between matches.

The full design brief is in `docs/design-brief.md`. Read it before designing any new system.

## Hard constraints — never violate these

- **This is NOT a MOBA engine.** No direct champion control, no real-time physics, no skillshot trajectories, no wall collision, no bush vision, no per-frame AI. If a task seems to require these, stop and propose a state/event-based alternative instead.
- **The match is a state/event simulation.** Win chance is derived from the difference between team-state and enemy-state scores. Choices never add/subtract win chance directly — they modify lower-level states (CS, gold, vision, objectives, morale, trust) and win chance is recomputed from those.
- **Visuals are a presentation layer only.** Any viewer/renderer reads from the simulation's event log and state snapshots. It never drives game logic. Sim must run headless.
- **Champions are data, not code.** All champions are JSON/TS data files composed from a shared pool of ~12–15 reusable skill archetypes (poke, dash engage, shield, stun, execute, etc.). Never write bespoke logic for an individual champion.
- **AI decisions happen on 1–3 second ticks or event rounds**, never frame-by-frame. Detailed sim only around the player's lane/fights; everything else is abstract state.
- **Other league matches are abstract.** Only the player's own match gets a detailed sim; other games resolve from team rating, form, and meta fit.

## Tech stack

- TypeScript, strict mode. Vite for dev/build.
- `src/sim/` — pure simulation logic. **Zero framework imports, zero DOM access.** Fully deterministic given a seeded RNG (pass the RNG in; never call `Math.random()` directly).
- `src/ui/` — React for menus, match log, and choice cut-ins (prototype phase). Pixel viewer (PixiJS) comes later and lives in `src/viewer/`.
- `src/data/` — champions, skills, teams, events, choice pools as typed data files.
- Vitest for tests. **All `src/sim/` logic must have unit tests.** Use seeded RNG in tests for reproducibility.

## Architecture

- Match flow is **phase-based**: draft → lane phase → choice → state update → objective phase → choice → ... → outcome → player evaluation → career impact.
- The sim emits an **event log** (kills, objectives, skill casts, gold swings). The UI/viewer renders from this log. Evaluation (KDA, coach rating, fan reaction) is computed from the same log.
- State groups (see brief §6): PlayerState, TeamState, EnemyState. Keep them as plain serializable objects — career saves are JSON.
- Choice design follows brief §8: every choice trades off across aggressive / safe / team-focused / self-focused axes. Losing a match can still raise personal evaluation; winning recklessly can damage coach trust. There is no single "correct" answer to a choice.

## Current milestone

Stage 1 of the MVP ladder (brief §9): **text/log prototype**. 5 champions, 1–2 roles, no pixel viewer. Goal: prove the choice → state → outcome loop is fun.

Do not build ahead of the current milestone. No viewer code, no animation, no asset pipeline until the text prototype is playable and fun.

## Workflow conventions

- Plan before implementing any new system; present the data model first for review.
- Small commits after each working feature, with descriptive messages.
- Run `npm test` and `npm run build` before declaring a task done.
- When tuning balance numbers, change data files, not formulas, where possible.
