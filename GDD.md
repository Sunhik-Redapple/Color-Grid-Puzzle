# Game Design Document (GDD): Grid Puzzle

**Document Version:** 2.0  
**Status:** Living Document / Active Build Reference  
**Engine & Framework:** React (Vite SPA) + TypeScript + Tailwind CSS + Framer Motion  
**Target Platform:** Mobile Web & Desktop (Touch and Mouse Responsive)  
**Art & Aesthetic Direction:** 1010!-Inspired Minimalist Pastel Squircles  

---

## 1. Executive Summary & Game Overview

### 1.1 High Concept
**Grid Puzzle** is a minimalist, tactile orthogonal block-connection puzzle game. Players maneuver colored blocks on a discrete square grid by swapping them into vacant grey spaces to form continuous orthogonal groups that connect with stationary numbered anchor blocks. Every numbered anchor demands an **exact count** of connected blocks—no more, no fewer.

### 1.2 Core Pillars
1. **Clean Tactile Simplicity:** Elegant squircle tiles, soothing pastel palettes, and instant responsive feedback inspired by modern mobile classics like *1010!*.
2. **Deterministic Spatial Logic:** Zero luck or randomness during play. Every level is a handcrafted, deterministic spatial challenge solved through route planning, spatial conservation, and sequencing.
3. **Emergent Mechanical Depth:** Mechanics unfold progressively across 150 levels—from fundamental swapping and single anchors to rainbow wildcards, multi-coloured anchors, and radiant-heat ice thawing.
4. **Fair, Gentle Friction:** Calibrated move limits and an undo system from Level 5 onwards, backed by non-intrusive rewarded simulation loops.

---

## 2. Core Game Loop & Rules Engine

```
       +-------------------------------------------------------+
       |                     HOME SCREEN                       |
       |  - Play (Continue latest unlocked level)              |
       |  - Select Level (1 to 150 grid)                       |
       |  - How to Play Modal                                  |
       +---------------------------+---------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |                   GAMEPLAY SCREEN                     |
       +---------------------------+---------------------------+
                                   |
            +----------------------+----------------------+
            |                      |                      |
            v                      v                      v
     [Tile Selection]       [Undo Action]           [Reset Level]
     Tap colored block      (Refunds 1 move,        Restores initial
     to highlight.          restores snapshot)      level layout
            |
            v
     [Swap Execution]
     Tap grey empty tile.
     Both tiles swap positions.
     (Moves Left - 1)
            |
            v
     [State Evaluation]
     1. BFS Flood Fill from each numbered anchor.
     2. Check for completed target groups (exact size match).
     3. Trigger Radiant Heat Thaw on adjacent frozen blocks.
     4. Update dynamic borders and UI indicators.
            |
            +----------------------+----------------------+
            |                                             |
            v                                             v
  [Moves == 0 & Unsolved]                       [All Anchors Satisfied]
  "Out of Moves" Modal                          "Level Completed!" Text
  - Watch Ad (+5 Moves)                         - Multi-cannon Confetti Burst
  - Restart Level                               - Unlock Next Level in Storage
  - Back to Level Select                        - "Replay" or "Next" CTAs
```

### 2.1 The Invariant Rules
- **Orthogonal Adjacency:** Connections only occur strictly horizontally and vertically (up, down, left, right). Diagonal adjacencies never connect.
- **Valid Movement (Color-to-Grey Only):** Movable colored blocks can **only** swap positions with grey empty tiles. Direct swapping between two colored blocks is forbidden to enforce spatial maneuvering.
- **Stationary Anchors:** Numbered blocks are immovable fixtures. They cannot be selected, dragged, or swapped.
- **Exact Count Completion Rule:** A group is only completed when its connected orthogonal component equals **exactly** the target number specified on the anchor. 
  - *Underfill (Count < N):* Incomplete.
  - *Exact (Count == N):* Fully satisfied; illuminates matching boundary borders.
  - *Overfill (Count > N):* Incomplete. Attaching surplus blocks breaks the group.
- **Victory Condition:** A level is completed when **every** numbered anchor tile on the board has its target group fully and simultaneously satisfied.

---

## 3. Tile Entities & Specialized Mechanics

| Tile Entity | Visual Description | Movable? | Introduced | Special Behavior |
| :--- | :--- | :---: | :---: | :--- |
| **Empty Grey Tile** | Soft flat grey `#ECEEF1` (hover `#E4E7ED`) | Swappable | Level 1 | Vacant slot. Any movable colored tile can swap into it. |
| **Standard Colored Tile** | Curated pastel hue from 12-color palette | Yes | Level 1 | Can be selected and swapped into grey tiles to connect with anchors. |
| **Stationary Anchor Block** | Solid color with high-contrast centered numeral | No | Level 1 | Fixed anchor specifying required group size `N`. |
| **Rainbow Wildcard (Joker)** | 5-color pastel gradient with dynamic neighbor tinting | Yes | Level 31 | Universal wildcard that connects to any color. Adapts borders and split tints dynamically. |
| **Multi-Coloured Anchor** | Diagonal split gradient of 2+ accepted colors + numeral | No | Level 61 | Stationary anchor that accepts any of its specified colors to fulfill its count. |
| **Frozen Ice Block** | Translucent frosted wash, white rim, and snowflake glyph | No (until thawed) | Level 101 | Locked in ice. Thaws permanently when an adjacent group completes. |

---

### 3.1 Color Palette & Contrast Management
The game uses a curated 12-color flat pastel system designed for high visual distinction:

- **Red:** `#EB5872` (Subtle tint: `rgba(235, 88, 114, 0.48)`)
- **Yellow:** `#FFCE54` (Subtle tint: `rgba(255, 206, 84, 0.50)`)
- **Green:** `#48CFAD` (Subtle tint: `rgba(72, 207, 173, 0.48)`)
- **Blue:** `#4FC1E9` (Subtle tint: `rgba(79, 193, 233, 0.48)`)
- **Purple:** `#7B79DB` (Subtle tint: `rgba(123, 121, 219, 0.48)`)
- **Orange:** `#FC6E51` (Subtle tint: `rgba(252, 110, 81, 0.48)`)
- **Pink:** `#EC87C0` (Subtle tint: `rgba(236, 135, 192, 0.48)`)
- **Cyan:** `#3BC2A5` (Subtle tint: `rgba(59, 194, 165, 0.48)`)
- **Lime:** `#A0D468` (Subtle tint: `rgba(160, 212, 104, 0.50)`)
- **Indigo:** `#6366F1` (Subtle tint: `rgba(99, 102, 241, 0.48)`)
- **Amber:** `#F59E0B` (Subtle tint: `rgba(245, 158, 11, 0.48)`)
- **Charcoal:** `#475569` (Subtle tint: `rgba(71, 85, 105, 0.52)`)

#### Dynamic Accessibility Contrast Resolver (`levelHasSimilarGreens`)
When levels combine green-adjacent hues (`green`, `cyan`, `lime`), the engine automatically shifts palettes:
- Standard Green `#48CFAD` shifts to Deep Forest Green `#15803D`.
- Cyan `#3BC2A5` shifts to Mint `#38D39F`.
This ensures clear differentiation on all screens and color-vision conditions.

---

### 3.2 Rainbow Wildcard Blocks (Jokers) — Level 31+
- **Universal Substitution:** Matches any color required by an adjacent anchor.
- **Base Style:** 135-degree pastel blend (`#FFAAA6` -> `#FFD3B5` -> `#DCEDC2` -> `#A8E6CF` -> `#C7CEEA`).
- **Dynamic Neighbor Adaptation:**
  - When placed adjacent to 1 color, a translucent tint of that color overlays the rainbow base.
  - When adjacent to 2 colors, a 50/50 split tint gradient overlays the base.
  - When adjacent to 3+ colors, evenly distributed multi-color stops overlay the base.
- **Cluster Color Sharing:** Adjacent rainbow blocks connect into a shared wildcard cluster, propagating neighbor colors across the entire group.
- **Adaptive SVG Borders:** Outlined by an SVG split-gradient border reflecting all colors it currently bridges.
- **Aesthetic Note:** No star icon is rendered; wildcards are identified purely through soft gradient fills and adaptive border glows.

---

### 3.3 Multi-Coloured Number Blocks — Level 61+
- **Multi-Color Acceptance:** Anchor blocks define an `allowedColors` array (e.g. `allowedColors: ['red', 'blue']`).
- **Visual Design:** Diagonal split background representing each accepted color with high-contrast, centered drop-shadow typography.
- **Connection Flexibility:** Can be satisfied by:
  1. A single pure allowed color set (e.g., 3 Reds).
  2. A mixed set containing any combination of allowed colors (e.g., 2 Reds + 1 Blue).
  3. Either configuration aided by Rainbow wildcards.
- **Completion Glow:** Upon matching the required count, the anchor illuminates with a multi-colored outer border SVG.

---

### 3.4 Frozen Ice Blocks & Radiant Thawing — Level 101+
- **Initial State:** Blocks tagged with `isFrozen: true` start encased in ice.
- **Immobility:** Frozen blocks cannot be tapped, selected, or swapped into. Tapping triggers a tactile horizontal wobble animation (`x: [-3, 3, -2, 2, 0]`) and a hint toast: *"❄️ Block is frozen in ice! Complete an adjacent group to thaw."*
- **Visual Overlay:**
  - Translucent frosted wash (`bg-white/40 backdrop-blur-[1px]`).
  - Crisp geometric white rim with top-left glint accent.
  - Centered crisp white Lucide snowflake crystal glyph.
- **Radiant Heat Thawing Mechanic:**
  - When any anchor group completes, it radiates heat across its tiles and to all orthogonally adjacent neighbors.
  - Any frozen tile that is either **part of the completed group** or **orthogonally adjacent to any tile in the completed group** immediately thaws (`isFrozen -> false`).
  - An amber thermal pulse (`bg-amber-300/25 border-amber-400` with `Sparkles`) dissolves the ice overlay over 750ms.
  - The block becomes a normal movable tile for the remainder of the level.

---

## 4. Game Balance, Move Limits & Economy

### 4.1 Move Limits Progression
| Stage | Level Range | Move Limit Behavior | Rationale |
| :--- | :--- | :--- | :--- |
| **Tutorial** | Levels 1–4 | **Unlimited Moves** (`null`) | Low-friction onboarding for new players to learn mechanics. |
| **Early Stages** | Levels 5–15 | **10 to 12 Moves** | Calibrated to require intentional route planning without frustration. |
| **Intermediate** | Levels 16–30 | **12 to 16 Moves** | Accommodates 4x4 grid routing and tighter bottlenecks. |
| **Rainbow Tier** | Levels 31–60 | **12 to 18 Moves** | Balances wildcard placement with color grouping. |
| **Multi-Color Tier** | Levels 61–100 | **10 to 70 Moves** | Scales smoothly up to complex 6x6 multi-anchor configurations. |
| **Ice & Thaw Tier** | Levels 101–110 | **8 to 36 Moves** | Accounts for sequential group thawing and cascading unfreezes. |
| **Grandmaster** | Levels 111–150 | **16 to 48 Moves** | Strict calibration verified by automated solvers and quadrant builders. |

### 4.2 Move Limit UI & States
- **Moves Badge:** Prominently positioned below the level title on the gameplay screen.
- **Dynamic Warning States:**
  - Normal (> 4 moves): Neutral grey badge (`bg-[#ECEEF1] text-[#0F172A]`).
  - Warning (3–4 moves): Amber badge (`bg-[#FA8231] text-white`).
  - Critical (1–2 moves): Flashing pulsing rose badge (`bg-rose-500 text-white animate-pulse scale-105`).
- **Out of Moves Modal:**
  - Appears when moves reach 0 before completing the level.
  - **Watch Ad (+5 Moves):** Simulates a 3-second rewarded video ad countdown, then adds +5 moves to the existing board state without resetting progress.
  - **Restart Level:** Re-initializes tiles and resets move counter.
  - **Back to Levels:** Returns to the level selection grid.

### 4.3 Undo Moves System (Level 5+)
- **Availability:** Bottom-left navigation bar during active gameplay from Level 5 onwards.
- **Snapshot Stack:** Captures deep copies of `tiles` and `movesLeft` before every valid swap.
- **Undo Economy:**
  - Players start with **3 free undos** (stored in `localStorage: 'grid_puzzle_undo_count'`).
  - Each undo restores the previous board state and refunds 1 move.
- **Out of Undos Modal:**
  - Triggers when the Undo button is tapped at 0 undos.
  - **Watch Ad (+3 Undos):** Simulates a 3-second rewarded video ad and replenishes 3 undos.
  - **Skip:** Closes the modal.

---

## 5. Level Architecture & Content Roadmap (150 Levels)

```
LEVEL PROGRESSION BREAKDOWN (150 Total Levels)
========================================================================================
[1-4]      Tutorial / Onboarding (2x2, 3x3) - Unlimited Moves
[5-30]     Classic Orthogonal Puzzles (3x3, 4x4) - Move Limits & Undo Introduced
[31-60]    Rainbow Wildcards (4x4, 5x5) - Adaptive Tints & Shared Clusters
           *** LEVELS 1 TO 60 ARE STRICTLY PRESERVED AND FINALIZED ***
[61-100]   Multi-Coloured Number Anchors (5x5, 6x6) - Split Color Sets
[101-110]  Ice & Thaw Introduction (6x6) - Frozen Blocks & Radiant Melting
[111-150]  Grandmaster Hybrid Suite (5x5, 6x6, 7x7) - Full Feature Convergence
========================================================================================
```

### 5.1 Level Tier Structure
1. **Tier 1: Onboarding (Levels 1–4):**
   - Introduces single-color movement, empty-slot swapping, anchor numbers, and target sizes.
   - Interactive pointing hand guidance (`TutorialHand`) walks the player through each tap.
2. **Tier 2: Classic Spatial Puzzles (Levels 5–30):**
   - 3x3 and 4x4 grids with 2 to 4 distinct color anchors.
   - Introduces move limits and the undo button. Teaches corridor navigation and corner buffering.
3. **Tier 3: Rainbow Wildcards (Levels 31–60):**
   - Level 31 features dedicated tutorial guidance introducing the rainbow block.
   - 4x4 and 5x5 grids requiring strategic wildcard placement to bridge dual-color goals.
   - **Preserved Level Rule:** All levels 1 through 60 are strictly locked and permanent.
4. **Tier 4: Multi-Coloured Anchors (Levels 61–100):**
   - Level 61 tutorial introduces split-color anchors (e.g. Red/Blue `[3]`).
   - Introduces multi-solution branching, allowing players to choose which color combination to form.
5. **Tier 5: Ice & Radiant Thawing (Levels 101–110):**
   - Level 101 tutorial introduces frozen blocks and radiant heat unfreezing.
   - Puzzles require players to solve an auxiliary anchor first to generate heat and unlock key blocks needed for the master anchor.
6. **Tier 6: Grandmaster Hybrids (Levels 111–150):**
   - Expansive 5x5, 6x6, and 7x7 boards featuring all mechanics simultaneously: frozen tiles, multi-coloured anchors, rainbow wildcards, and tight move limits.
   - Fully validated by automated solvers (`test_levels.mjs`, `build_and_verify_all.mjs`).

---

## 6. User Interface, Experience & Visual Design

### 6.1 Viewport Presence & Proportions
- Designed for flawless mobile framing and clean desktop presentation using an aspect-bounded container (`w-full max-w-[min(92vw,72vh,420px)] min-h-[92vh]`).
- Eliminates vertical scrolling during gameplay; all critical controls, headers, and the board remain in the primary viewport.

### 6.2 Screen Architecture
1. **Home Screen (`home`):**
   - Ambient floating background squircles with slow organic drifting animations.
   - Interactive 3x3 mini logo grid featuring staggered spring pop-ins on load.
   - High-contrast primary "PLAY (LEVEL N)" button with animated sheen sweep.
   - "SELECT LEVEL" secondary CTA and "How to Play" header button.
2. **Level Selection Screen (`level-select`):**
   - Clean top bar with rounded back button (`Undo2` icon) and bold "Levels" heading.
   - 5-column responsive grid displaying all 150 level buttons.
   - Active/current level highlighted in vibrant orange (`#FA8231`) with continuous subtle breathing scale animation.
   - High-speed scroll performance with zero layout shift.
3. **Gameplay Screen (`game`):**
   - **Top Bar:** Back button (left), Level Title + Moves Badge (center), Level Reset button (right).
   - **Center Board:** Square grid container with mathematically calibrated gap and corner radii based on grid dimension.
   - **Context Instruction Area:** Contextual tutorial text, toast notifications, or emerald level completion status.
   - **Bottom Bar:** Undo button with remaining count (left) and How to Play toggle (right). On completion, transforms smoothly into "Replay" and "Next Level" CTAs.

### 6.3 Animated Onboarding & Guidance
- **`TutorialHand` Component:** Custom SVG pointing finger featuring:
  - Concentric tap-ripple animation ring.
  - Pulsing tap-arc highlight over fingertip.
  - Crisp high-contrast drop shadow (`drop-shadow-[0_6px_14px_rgba(0,0,0,0.65)]`).
- **Milestone Tutorial Levels:**
  - *Level 1:* Basic block selection and empty space swap.
  - *Level 2:* Empty-slot-only swapping constraint.
  - *Level 3:* Numbered anchor target size logic.
  - *Level 31:* Rainbow wildcard introduction.
  - *Level 61:* Multi-coloured number block mechanics.
  - *Level 101:* Frozen block and radiant thawing sequence.

### 6.4 Win Celebration (Choreographed Confetti)
Upon solving a level, a 4-stage multi-cannon confetti display fires across the screen:
1. **T+0ms:** High-velocity center fountain blast erupting upwards from the bottom.
2. **T+100ms:** Left angled cannon burst shooting up-right from the bottom-left corner.
3. **T+200ms:** Right angled cannon burst shooting up-left from the bottom-right corner.
4. **T+350ms:** Wide celebration starburst blooming across the lower viewport.
Colors match the game's pastel palette (`#EB5872`, `#FFCE54`, `#48CFAD`, `#4FC1E9`, `#7B79DB`, `#FC6E51`, `#EC87C0`, `#FFAAA6`, `#A8E6CF`, `#C7CEEA`).

---

## 7. Technical Architecture & Algorithms

### 7.1 Tech Stack
- **Framework:** React 19 SPA running on Vite
- **Language:** TypeScript (strict typing)
- **Styling:** Tailwind CSS (utility-first, no external CSS files)
- **Animation:** Framer Motion (`motion/react`) for layout transitions and modal springs
- **Particles:** `canvas-confetti`
- **Iconography:** `lucide-react`

### 7.2 Core Algorithms

#### 1. Breadth-First Search (BFS) Component Analysis
```typescript
function getConnectedComponentForAnchor(
  anchorIdx: number,
  tiles: Tile[],
  gridSize: number
): { indices: number[]; colors: TileColor[] } | null
```
- Traverses the discrete grid starting from each anchor block.
- Identifies contiguous orthogonal neighbors matching either:
  1. The anchor's color (or any color in `allowedColors`).
  2. Any rainbow wildcard block (`isJoker: true`).
- Returns component indices if and only if `visited.size === targetSize`. Any surplus or deficit returns `null`.

#### 2. Radiant Heat Thawing System
```typescript
function checkAndThawTiles(
  currentTiles: Tile[],
  gridSize: number
): { updatedTiles: Tile[]; newlyThawedIds: string[] }
```
- Executes immediately following any tile swap.
- Identifies all tiles belonging to currently satisfied anchor groups.
- Evaluates every frozen tile (`isFrozen: true`):
  - If inside a completed group -> Thaw immediately.
  - If orthogonally adjacent to any tile in a completed group -> Thaw immediately.
- Returns updated tile state and newly thawed IDs to trigger the 750ms amber dissolution effect.

#### 3. Wildcard Cluster Color Propagation
```typescript
function getJokerAdjacentColors(
  index: number,
  tiles: Tile[],
  gridSize: number
): TileColor[]
```
- Performs flood fill across all adjacent wildcard tiles to determine the connected joker cluster.
- Collects all distinct non-grey, non-joker colors neighboring any wildcard in that cluster.
- Enables multi-joker chains to seamlessly share and display blended tints and split borders.

### 7.3 Data Persistence
State is persisted in browser `localStorage`:
- `'grid_puzzle_unlocked_max'`: Highest level unlocked (integer).
- `'grid_puzzle_undo_count'`: Remaining undo moves (integer).

---

## 8. Development & Verification Pipeline

- **Level Verification Suite (`test_levels.mjs`, `build_and_verify_all.mjs`):** Automated solver scripts verify solvability, move count thresholds, and boundary validation for all 150 levels before deployment.
- **Strict Immutability Rule:** Levels 1 through 60 are permanent and immutable. Any new level additions must be appended after Level 60 without altering historical configurations.
- **Build Verification:** App compiles cleanly via `npm run build` with zero TypeScript or linting errors.

---

*End of Game Design Document.*
