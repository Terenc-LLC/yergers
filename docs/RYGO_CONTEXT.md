# RYGO_CONTEXT.md

> **Document ID:** `6613a7c9-036c-45b3-89fb-fc473e596988`
> **Read this at the start of every Claude Code session.**\*\*
> \***Update this at the end of every Claude Code session.**

## ⚠️ Editing rules for this document

Code may **only** modify these sections:

* **Session log** (append a new entry at the bottom; never edit older entries).
* **Architecture notes** (add new feature entries; updating existing entries is OK but only with new factual information about what shipped).
* **Issue map** (update status indicators on existing entries: ✅ In Review, ✅ Unblocked, etc. Do NOT mark Done — that's Opus's job after Chris reports a merge.).

Code may **not** modify these sections without explicit Opus instruction:

* Project identity
* Tech stack (Opus updates this when a new dependency lands or a merged change requires it; Code can suggest additions in the session log)
* Source-of-truth documents
* Key design decisions (locked) — including all subsections
* Open questions
* Coding conventions

If Code believes a locked decision needs to change, Code stops and posts a Linear comment asking Opus to update it. **Never silently restructure or remove content from this document.**

**Concurrency note:** if multiple Code sessions run in parallel, only one's doc-update will survive — Linear documents are last-write-wins. Until the context doc is migrated to GitHub (planned, deferred), Chris stages Code launches sequentially and Opus avoids context-doc edits while Code is running.

## Project identity

* **Brand:** **RYGO** (locked May 2, 2026 — codename was "Yergers"). Final brand. See [RYGO Game Design Document](<https://linear.app/terenc/document/rygo-game-design-document-c808a1e13080>) v1.5 "Brand identity" section.
* **What it is:** Daily mobile-first logic puzzle game where players recreate a target color pattern using three colors with traffic-light meaning and different placement reach.
* **Linear project ID:** `7cdc0a29-1925-49dd-a731-b3945fabc149` (project name: RYGO)
* **Linear team:** Terenc (key TER, ID `b8807d15-3de1-4c5a-b72e-a9a3872a8e82`) — issue identifiers stay TER-NNN
* **GitHub repo:** `Terenc-LLC/rygo` — [https://github.com/Terenc-LLC/rygo](<https://github.com/Terenc-LLC/rygo>)
* **Production URL:** [https://playRYGO.com](<https://playRYGO.com>) (target). Vercel project rename + custom-domain wiring is a Chris-side post-merge task following [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage); until that's done, the live deployment remains at the previous Vercel URL. Auto-deploys on push to `main`.

## Tech stack

* **Build tool:** Vite 8
* **Framework:** React 19
* **Language:** TypeScript 6 (strict mode)
* **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js`). Brand color tokens added in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to).
* **Dark mode:** Class-based. `@custom-variant dark (&:where(.dark, .dark *))` in `index.css`. `class="dark"` set on the html element by default in `index.html`. Toggle UI shipped in [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary).
* **Testing:** Vitest v4 with jsdom environment
* **State:** React local state for MVP. No global state library.
* **Persistence (MVP):** None server-side. localStorage for theme preference (key `rygo:theme`; one-time migration shim from `yergers:theme` shipped in [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage)) and daily play history / streaks (key `rygo:state`; lands in [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation)).
* **Backend:** None for MVP. Pattern generation is client-side, daily seed derived from date.
* **Hosting:** Vercel.
* **Package manager:** npm
* **Node:** Developed with Node 25.8.1. Minimum required: Node 20. `engines` field not yet locked in `package.json` (recommended).
* **Icon library:** None. Three gameplay shapes (square, triangle, circle) plus theme-toggle icons (sun, moon) implemented inline as React components in `src/components/Shapes.tsx`. Brand mark (vertical stoplight) added to chrome in [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage).
* **Continuous integration:** GitHub Actions workflow at `.github/workflows/ci.yml`. Runs `npm ci → npm run build → npm run test` on every PR against `main` and on every push to `main`. Pinned to Node 20. Job name: `build-and-test` — this is the required status check for branch protection.
* **Brand assets:** unzipped pack lives at `public/` (build-served: favicons, OG card, app icons) and `design/` (export SVGs: mark, lockup, wordmark) in the repo. Source files (Figma originals, RYGO Logo.html design canvas) in a Drive folder linked from this doc once provided.

## Source-of-truth documents

* [**RYGO Game Design Document**](<https://linear.app/terenc/document/rygo-game-design-document-c808a1e13080>) — Linear document `a781a924-4b33-4ceb-9115-4c27a6920910`. Currently at **v1.5** (May 2, 2026). Was titled "Yergers — Game Design Document" before brand finalization.
* [**Terenc Development Process**](<https://linear.app/terenc/document/terenc-development-process-org-level-standard-c3dac88b96ca>) — Linear document `336bb16a-ffb1-4b48-a947-362e35f63299`. Currently at **v2.3** (May 2, 2026).
* **This context document** — Linear document `6613a7c9-036c-45b3-89fb-fc473e596988`. Title is `RYGO_CONTEXT.md` (was `YERGERS_CONTEXT.md`).

## Key design decisions (locked)

These are settled. Don't re-litigate without raising it explicitly with Opus.

### Brand identity (locked May 2, 2026)

* **Brand:** RYGO (final, May 2, 2026). Replaces codename "Yergers." Domain: [playRYGO.com](<http://playRYGO.com>).
* **Mark:** vertical stoplight — rounded rectangle border (2.5px stroke, 6px corner radius) with three colored dots stacked top-to-bottom (red / yellow / green). Mark ratio 48 × 132.
* **Wordmark:** "RYGO" in JetBrains Mono, weight 600, tracking −0.02em, all caps.
* **Color tokens:**
  * **Ink** `#14110E` — primary foreground / on-light surfaces
  * **Paper** `#F5F3EE` — primary background / on-dark surfaces
  * **RYGO Red** `#D8463A` — top signal dot, also red game cells
  * **RYGO Yellow** `#E6B73B` — middle signal dot, also yellow game cells
  * **RYGO Green** `#2E9D5C` — bottom signal dot, also green game cells
* **Brand palette IS the game palette** (May 2, 2026 — Option 1 from the brand decision). The previous Tailwind starting values (`red-600` / `amber-400` / `green-600`) were placeholders. WCAG AA contrast preserved against the chosen shape fills (Paper or Ink). Locked in design doc v1.5; implementation shipped in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to).
* **Asset pack** (20 files, see `design/README.md`):
  * SVGs: mark (light/dark), wordmark (light/dark), lockup (light/dark), app icon (light/dark), share card (light/dark)
  * PNGs: app-icon-1024, app-icon-512, favicon-16/32/180, lockup-light/dark, share-card-light/dark
  * `public/` for build-referenced assets; `design/` for export-grade SVGs.
* **Usage rules:** clear space ≥ one mark width; minimum lockup 120px / mark alone 24px; don't recolor signal dots, stretch the mark, swap the typeface, or set the wordmark below weight 500.

### Game mechanics

* **Three colors only:** red 🔴, yellow 🟡, green 🟢.
* **Reach is orthogonal only.** No diagonals.
* **Reach patterns:**
  * **Red** = 1 cell.
  * **Yellow** = plus shape (cell + 4 orthogonal neighbors, clipped to grid).
  * **Green** = the cell, then propagates outward in each of the four cardinal directions; **propagation in a direction stops at the first non-empty cell** or the grid edge. (Blocking: shipped [TER-149](https://linear.app/terenc/issue/TER-149/placement-engine-blocking-semantics-for-greens-reach), May 2, 2026.)
* **Blocking** affects only green in practice (red has 1-cell reach; yellow's plus has no cells "beyond" the immediate neighbors). Non-empty cells halt green's propagation in the relevant direction; the blocker is not overwritten and cells beyond it are not affected.
* **Overwrite hierarchy:** red > yellow > green > empty. Red overwrites everything. Yellow overwrites green only. Green only fills empty cells.
* **Clearing (same-color tap)** — when the active color matches the tapped cell's color, the tap clears via that color's reach pattern, with blocking, but only affects same-color cells. Mixed-color cells in the reach footprint are untouched. Cleared cells become empty. (Introduced May 2, 2026 to give players a path back from misplays without an undo stack.)
* **Pattern generation by construction:** generator emits a solution sequence first, simulates it on an empty board, the resulting board IS the target. Solvability is therefore guaranteed.
* **Pattern requirements (May 2, 2026):**
  * **Full coverage** — every cell in the target is colored. No empty cells in any generated target.
  * **All three colors required** — every generated target uses red, yellow, AND green. Two-color targets are rejected and regenerated.
* **First reveal is free.** Timer starts on first reveal but move counter does not increment.
* **Auto-detection of completion → validation sequence.** When the playable board matches the target exactly, the timer freezes immediately and a \~750–1000ms validation sweep plays before the Summary appears. (Locked design doc v1.5; implementation in [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow).)
* **Pattern and playable board are never visible at the same time.** Transitioning between them shows a 1-second blank "Get ready..." screen in either direction; the timer keeps running through the blank.

### Difficulty ladder

Four sizes (May 2, 2026 — was three previously; shipped in [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme)):

* **Easy:** 4×4 (16 cells)
* **Normal:** 5×5 (25 cells)
* **Hard:** 6×6 (36 cells)
* **Extreme:** 8×8 (64 cells)

### Scoring

* **Moves are the score.** Time is shown during play (light tension cue) and as the tiebreaker for any leaderboard or aggregate, but does not enter the score formula itself.
* **Display format:** `{moves} moves · {M:SS}` (e.g., `8 moves · 2:14`). The "moves" line is the headline; time is supporting context.
* **Hook surface:** `useGame` exposes `moveCount` and `elapsedMs` separately; the UI labels `moveCount` as "Score." No separate `score` field on the hook — would just be a passthrough rename. If scoring ever evolves to a formula, add the field then.
* **Every meaningful click counts as a move (May 2, 2026):**
  * **Placement** (tapping an empty/non-matching cell with a color active) → **+1 move**
  * **Clearing** (tapping a matching-color cell with that color active) → **+1 move**
  * **Color switch to a *different* color** in the picker → **+1 move**
  * **Color tap that does not change state** (tapping the already-active color) → **0 moves** (no-op)
  * **Re-reveal of pattern** (after the first) → **+1 move**
  * **Hide pattern** (returning to the playable board) → **+1 move**
  * **First reveal** → **0 moves** (free)
* This rule turns optimal play into a routing problem: minimize switches and re-reveals as well as placements. A 12-placement solution with 2 switches scores 14; with 5 switches it scores 17.

### Visual / accessibility (MVP requirement, not polish)

* **Mobile-first.** Portrait phone is the primary design target.
* **Color-blind accessibility is MVP.** Every non-empty cell renders both a background color AND a distinct shape. Color alone is never the sole identifier of state.
* **Color and shape pairings (locked v1.5 with brand palette):**
  * Red → square (Paper `#F5F3EE` fill on RYGO Red `#D8463A` background)
  * Yellow → triangle apex up (Ink `#14110E` fill on RYGO Yellow `#E6B73B` background)
  * Green → circle (Paper `#F5F3EE` fill on RYGO Green `#2E9D5C` background)
* **Color picker buttons** also display the shape, with active color indicated by a non-color cue (border / ring) so the active state is meaningful for color-blind users. **The active-color cue must be visible in both light and dark themes** — not a white/light ring that disappears against a light background.
* **All cells are** `<button>` elements with `aria-label`s describing state and position (e.g., "Red cell at row 2, column 3").
* **Shapes are inline SVGs**, defined in `src/components/Shapes.tsx`.
* **No reliance on color alone for any state indicator** anywhere in the UI.
* **Cell size at 8×8 on iPhone SE viewport is \~43px**, marginally below the 44px Apple HIG target. Accepted tradeoff per Chris on May 1, 2026 (the entire cell is the hit target; revisit if real users miss taps).

### Theming

* **Two themes:** dark (default) and light. User-toggleable.
* **Implementation:** Tailwind v4 class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *))` in `index.css`. The `dark` class on the root html element is the source of truth.
* **Default:** dark. Applied via `class="dark"` on the html element in `index.html`.
* **Persistence:** localStorage key `rygo:theme` (migrated from `yergers:theme` in [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage)), values `'dark'` or `'light'`. Persisted value overrides the default on load.
* `prefers-color-scheme` is NOT respected for first-time visitors. Default dark for everyone.
* **Game-content colors are theme-invariant.** Red, yellow, green, and their shape fills are identical in both modes.
* **Surface palette uses brand Ink/Paper (locked v1.5; shipped in** [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)**):**
  * Light mode page background: Paper `#F5F3EE`
  * Dark mode page background: Ink `#14110E`
  * Light mode primary text: Ink
  * Dark mode primary text: Paper
* **Theme-dependent surfaces** (page bg, page text, empty cells, borders, button bgs, status bar, **active-color picker indicator**): use brand colors via Tailwind v4 `@theme` tokens (defined in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)).
* **Theme toggle UI:** small icon-only button in the top-right corner of every screen. Sun icon when in dark mode, moon icon when in light mode. Defined in `src/components/ThemeToggle.tsx`. The `useTheme` hook lives at `src/hooks/useTheme.ts`. Both shipped in [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary).

### Retention scope (MVP+ pre-launch)

* The four retention features — daily play tracking, once-per-day lock per level, per-level stats with score distribution, and emoji-board share button — are required before public launch but are not strict MVP. Tracked in M3 — Daily ritual (pre-launch) milestone via [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation), [TER-143](https://linear.app/terenc/issue/TER-143/stats-screen-per-level-streaks-history-score-distribution), [TER-144](https://linear.app/terenc/issue/TER-144/share-button-on-summary-web-share-api-clipboard-fallback-emoji-board).
* Anonymous, per-device only. No accounts, no backend, no cloud sync. localStorage is the single source of truth.
* Hard never-repeat puzzle guarantee is NOT in scope — generator's seed space already gives statistically-perfect uniqueness for the relevant time horizon.

## Open questions (do not implement these without Opus + Chris approval)

* Tutorial / first-run experience — defer to polish (M4).
* Sound design — design intent locked (percussive wooden tap on placement, three-note R-Y-G ascending chime on completion); implementation deferred to M4.
* Cascade animations — defer to polish (M4) except the validation sweep ([TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow), M2).
* Respect `prefers-color-scheme` on first visit — currently no.
* Lock Node version in `package.json` engines — recommended `"engines": {"node": ">=20"}`.
* Shapes opt-in/out toggle — Chris raised, decided to leave shapes always-on for MVP. Revisit only if real users complain.
* Migrate context doc from Linear to GitHub — three parallel-edit clobbering incidents have already occurred. Chris deferred on May 1, 2026 in favor of moving forward to [TER-136](https://linear.app/terenc/issue/TER-136/implement-usegame-hook-state-timer-move-counter-auto-completion). Mitigation: Chris stages Code launches sequentially and Opus avoids context-doc edits while Code is running.
* Pattern generator: add max-attempts cap on the rejection-retry loop. Currently unbounded — extremely unlikely to loop forever in practice (the bulk-1000 test confirms termination), but defensive code would cap. Re-evaluate when the new full-coverage generator ([TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune)) lands; the new constraints make the rejection loop slightly less likely to terminate quickly.
* Pattern generator solution-length ranges for the new full-coverage rules — to be retuned when [TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune) lands. Real-play data will guide final ranges.

## Architecture notes

### Placement engine — UPDATED (`src/engine/placement.ts`)

```ts
export function reachCells(board: Board, color: Color, row: number, col: number): [number, number][]
export function applyMove(board: Board, color: Color, row: number, col: number): Board
```

Pure, immutable. Throws `RangeError` on out-of-bounds. Board indexed `[row][col]`. 96 unit tests total, all passing.

**Blocking semantics (shipped in** [TER-149](https://linear.app/terenc/issue/TER-149/placement-engine-blocking-semantics-for-greens-reach)**, May 2, 2026):** `reachCells` replaces the old `targetCells` helper and now takes `board` as its first argument. Green propagates outward from the placed cell in each cardinal direction; propagation stops before the first non-empty cell (blocker not included) or at the grid edge. The placed cell `(row, col)` is always in the reach regardless of what's there — only the propagation phase consults the board. Red (1 cell) and yellow (plus shape, no propagation) are unchanged. `reachCells` is exported for use by other engine functions. **Clearing functions (shipped in** [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook)**, May 2, 2026):** `clearCells(board, color, row, col): [number, number][]` and `applyClear(board, color, row, col): Board` are exported. Green clearing uses its own traversal (stops at first non-green cell, not first non-empty cell — asymmetric with `reachCells`) and does NOT reuse `reachCells`.

### Grid component — UPDATED (`src/components/Grid.tsx`, `src/components/Shapes.tsx`)

```tsx
interface GridProps {
  board: Board;
  onCellTap?: (row: number, col: number) => void;
  size: 4 | 5 | 6 | 8;
}
export function Grid({ board, onCellTap, size }: GridProps): JSX.Element;
```

Three shape components in `Shapes.tsx`: `Square`, `Triangle`, `Circle`. All inline SVG, `viewBox="0 0 100 100"`, `fill="currentColor"`, `aria-hidden="true"`. CSS grid via `grid-cols-{size}` lookup map with `gap-1`. Each cell is a `<button aspect-square rounded-md>` with shape SVG at `w-1/2`. `data-testid` on each shape SVG (`shape-square`, `shape-triangle`, `shape-circle`) for clean RTL test assertions. Tests passing.

`GRID_COLS` lookup map: `{ 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6', 8: 'grid-cols-8' }`. All four literal class strings are present so Tailwind v4 static analysis detects them. `grid-cols-5` confirmed in `npm run build` CSS output ([TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme)).

`Shapes.tsx` also exports `Sun` and `Moon` inline SVG components (shipped in [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary)) for the theme toggle. Both have `data-testid` (`shape-sun`, `shape-moon`).

**Updated (May 2, 2026,** [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)**):** Cell backgrounds swapped to `bg-rygo-red` / `bg-rygo-yellow` / `bg-rygo-green`. Shape fills swapped to `text-paper` (on red/green) and `text-ink` (on yellow). Class-name assertions in `Grid.test.tsx` updated to match.

**Updated (May 2, 2026,** [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition)**):** Cell `<button>` transitions expanded to `transition-[transform,background-color,color] duration-150` (was `transition-transform duration-100`) to animate color changes smoothly. `active:scale-95` retained for interactive cells only.

### Page chrome theming — UPDATED (`src/App.tsx`, [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to))

`<main>` uses `bg-paper dark:bg-ink`. Primary text uses `text-ink dark:text-paper`. Page background and text respond to the `dark` class on the html element. Game-content colors (cells, shape fills) remain theme-invariant. Brand tokens defined via Tailwind v4 `@theme` block in `src/index.css`. Shipped in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to), May 2, 2026.

### Header lockup — READY (`src/components/DifficultyPicker.tsx`)

Two `<img>` tags using `/rygo-lockup-light.svg` (with `dark:hidden`) and `/rygo-lockup-dark.svg` (with `hidden dark:block`) at `h-16` (64 px). Replaces the previous plain-text `<h1>Yergers</h1>`. Wrapped in a `px-6` container to provide clear space ≥ one mark width per brand rules. Shipped in [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage).

### Pattern generator — READY (`src/engine/generator.ts`)

```ts
export function generatePuzzle(seed: string, gridSize: 4 | 5 | 6 | 8): GeneratedPuzzle;
export function dailySeed(date: Date): string; // returns 'RYGO-YYYY-MM-DD' from UTC date
```

Deterministic, seeded puzzle generator. Zero external dependencies. Implementation details:

* **RNG:** mulberry32 (hand-rolled \~10-line PRNG) seeded via a djb2-style string hash. No npm dependency.
* **Algorithm:** generate a solution sequence → simulate on empty board with `applyMove` → resulting board is the target. Solvability is guaranteed by construction.
* **Color weights:** red 0.45, yellow 0.40, green 0.15. Green is downweighted because its wide cascade reach (full row + column) causes disproportionate single-color outcomes. These are starting values; tune by playtesting.
* **Trivial-puzzle rejection:** rejects and retries if the result is all-empty, all-one-color, >85% single color, or if the first move alone produces the target. Each retry uses `hash(seed + "/" + attempt)` so retries are independent but the overall output remains deterministic from the user-facing seed.
* **Solution length:** 4×4: 4–7 moves, 5×5: 5–9 moves, 6×6: 6–10 moves, 8×8: 8–14 moves. (5×5 added in [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme); all ranges will be retuned in [TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune).)

**Note (May 2, 2026):** [TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune) expands this to enforce full coverage and all-three-colors, retunes weights, and updates the solution-length ranges. Will likely produce longer solutions overall. The `dailySeed` prefix switched from `'YERGERS-'` to `'RYGO-'` in [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) (one-time deterministic-output change, acceptable pre-launch).

### App footer — READY (`src/App.tsx`)

Persistent `<footer>` rendered as a sibling of `<main>` (via React fragment), styled `text-xs text-gray-500 dark:text-gray-400 text-center py-4`. Displays `Last shipped: TER-NNN — Short description` with the issue ID linked to its Linear URL. Survives across screens.

**Convention:** every Code session updates the footer text as part of session-end close-out. Format: `Last shipped: TER-NNN — 4-6 word description`. Single-line change in `App.tsx`. Removed before public launch.

### CI / build pipeline — READY (`.github/workflows/ci.yml`)

GitHub Actions workflow runs on every PR against `main` and every push to `main`. Single job `build-and-test` on `ubuntu-latest`, Node 20 (pinned), npm cache enabled. Steps: `npm ci` → `npm run build` → `npm run test`. The job name `build-and-test` is the required status check for branch protection. Vercel deployment continues to auto-deploy on push to `main` independently.

### Game state shape

```ts
type CellState = 'empty' | 'red' | 'yellow' | 'green';
type Board = CellState[][];
type Color = 'red' | 'yellow' | 'green';
type Move = { color: Color; row: number; col: number };
type GamePhase = 'idle' | 'pattern-revealed' | 'playing' | 'validating' | 'complete';
type Theme = 'dark' | 'light';
```

The first four types live in `src/engine/types.ts`. `GamePhase` is exported from `src/hooks/useGame.ts`. `Theme` is exported from `src/hooks/useTheme.ts`.

**Note (May 2, 2026):** `'validating'` GamePhase added in [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow) — sits between `'playing'` and `'complete'` for the win-state validation sweep. [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) models the pattern↔board transition at the UI layer with a local boolean (not a hook phase) — different architectural choice from [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow) because the transition affects only the visual, not the game state.

### useGame hook — READY (`src/hooks/useGame.ts`)

```ts
export type GamePhase = 'idle' | 'pattern-revealed' | 'playing' | 'validating' | 'complete';

export interface GameView {
  phase: GamePhase;
  gridSize: 4 | 5 | 6 | 8;
  current: Board;
  target: Board;
  patternVisible: boolean;
  elapsedMs: number;
  moveCount: number;
  activeColor: Color | null;
}

export interface GameActions {
  revealPattern: () => void;
  hidePattern: () => void;
  selectColor: (c: Color) => void;
  placeAt: (row: number, col: number) => void;
  reset: () => void;
  completeValidation: () => void; // added in TER-153
}

export function useGame(puzzle: GeneratedPuzzle): GameView & GameActions;
```

`useReducer`-based state machine with action types (`REVEAL_PATTERN`, `HIDE_PATTERN`, `SELECT_COLOR`, `PLACE_AT`, `RESET`, `TICK`, plus `COMPLETE_VALIDATION` from [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow)). Timer: single 100ms `setInterval`; stores `timerStartedAt` timestamp in reducer state; `elapsedMs` = `Date.now() - timerStartedAt` on each tick; frozen at completion value once phase = `validating`. Completion check runs inside `PLACE_AT` reducer case (not a `useEffect`) to set phase and elapsedMs atomically. Every `placeAt` call counts as a move per the design doc. `boardsMatch` is a local unexported helper. 9 unit tests using `vi.useFakeTimers()`.

**Notes (May 2, 2026):**

* [TER-150](https://linear.app/terenc/issue/TER-150/every-click-counts-scoring-color-switches-and-hides-count-as-moves) updates the move-counting logic in the reducer: `SELECT_COLOR` to a different color → +1, `HIDE_PATTERN` → +1, `REVEAL_PATTERN` after first → +1 (already there), `PLACE_AT` → +1 (already there). `SELECT_COLOR` to the same color → 0. Same-color clearing ([TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook)) → +1.
* [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook) adds clearing semantics (shipped May 2, 2026): `PLACE_AT` branches on `state.current[row][col] === state.activeColor` — true calls `applyClear`, increments `moveCount` by 1, no completion check; false follows existing placement path unchanged.
* [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow) adds the `'validating'` phase and `completeValidation` action: when the boards match, phase goes to `'validating'` (timer freezes), GameScreen runs a 750–1000ms visual sweep, then dispatches `COMPLETE_VALIDATION` to flip phase to `'complete'`.

### Completion check

`boardsMatch(a: Board, b: Board): boolean` — local unexported function inside `src/hooks/useGame.ts`. Checks exact cell-by-cell equality. Used in the `PLACE_AT` reducer case to detect game completion atomically.

### Screen architecture and component map — READY (`src/App.tsx`, [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary))

App manages a two-state view machine (`'difficulty' | 'game'`), calls `useTheme()` once, renders `ThemeToggle` in a fixed `z-50` top-right overlay (respects iOS safe-area insets), and passes callbacks to screens.

**Screens:**

* **DifficultyPicker** (`src/components/DifficultyPicker.tsx`) — RYGO lockup at top ([TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage)), tagline, four `LevelButton`s: Easy 4×4, Normal 5×5, Hard 6×6, Extreme 8×8 ([TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme)). `onShowStats?` no-op stub in top-right header (slot for [TER-143](https://linear.app/terenc/issue/TER-143/stats-screen-per-level-streaks-history-score-distribution)).
* **GameScreen** (`src/components/GameScreen.tsx`) — consumes `useGame(puzzle)`. Status bar (Score labeled, Time, phase text), Grid (board when !patternVisible, target when patternVisible; replaced by "Get ready..." during a 1-second transition blank), reveal/hide toggle button, `ColorPicker` (hidden during pattern-revealed), Restart button (calls `reset()`, stays on game screen, clears pending transition timer), Quit button (calls `onPickDifficulty` directly — no `window.confirm`). Transition blank: local `transitioning: boolean` state + `timerRef: useRef<number | null>` cleared via `useEffect` cleanup; `revealPattern()`/`hidePattern()` called at click time so game timer starts immediately through the blank. `mode?: 'daily' | 'practice'` prop plumbed for [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation). When `phase === 'validating'`, runs the win-sweep animation; when `phase === 'complete'`, renders `Summary` in place of the game UI. (Shipped in [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition).)

**Sub-components:**

* **LevelButton** (`src/components/LevelButton.tsx`) — large button with `size: 4 | 5 | 6 | 8`, `label`, `onSelect`, `completedToday?: { moves, elapsedMs }` (unused slot for [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation)).
* **ColorPicker** (`src/components/ColorPicker.tsx`) — red/yellow/green buttons showing color bg + shape icon. Active state: `ring-4 ring-blue-500 ring-offset-2 ring-offset-paper dark:ring-offset-ink` (non-color cue; blue-500 contrasts all three game colors in both themes; shipped in [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition)).
* **Summary** (`src/components/Summary.tsx`) — score (moves), time, grid size (labels: Easy/Normal/Hard/Extreme — updated [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme)), `flex gap-3` button row with "Play again" + "Change difficulty". Share-button slot reserved for [TER-144](https://linear.app/terenc/issue/TER-144/share-button-on-summary-web-share-api-clipboard-fallback-emoji-board).
* **ThemeToggle** (`src/components/ThemeToggle.tsx`) — receives `theme` and `toggleTheme` as props from App. Shows `Sun` when dark, `Moon` when light. `aria-label` reflects the action.

**Board interactivity:** Grid cells are disabled (`onCellTap` = undefined) in `idle`, `pattern-revealed`, and `validating` phases; enabled only in `playing`.

### Theme system — READY (`src/hooks/useTheme.ts`, [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary))

```ts
export type Theme = 'dark' | 'light';
export function useTheme(): { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void; };
```

`useState` initializer runs `migrateLegacyKeys()` (migrates any pre-existing `'yergers:theme'` value to `'rygo:theme'` once, idempotent) then reads `localStorage.getItem('rygo:theme')`, defaults to `'dark'`. `useEffect` on `[theme]` calls `document.documentElement.classList.add/remove('dark')` and `localStorage.setItem(...)`. Single `useTheme` call in App; ThemeToggle receives props rather than calling the hook itself.

### Theme palette (light / dark) — UPDATED ([TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary), [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to))

Brand tokens defined in `src/index.css` via `@theme` block. Shipped in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to), May 2, 2026.

| Surface                  | Light                                                  | Dark                                                 |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| Page background          | `bg-paper` (`#F5F3EE`)                                 | `bg-ink` (`#14110E`)                                 |
| Page / heading text      | `text-ink` (`#14110E`)                                 | `text-paper` (`#F5F3EE`)                             |
| Secondary text / labels  | `text-gray-500`                                        | `text-gray-400`                                      |
| Empty grid cells         | `bg-gray-100`                                          | `bg-gray-800`                                        |
| Default / level buttons  | `bg-gray-100`                                          | `bg-gray-800`                                        |
| Reveal / action buttons  | `bg-gray-200`                                          | `bg-gray-700`                                        |
| Summary card             | `bg-gray-100`                                          | `bg-gray-800`                                        |
| Color picker active ring | `ring-4 ring-blue-500 ring-offset-2 ring-offset-paper` | `ring-4 ring-blue-500 ring-offset-2 ring-offset-ink` |
| Primary action button    | `bg-blue-600 text-white`                               | (same)                                               |
| Game-content cells       | `bg-rygo-red` / `bg-rygo-yellow` / `bg-rygo-green`     | (theme-invariant)                                    |
| Shape fills              | `text-paper` (on red/green), `text-ink` (on yellow)    | (same)                                               |

**Active-ring note:** `ring-white ring-offset-white` was invisible against Paper (`#F5F3EE`) in light mode. Fixed in [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition): changed to `ring-4 ring-blue-500 ring-offset-2 ring-offset-paper dark:ring-offset-ink`.

### Test infrastructure — UPDATED ([TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary))

`src/test/setup.ts` patches `globalThis.localStorage` with a full in-memory `Storage` implementation. Required because Node.js 25 ships a built-in `localStorage` global that is non-functional without `--localstorage-file` and shadows jsdom's implementation in Vitest 4.x test workers. All tests pass under this mock; new localStorage-dependent tests work correctly. **Do not remove this mock — it is necessary for both Node 20 and Node 25 environments.**

## Coding conventions

* TypeScript strict mode on. No `any` without an explicit comment justifying it.
* In `react-jsx` mode (tsconfig), `JSX` namespace is not global — import it: `import type { JSX } from 'react'`
* Pure logic (placement engine, generator, completion check, clearing helper) lives in `src/engine/` and is fully unit-tested with Vitest.
* React components live in `src/components/`.
* React hooks live in `src/hooks/`.
* Persistence modules live in `src/persistence/` (introduced in [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation)).
* No business logic in components.
* Tailwind v4 for all styling. CSS-based config (no `tailwind.config.js`). Brand tokens (`ink`, `paper`, `rygo-red`, `rygo-yellow`, `rygo-green`) defined via `@theme` block in `index.css` ([TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)). No CSS modules.
* Mobile-first: design at portrait phone width first, adapt up.
* Use `dark:` variants only on surfaces that actually change between themes. Game-content colors don't need dark variants.
* Update the App footer (`src/App.tsx`) at the end of every Code session: `Last shipped: TER-NNN — Short description`.

## Issue map (M1, M2, M3, M4)

### M1 — Foundation (✅ complete)

* [TER-132](https://linear.app/terenc/issue/TER-132/scaffold-yergers-project-vite-react-ts-tailwind-vitest-dark-mode) — ✅ Done. Project scaffolded with Vite 8 + React 19 + TS 6 + Tailwind v4 + Vitest 4.
* [TER-133](https://linear.app/terenc/issue/TER-133/implement-color-placement-engine-pure-logic-fully-unit-tested) — ✅ Done. Color placement engine with 24 unit tests.
* [TER-134](https://linear.app/terenc/issue/TER-134/implement-pattern-generator-deterministic-seeded-solvable-by) — ✅ Done. Pattern generator (deterministic, seeded, dependency-free; 13 tests).
* [TER-135](https://linear.app/terenc/issue/TER-135/build-mobile-first-grid-component-presentational-no-game-logic) — ✅ Done. Mobile-first Grid component with shape-based accessibility and dark/light support.
* [TER-138](https://linear.app/terenc/issue/TER-138/add-ci-workflow-build-test-on-prs-and-document-branch-protection-setup) — ✅ Done. CI workflow + branch protection live.
* [TER-139](https://linear.app/terenc/issue/TER-139/replace-octagon-with-square-for-red-cells-visual-distinction-from) — ✅ Done. Octagon → Square swap.
* [TER-140](https://linear.app/terenc/issue/TER-140/make-page-background-and-text-theme-aware-currently-stuck-on-dark) — ✅ Done. Page bg/text theme-aware fix.
* [TER-141](https://linear.app/terenc/issue/TER-141/add-persistent-last-shipped-footer-to-app) — ✅ Done. Persistent "last shipped" footer.

### M2 — Playable MVP

* [TER-136](https://linear.app/terenc/issue/TER-136/implement-usegame-hook-state-timer-move-counter-auto-completion) — ✅ Done. useGame hook (state, timer, move counter, auto-completion).
* [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary) — ✅ Done. Full game UI + theme toggle. M2 baseline shipped.
* [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme) — ✅ Done. Difficulty ladder expansion to 4 sizes (4×4 / 5×5 / 6×6 / 8×8).
* [TER-149](https://linear.app/terenc/issue/TER-149/placement-engine-blocking-semantics-for-greens-reach) — ✅ Done. Placement engine: blocking semantics for green's reach.
* [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) — ✅ Done. Yergers → RYGO rebrand (rename, lockup, localStorage migration, asset wiring).
* [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook) — ✅ Done. Same-color clearing mechanic (engine + hook).
* [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) — ✅ Done. RYGO brand palette tokens (Tailwind v4 `@theme` block, swap utilities to brand tokens, contrast verification).
* [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) — Game-screen UX cleanup (remove quit dialog, Restart button, light-mode active-ring fix, transition blank, click-feedback). ✅ In Review.
* [TER-150](https://linear.app/terenc/issue/TER-150/every-click-counts-scoring-color-switches-and-hides-count-as-moves) — Every-click-counts scoring (color switch, hide pattern). ✅ Unblocked.
* [TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune) — Generator: full coverage + all 3 colors required + retune. ✅ Unblocked (design pass pending).
* [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow) — Win-state validation sequence (`'validating'` GamePhase + 750–1000ms sweep + RYGO mark glow before Summary). Design pass pending.

### M3 — Daily ritual (pre-launch)

* [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation) — Daily play tracking + once-per-day lock + localStorage foundation. Blocked by M2 follow-ups ([TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune)/147/148/150/152/153 should land first to avoid double-touching the same files).
* [TER-143](https://linear.app/terenc/issue/TER-143/stats-screen-per-level-streaks-history-score-distribution) — Stats screen (per-level streaks, history, score distribution). Blocked by [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary) + [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation).
* [TER-144](https://linear.app/terenc/issue/TER-144/share-button-on-summary-web-share-api-clipboard-fallback-emoji-board) — Share button on Summary (Web Share API + clipboard fallback, emoji-board format). Blocked by [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary).

### M4 — Polish (post-launch)

* [TER-154](https://linear.app/terenc/issue/TER-154/m4-feel-polish-parent-haptics-audio-screen-transitions-breathing-room) **(parent)** — M4 Feel polish: haptic feedback, audio cues (R-Y-G chime + percussive tap), screen transitions, breathing-room layout pass. Sub-issues filed when M4 starts.

## Session log

> Add a new entry at the end of every Code session. Most recent at bottom. Never edit older entries.

### 2026-05-01 — [TER-132](https://linear.app/terenc/issue/TER-132/scaffold-yergers-project-vite-react-ts-tailwind-vitest-dark-mode) scaffold (Claude Code / Sonnet 4.6)

Scaffolded the full project. Pushed initial commit to `Terenc-LLC/yergers` main branch. Vercel deployed.

* Vite 8 + React 19 + TypeScript 6 (strict) scaffold via `npm create vite@latest`.

**Tooling notes for future sessions:**

* Tailwind v4 uses `@import "tailwindcss"` in CSS, not `@tailwind base/components/utilities`. No `tailwind.config.js`.
* Vitest config lives inside `vite.config.ts` using `/// <reference types="vitest/config" />` to merge types.
* `vitest/globals` added to `tsconfig.app.json` `types` array so test globals are typed without imports.

### 2026-05-01 — [TER-132](https://linear.app/terenc/issue/TER-132/scaffold-yergers-project-vite-react-ts-tailwind-vitest-dark-mode) dark mode follow-up (Claude Code / Sonnet 4.6)

Added class-based dark mode foundation per Opus reopen.

### 2026-05-01 — [TER-133](https://linear.app/terenc/issue/TER-133/implement-color-placement-engine-pure-logic-fully-unit-tested) placement engine (Claude Code / Sonnet 4.6)

Implemented the color placement engine. 24 unit tests passing. Commit `42f9161`.

### 2026-05-01 — Opus review of [TER-133](https://linear.app/terenc/issue/TER-133/implement-color-placement-engine-pure-logic-fully-unit-tested) + context doc repair

Restored locked decisions accidentally removed by Code's restructure.

### 2026-05-01 — [TER-135](https://linear.app/terenc/issue/TER-135/build-mobile-first-grid-component-presentational-no-game-logic) Grid component (Claude Code / Sonnet 4.6)

Implemented the mobile-first Grid component with full color-blind accessibility. 42 tests passing. Commit `2b03150`.

### 2026-05-01 — Opus review of [TER-135](https://linear.app/terenc/issue/TER-135/build-mobile-first-grid-component-presentational-no-game-logic) + context doc repair (second occurrence)

Restored locked decisions accidentally removed by Code's restructure (same regression as [TER-133](https://linear.app/terenc/issue/TER-133/implement-color-placement-engine-pure-logic-fully-unit-tested)). Strengthened the editing rules at the top of this doc to be an explicit allowlist.

### 2026-05-01 — [TER-138](https://linear.app/terenc/issue/TER-138/add-ci-workflow-build-test-on-prs-and-document-branch-protection-setup) CI workflow (Claude Code / Sonnet 4.6)

First clean run of the v2 process. PR #1 opened; meta-test passed in 15s.

### 2026-05-01 — Opus review of [TER-138](https://linear.app/terenc/issue/TER-138/add-ci-workflow-build-test-on-prs-and-document-branch-protection-setup) + context doc restoration

All steps followed correctly. Added CI to tech stack and architecture notes.

### 2026-05-01 — [TER-140](https://linear.app/terenc/issue/TER-140/make-page-background-and-text-theme-aware-currently-stuck-on-dark) page chrome theming (Claude Code / Sonnet 4.6)

Made page background and text respond to the `dark` class. PR #3 opened.

### 2026-05-01 — [TER-139](https://linear.app/terenc/issue/TER-139/replace-octagon-with-square-for-red-cells-visual-distinction-from) Octagon → Square swap (Claude Code / Sonnet 4.6)

Replaced `Octagon` with `Square` for red cells. PR #2 opened.

### 2026-05-01 — Opus review of [TER-139](https://linear.app/terenc/issue/TER-139/replace-octagon-with-square-for-red-cells-visual-distinction-from) + [TER-140](https://linear.app/terenc/issue/TER-140/make-page-background-and-text-theme-aware-currently-stuck-on-dark) + context doc reconciliation

Both PRs approved. The predicted concurrency issue occurred: Code 139 clobbered Code 140's session log entry. Restored [TER-140](https://linear.app/terenc/issue/TER-140/make-page-background-and-text-theme-aware-currently-stuck-on-dark)'s session log entry.

### 2026-05-01 — [TER-134](https://linear.app/terenc/issue/TER-134/implement-pattern-generator-deterministic-seeded-solvable-by) pattern generator (Claude Code / Sonnet 4.6)

Implemented the deterministic, seeded pattern generator. 55 tests passing. PR #4.

### 2026-05-01 — Opus review of [TER-134](https://linear.app/terenc/issue/TER-134/implement-pattern-generator-deterministic-seeded-solvable-by)

Approved. First session where Code respected the v2.1 context-doc allowlist with no regressions.

### 2026-05-01 — Process bumped to v2.2; [TER-134](https://linear.app/terenc/issue/TER-134/implement-pattern-generator-deterministic-seeded-solvable-by) closed by Opus

Chris reported [TER-134](https://linear.app/terenc/issue/TER-134/implement-pattern-generator-deterministic-seeded-solvable-by)'s PR merged. Process doc bumped to v2.2 codifying the new rule: when Chris reports a merge, Opus marks the issue Done and updates the context doc issue map.

### 2026-05-01 — [TER-141](https://linear.app/terenc/issue/TER-141/add-persistent-last-shipped-footer-to-app) footer (Claude Code / Sonnet 4.6)

Added persistent "last shipped" footer to the App. PR #5.

### 2026-05-01 — Opus review of [TER-141](https://linear.app/terenc/issue/TER-141/add-persistent-last-shipped-footer-to-app) + context doc reconciliation (third occurrence)

Approved. The parallel-edit problem hit again: Opus's v2.2 process update clobbered Code's session-end doc save. Restored Code's [TER-141](https://linear.app/terenc/issue/TER-141/add-persistent-last-shipped-footer-to-app) doc updates.

### 2026-05-01 — [TER-141](https://linear.app/terenc/issue/TER-141/add-persistent-last-shipped-footer-to-app) closed; GitHub migration deferred

Chris reported [TER-141](https://linear.app/terenc/issue/TER-141/add-persistent-last-shipped-footer-to-app)'s PR merged. Opus marked Done. Chris elected to defer the context-doc → GitHub migration in favor of moving forward to [TER-136](https://linear.app/terenc/issue/TER-136/implement-usegame-hook-state-timer-move-counter-auto-completion).

### 2026-05-01 — [TER-136](https://linear.app/terenc/issue/TER-136/implement-usegame-hook-state-timer-move-counter-auto-completion) useGame hook (Claude Code / Sonnet 4.6)

Implemented the `useGame` hook. 64 total tests passing; CI green on PR #6 in 17s.

### 2026-05-01 — Opus review of [TER-136](https://linear.app/terenc/issue/TER-136/implement-usegame-hook-state-timer-move-counter-auto-completion)

Approved. Clean execution.

### 2026-05-01 — [TER-136](https://linear.app/terenc/issue/TER-136/implement-usegame-hook-state-timer-move-counter-auto-completion) closed; M3 milestone created; retention issues filed

Chris reported [TER-136](https://linear.app/terenc/issue/TER-136/implement-usegame-hook-state-timer-move-counter-auto-completion)'s PR merged. Opus closed the issue. New milestone M3 — Daily ritual (pre-launch). Filed [TER-142](https://linear.app/terenc/issue/TER-142/daily-play-tracking-once-per-day-lock-localstorage-foundation), [TER-143](https://linear.app/terenc/issue/TER-143/stats-screen-per-level-streaks-history-score-distribution), [TER-144](https://linear.app/terenc/issue/TER-144/share-button-on-summary-web-share-api-clipboard-fallback-emoji-board).

### 2026-05-02 — [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary) Full game UI (Claude Code / Sonnet 4.6)

Implemented the complete playable game UI. 82 tests passing. CI green on PR #7. **M2 baseline shipped.**

**PR:** [https://github.com/Terenc-LLC/yergers/pull/7](<https://github.com/Terenc-LLC/yergers/pull/7>)

### 2026-05-02 — Opus review of [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary); [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary) closed; six M2 follow-ups filed

Chris reported [TER-137](https://linear.app/terenc/issue/TER-137/build-full-game-ui-difficulty-picker-game-screen-end-of-game-summary)'s PR merged. Opus closed the issue. **M2 baseline complete: game is playable in production.**

Real-play feedback from Chris produced several rule changes. Six new issues filed in M2: [TER-149](https://linear.app/terenc/issue/TER-149/placement-engine-blocking-semantics-for-greens-reach), [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook), [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition), [TER-150](https://linear.app/terenc/issue/TER-150/every-click-counts-scoring-color-switches-and-hides-count-as-moves), [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme), [TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune).

### 2026-05-02 — [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme) Difficulty ladder 4/5/6/8 (Claude Code / Sonnet 4.6)

Widened the grid-size type union to `4 | 5 | 6 | 8`. Added Normal (5×5). 89 tests passing. PR #8 merged.

### 2026-05-02 — Opus review of [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme); [TER-145](https://linear.app/terenc/issue/TER-145/difficulty-ladder-expansion-44-55-66-88-easy-normal-hard-extreme) closed

Approved. Clean execution. PR #8 merged.

### 2026-05-02 — [TER-149](https://linear.app/terenc/issue/TER-149/placement-engine-blocking-semantics-for-greens-reach) Placement engine green blocking semantics (Claude Code / Sonnet 4.6)

Updated `src/engine/placement.ts` to introduce blocking semantics for green's reach. `targetCells` → `reachCells(board, color, row, col)`. 96 total tests passing. PR #9 merged.

### 2026-05-02 — Opus review of [TER-149](https://linear.app/terenc/issue/TER-149/placement-engine-blocking-semantics-for-greens-reach); [TER-149](https://linear.app/terenc/issue/TER-149/placement-engine-blocking-semantics-for-greens-reach) closed

Approved. Cleanest engine change of the project. Three smart proactive calls beyond the spec. Chris merged PR #9. Opus marked the issue Done.

### 2026-05-02 — Brand finalization: Yergers → RYGO; design doc → v1.5; four new issues filed

Chris uploaded the final brand asset pack (RYGO.zip). The codename "Yergers" is replaced by the final brand **RYGO**. Domain finalized as [**playRYGO.com**](<http://playRYGO.com>). The brand pack includes a vertical stoplight mark (rounded rectangle with three colored dots), JetBrains Mono wordmark, and full color palette: Ink `#14110E`, Paper `#F5F3EE`, RYGO Red `#D8463A`, RYGO Yellow `#E6B73B`, RYGO Green `#2E9D5C`.

Decisions locked:

* **Brand palette adopted as game palette** (Option 1 from the brand decision). The previous Tailwind starting values were placeholders; the brand palette is the tuning. WCAG AA preserved against Paper/Ink shape fills.
* **Surface palette uses Ink/Paper** instead of Tailwind gray-950/white.
* **Validation sequence locked:** abrupt-cut to Summary is a bug. New `'validating'` GamePhase between `'playing'` and `'complete'`; 750–1000ms sweep before Summary.
* **Click feedback (scale-down + color transition)** folded into [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition).
* **Audio, haptics, screen transitions, breathing-room** deferred to M4 polish ([TER-154](https://linear.app/terenc/issue/TER-154/m4-feel-polish-parent-haptics-audio-screen-transitions-breathing-room) parent).

New issues filed: [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) (rebrand), [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) (palette), [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow) (validation sweep), [TER-154](https://linear.app/terenc/issue/TER-154/m4-feel-polish-parent-haptics-audio-screen-transitions-breathing-room) (M4 polish parent).

### 2026-05-02 — [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) Yergers → RYGO rebrand (Claude Code / Sonnet 4.6)

Migrated all Yergers references to RYGO. 10 files changed across metadata, source, and tests. 98 tests passing (was 96; +2 for the localStorage migration shim). Build clean.

Changes by section:

* A. Metadata: package.json name → "rygo"; index.html title, favicon links (16/32/180), OG and Twitter meta tags.
* B. String replacement: dailySeed prefix 'YERGERS-' → 'RYGO-' (deterministic-output break, acceptable pre-launch); Yergers h1 and all test assertions updated.
* C. Lockup: DifficultyPicker h1 replaced with /rygo-lockup-light.svg + /rygo-lockup-dark.svg pair at h-16 (light variant with dark:hidden, dark with hidden dark:block).
* D. localStorage migration: migrateLegacyKeys() in useTheme.ts runs before the useState initializer reads. Two new tests: happy path (yergers:theme = 'light' → rygo:theme = 'light' and yergers:theme removed) and no-overwrite guard (existing rygo:theme not overwritten).
* E. Footer: Last shipped: [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) — RYGO rebrand.

PR: [https://github.com/Terenc-LLC/rygo/pull/10](<https://github.com/Terenc-LLC/rygo/pull/10>)

### 2026-05-02 — Process bumped to v2.3; [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) closed by Opus

Chris reported [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage)'s PR merged (PR #10 in `Terenc-LLC/rygo`). Opus closed the issue.

Process doc bumped to **v2.3** codifying two new rules surfaced during this issue:

1. **Inline close-out checklist required** in every issue body. The [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) spec linked to the Process doc instead of inlining the checklist; Code skipped the doc-update + PR steps as a result. Pure spec-quality regression on Opus's part — corrected at the process level.
2. **Operating modes** section codifying autonomous Todo-queue mode alongside the original manual mode, with the explicit constraint that Code sessions run serially.

Locked-section updates this close-out:

* **Project identity:** GitHub repo → `Terenc-LLC/rygo`; production URL target → `https://playRYGO.com` (Vercel rename + custom-domain wiring is Chris-side post-merge).
* **Tech stack:** localStorage theme key now `rygo:theme` (with one-time migration shim from `yergers:theme`); planned state key now `rygo:state`. Brand mark in chrome marked as shipped.
* **Source-of-truth documents:** Process doc version → v2.3.
* **Theming key design decision:** localStorage key text updated to reflect post-migration state.
* **Issue map:** [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) → ✅ Done. [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) unblocked notation added.

Workflow shift: subsequent RYGO work happens in a dedicated [claude.ai](<http://claude.ai>) project (Chris created May 2, 2026). Project knowledge holds GDD v1.5 and Process v2.3; this context document is fetched fresh from Linear at every session start.

**Next recommended:** [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook) (same-color clearing). Spec already filed and tightened; ready for Code.

### 2026-05-02 — [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook) Same-color clearing mechanic (Claude Code / Sonnet 4.6)

Added `clearCells` and `applyClear` to `src/engine/placement.ts`; branched `PLACE_AT` reducer in `src/hooks/useGame.ts` for same-color clearing. 115 tests passing (was 96; +19 new clearing tests). Build clean.

* Engine: `clearCells` returns the list of cells that would clear; `applyClear` returns a new board with those cells set to `'empty'`. Both exported, both throw `RangeError` on bounds and `Error` on misuse.
* Green clearing is its own traversal — stops at first non-green cell (not first non-empty). Does NOT reuse `reachCells`; implements the correct asymmetry independently.
* Reducer: `PLACE_AT` branches on `state.current[row][col] === state.activeColor` — clearing path increments moveCount by 1 with no completion check; placement path unchanged.
* App footer updated to `TER-147 — same-color clearing`.

**PR:** [https://github.com/Terenc-LLC/rygo/pull/11](<https://github.com/Terenc-LLC/rygo/pull/11>)

### 2026-05-02 — [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook) closed by Opus

Chris reported [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook)'s PR merged (PR #11 in `Terenc-LLC/rygo`). Opus marked the issue Done.

Shipped: `clearCells` and `applyClear` in `src/engine/placement.ts` (green clearing implemented as its own traversal — asymmetric stop-condition vs `reachCells`); `PLACE_AT` reducer in `src/hooks/useGame.ts` branches on same-color match. 115 tests total (was 96, +19 for clearing). Players now have a path back from misplays without an undo stack.

No locked-section updates this close-out — [TER-147](https://linear.app/terenc/issue/TER-147/same-color-clearing-mechanic-engine-hook) was a self-contained M2 follow-up with no tech-stack, identity, or design-decision changes. Architecture notes for the placement engine and `useGame` were already updated by Code during the session.

**Next recommended:** [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) (brand palette tokens) — foundational surface-color swap; downstream M2 follow-ups touch overlapping surfaces and benefit from this landing first. [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) and [TER-150](https://linear.app/terenc/issue/TER-150/every-click-counts-scoring-color-switches-and-hides-count-as-moves) are equally-ready alternatives if Chris prefers narrower blast radius. [TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune) (generator full-coverage) and [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow) (validation sweep) still need design passes before going to Code.

### 2026-05-02 — [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) RYGO brand palette tokens (Claude Code / Sonnet 4.6)

Defined brand tokens in `src/index.css` via `@theme` block and swapped all placeholder color utilities to brand tokens across 7 files. 115 tests passing (unchanged count — no new engine tests needed). Build clean; generated CSS confirms all five brand custom properties (`--color-ink`, `--color-paper`, `--color-rygo-red/yellow/green`) and their utility classes are emitted.

Changes by section:

* A. `src/index.css`: added `@theme { --color-ink: #14110E; --color-paper: #F5F3EE; --color-rygo-red: #D8463A; --color-rygo-yellow: #E6B73B; --color-rygo-green: #2E9D5C; }`
* B. `src/components/Grid.tsx`: `CELL_BG` map — `bg-red-600/amber-400/green-600` → `bg-rygo-red/yellow/green`; `SHAPE_TEXT` map — `text-white` → `text-paper` (red/green), `text-gray-800` → `text-ink` (yellow).
* C. `src/components/ColorPicker.tsx`: same game-color and shape-fill swaps as Grid.
* D. `src/App.tsx`: `<main>` — `bg-white dark:bg-gray-950` → `bg-paper dark:bg-ink`; footer updated to [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to).
* E. `src/components/GameScreen.tsx`, `Summary.tsx`, `LevelButton.tsx`: `text-gray-900 dark:text-gray-100` → `text-ink dark:text-paper` (primary text, all occurrences).
* F. `src/components/Grid.test.tsx`: updated three class-name assertions (`bg-red-600/amber-400/green-600` → `bg-rygo-red/yellow/green`) and their test descriptions.

**Scope held:** `text-gray-500 dark:text-gray-400` (secondary labels) left unchanged. Empty-cell `bg-gray-100 dark:bg-gray-800` left unchanged. Active-color picker ring left unchanged — but flagged: `ring-white ring-offset-white` is invisible against Paper (`#F5F3EE`) in light mode. [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) should pick a hue that contrasts against Paper when it fixes the ring.

**PR:** [https://github.com/Terenc-LLC/rygo/pull/12](<https://github.com/Terenc-LLC/rygo/pull/12>)

### 2026-05-02 — [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) closed by Opus; [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) refreshed and moved to Todo

Chris reported [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)'s PR merged (PR #12 in `Terenc-LLC/rygo`). Opus marked the issue Done. Brand palette is now live throughout the app.

Locked-section updates absorbed at close-out:

* **Brand identity → Brand palette IS the game palette:** "implementation in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)" → "implementation shipped in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)."
* **Theming → Surface palette:** "implementation in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)" → "shipped in [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to)."
* **Theme palette table:** "Active-ring note" amended to specify `ring-offset` should track `paper` / `ink` (not white / gray-950) since brand surfaces are now in place.
* **Tech stack and Coding conventions:** absorbed Code's [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) references (factual, accurate, retained as-is).
* **Issue map:** [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) → ✅ Done; [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) annotated as refreshed and queued.

[TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) spec refreshed for next Code launch:

* Active-ring offset updated from `ring-offset-white dark:ring-offset-gray-950` to `ring-offset-paper dark:ring-offset-ink` — consumes the [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to) session observation that the prior offset is invisible against Paper.
* Recommended ring hue stays `ring-blue-500` (outside R/Y/G gameplay, contrasts both surfaces); brand-derived alternative noted but not required.
* v2.2 close-out section replaced with the v2.3 paste-verbatim inline checklist.
* Source-of-truth Process doc reference bumped to v2.3.
* Cross-issue references to [TER-150](https://linear.app/terenc/issue/TER-150/every-click-counts-scoring-color-switches-and-hides-count-as-moves), [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to), [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow), and [TER-154](https://linear.app/terenc/issue/TER-154/m4-feel-polish-parent-haptics-audio-screen-transitions-breathing-room) spread across separate sentences per v2.3 truncation guidance.

Issue moved Backlog → Todo; available for autonomous-mode pickup.

**Next recommended:** [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) (UX cleanup) — only Todo issue, spec freshly refreshed, single-PR scope, no design pass needed. [TER-150](https://linear.app/terenc/issue/TER-150/every-click-counts-scoring-color-switches-and-hides-count-as-moves) is the next-best alternative if Chris wants narrower blast radius (touches only `useGame` reducer + tests). [TER-146](https://linear.app/terenc/issue/TER-146/generator-full-coverage-all-3-colors-required-retune) and [TER-153](https://linear.app/terenc/issue/TER-153/win-state-validation-sequence-validating-gamephase-row-pulse-mark-glow) still need design passes before going to Code.

### 2026-05-02 — [TER-148](https://linear.app/terenc/issue/TER-148/game-screen-ux-cleanup-quit-dialog-restart-active-ring-transition) Game-screen UX cleanup (Claude Code / Sonnet 4.6)

Five UX improvements shipped. 120 tests passing (was 115; +5 new GameScreen tests, App.test.tsx updated to advance fake timer after reveal/hide). Build clean.

Changes by section:

* A. `GameScreen.tsx`: removed `window.confirm` from Quit — calls `onPickDifficulty` directly. Added Restart button calling `game.reset()` (stays on game screen, clears transition timer). Added 1-second "Get ready..." transition blank on reveal/hide: local `transitioning: boolean` state + `timerRef: useRef<number | null>` cleared via `useEffect` cleanup; `revealPattern()`/`hidePattern()` called at click time so game timer starts immediately through the blank.
* B. `ColorPicker.tsx`: active-ring changed from `ring-4 ring-white dark:ring-gray-100 ring-offset-2 ring-offset-white dark:ring-offset-gray-950` to `ring-4 ring-blue-500 ring-offset-2 ring-offset-paper dark:ring-offset-ink`. Blue-500 contrasts all three game colors in both themes; Paper/Ink offsets match the brand surfaces from [TER-152](https://linear.app/terenc/issue/TER-152/adopt-rygo-brand-palette-tailwind-v4-theme-tokens-swap-utilities-to).
* C. `Grid.tsx`: cell transition expanded to `transition-[transform,background-color,color] duration-150` (was `transition-transform duration-100`) to smooth color changes on placement. `active:scale-95` retained for interactive cells only.
* D. `GameScreen.test.tsx`: 5 new tests (transition-blank presence during reveal/hide, Restart reset, Quit-without-confirm, stale-timer-after-restart). `App.test.tsx`: advance fake timer 1000ms after reveal before asserting grid cells.
* E. Footer: `Last shipped: TER-148 — UX cleanup`.

**PR:** [https://github.com/Terenc-LLC/rygo/pull/13](<https://github.com/Terenc-LLC/rygo/pull/13>)