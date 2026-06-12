# CLAUDE.md — Esports Player Career Sim

## What this project is

A single-player esports **career simulation** game. The user plays one pro player's career (like MLB The Show's Road to the Show, but for a fictional MOBA esport). Matches run automatically; the user makes 4–6 key strategic decisions per match and manages long-term career growth between matches.

The full design brief is in `design-brief.md`. Read it before designing any new system.

## Hard constraints — never violate these

- **This is NOT a MOBA engine.** No direct champion control, no real-time physics, no skillshot trajectories, no wall collision, no bush vision, no per-frame AI. If a task seems to require these, stop and propose a state/event-based alternative instead.
- **The match is a state/event simulation.** Win chance is derived from the difference between team-state and enemy-state scores. Choices never add/subtract win chance directly — they modify lower-level states (CS, gold, vision, objectives, morale, trust) and win chance is recomputed from those.
- **Visuals are a presentation layer only.** Any viewer/renderer reads from the simulation's event log and state snapshots. It never drives game logic. Sim must run headless.
- **Champions are data, not code.** All champions are JSON/TS data files composed from a shared pool of ~12–15 reusable skill archetypes. Never write bespoke logic for an individual champion.
- **AI decisions happen on 1–3 second ticks or event rounds**, never frame-by-frame.
- **Other league matches are abstract.** Only the player's own match gets a detailed sim; other games resolve from team rating, form, and meta fit.

## Tech stack

- TypeScript strict mode. Vite for dev/build. Deployed on Vercel.
- `src/sim/` — pure simulation logic. **Zero framework imports, zero DOM access.** Fully deterministic given a seeded RNG (pass the RNG in; never call `Math.random()` directly).
- `src/ui/` — React for menus, match log, and choice cut-ins. Pixel viewer (PixiJS) comes later and lives in `src/viewer/`.
- `src/data/` — champions, skills, choice pools as typed data files.
- Vitest for tests. **All `src/sim/` logic must have unit tests.** Use seeded RNG in tests for reproducibility.

## Architecture

- Match flow is **phase-based**: lane → earlyMid → mid → late → finalFight. Each phase runs ticks, hits a choice point, runs remaining ticks.
- The sim emits an **event log** (kills, objectives, vision, gold swings). The UI renders from this log.
- State groups: `PlayerState`, `TeamState`, `EnemyState` — plain serializable objects (career saves will be JSON).
- `runMatchGen` is a generator: yields `MatchStep` (events + choice), receives `ChoiceSelection`. `runMatch` wraps it headlessly for tests.
- Choice pools are **role-specific**: `src/data/choices/{top,jungler,adc,support,generic}Choices.ts`. Router in `src/data/choices/index.ts` selects pool by `playerChampion.roles[0]`.
- Career state (`CareerState` in `src/sim/careerEngine.ts`) persists between matches. `applyMatchResult` feeds evaluation back into player stats.

## What is built (as of June 2026)

### Sim layer (`src/sim/`)
- `types.ts` — PlayerState, TeamState, EnemyState, ChampionData, GamePhase, SkillArchetype
- `rng.ts` — seeded mulberry32 PRNG
- `events.ts` — GameEvent, EventLog, EventKind
- `stateUtils.ts` — delta applicators, initMatchPlayer
- `winChance.ts` — computeWinChance (logistic), computeDraftScaling (phase-aware, 1.5× player weight)
- `phaseEngine.ts` — runTicks, per-phase tick handlers (lane/earlyMid/mid/late/finalFight)
- `matchEngine.ts` — runMatchGen (generator), runMatch (headless), computeEvaluation
- `careerEngine.ts` — CareerState, createCareer, applyTraining, applyMatchResult

### Data (`src/data/`)
- 5 champions: Blade Saint (top/mid), Star Oracle (support/mid), Grave Howler (jungle), Neon Viper (adc/mid), Iron Harbor (top/support)
- Each has typed `scalingCurve` per GamePhase and 3 skills from reusable archetypes
- Role-specific choice pools: top, jungle, adc, support (5 phases × 3 options each). Generic pool is fallback for mid.

### UI (`src/ui/`)
- `SetupScreen` — pick champion, start career
- `HomeScreen` — week number, stat bars, form indicator, W-L record, recent match history, Train/Play buttons
- `TrainingScreen` — pick one of 5 stats for +4 gain
- `MatchScreen` — live event log, win-chance bar, choice panel pinned at bottom
- `ResultScreen` — VICTORY/DEFEAT, KDA, Coach Rating, Fan Reaction, team state grid, Back to Career

### Deployed
- Production: https://esports-career-sim.vercel.app
- Repo: https://github.com/slee6390/esports-career-sim
- Deploy command: `npx vercel deploy --prod --yes`

## Current milestone

**Stage 1 complete (text prototype).** The choice → state → outcome → career loop is playable end-to-end.

**Stage 2 target: Vertical Slice** (see brief §9)
- 10–15 champions, all roles represented
- Mid-laner specific choice pools
- More match event variety (ambient events when no kill/objective fires)
- Win chance late-game snowball fix (soft cap on objectiveControl compounding)
- Basic pixel/2D match viewer in `src/viewer/` (PixiJS)

## Workflow conventions

- Plan before implementing any new system; present the data model first for review.
- Small commits after each working feature, with descriptive messages.
- Run `npm test` and `npm run build` before declaring a task done.
- When tuning balance numbers, change data files (`src/data/`), not formulas, where possible.
- To deploy: `npx vercel deploy --prod --yes` from the project root.
