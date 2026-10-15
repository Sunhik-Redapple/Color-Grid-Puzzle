# GAME DESIGN DOCUMENT (GDD)

**Game Title:** Grid Puzzle  
**Target Platform:** Web (Mobile-First responsive, Tablet & Desktop responsive SPA)  
**Genre:** Spatial Logic / Orthogonal Grouping Puzzle  
**Visual Style:** 1010-inspired clean pastel squircle aesthetic, tactile micro-animations, minimalist high-contrast typography  
**Tech Stack:** React 19, TypeScript, Tailwind CSS, Motion (Framer Motion), Canvas-Confetti, Lucide React  
**Document Version:** 1.0.0 (Levels 1–150 Finalized)

---

## 1. Executive Summary & Core Concept

**Grid Puzzle** is an elegant, accessible, yet deeply challenging spatial deduction puzzle game. The player manipulates a grid of colorful rounded squircle tiles by swapping adjacent blocks to satisfy strict numerical grouping rules. 

Numbered anchor blocks require contiguous, orthogonally connected clusters of matching colored tiles equal in size to the number displayed on the anchor. As players advance through 150 hand-crafted levels, new mechanics seamlessly layer on top of the foundational rules:
- **Wildcard Rainbow Blocks** that adapt dynamically to neighboring colors and bridge multiple groups.
- **Multi-Coloured Number Blocks** allowing flexible color-pairing pathways.
- **Frozen Ice Tiles** that obstruct movement until nearby color clusters are resolved, radiating warmth to thaw them.
- **Calibrated Move Limits & Par Ratings (3-Star Mastery)** rewarding players for finding mathematically optimal solutions.

---

## 2. Pillars of Game Design

1. **Pure Deductive Clarity:** No hidden RNG or luck-based spawning during a level. Every board is a deterministic logic puzzle with clear rules and verifiable solutions.
2. **Tactile & Satisfying Feedback:** Smooth spring swaps, illuminated multi-color borders on completion, subtle wobble on invalid interactions, and vibrant confetti blasts on victory.
3. **Organic Progression (Zero Tutorial Walls):** Mechanics are introduced gradually:
   - *Levels 1–4:* Pure sandbox tutorial with unlimited moves.
   - *Levels 5–60:* Move limits, undo management, multi-anchor puzzles, and rainbow blocks.
   - *Levels 61–100:* Multi-coloured number blocks and complex grid topologies.
   - *Levels 101–150:* Frozen ice mechanics, thaw chain reactions, and grandmaster deductions.
4. **Replayability & Mastery:** Every level features a calibrated **Par Move Target** encouraging players to optimize their deduction paths for a 3-star rating.

---

## 3. Core Gameplay Mechanics

### 3.1. The Grid & Tiles
- **Grid Layout:** Grids range in size from $3 \times 3$ and $4 \times 4$ in early stages, up to $5 \times 5$, $6 \times 6$, and irregular custom layouts in late stages.
- **Tile Properties:**
  - `id`: Unique identifier per tile.
  - `color`: Primary color (`red`, `yellow`, `green`, `blue`, `purple`, `orange`, `pink`, `cyan`, `lime`, `indigo`, `amber`, `charcoal`, `joker`, `grey`).
  - `number`: (Optional) The required size of the connected group.
  - `allowedColors`: (Optional) For multi-color anchors, defines the list of colors that can satisfy this anchor.
  - `isJoker`: (Optional) Designates a wildcard Rainbow Block.
  - `isFrozen`: (Optional) Designates an immobilized ice block that must be thawed.

### 3.2. Move & Swap Rules
1. **Selection:** Tapping/clicking an unfrozen tile highlights it with a focused selection ring.
2. **Orthogonal Swapping:** Tapping an orthogonally adjacent tile (up, down, left, right) executes an animated positional swap.
3. **Non-Adjacent Retargeting:** Tapping an unfrozen tile not adjacent to the currently selected tile updates the active selection without penalizing moves.
4. **Frozen Tiles:** Frozen tiles cannot be dragged, clicked for selection, or swapped. Tapping a frozen tile triggers a subtle locked wobble animation and a snowflake reminder.

### 3.3. Victory Condition & Group Validation
A level is completed when **all** numbered anchor conditions on the board are simultaneously satisfied:
- **Orthogonal Adjacency:** A group consists of connected tiles sharing edges (no diagonals).
- **Exact Size Match:** The connected group of matching color(s) must contain **exactly** the number of tiles specified by the anchor (including the anchor tile itself, or anchors associated with that color cluster).
- **Multi-Coloured Anchor Satisfaction:** If an anchor lists `allowedColors: ['red', 'blue']`, it accepts adjacent tiles of *either* red or blue.
- **Rainbow (Joker) Inclusivity:** Rainbow tiles act as universal wildcards. They count toward the size of any adjacent color group and can connect two or more disjoint colors.
- **No Over-Sized Clusters:** If an anchor demands 3 tiles, a cluster of 4 or 5 connected tiles fails the condition.

---

## 4. Special Mechanics & System Features

### 4.1. Rainbow Wildcard Blocks (Jokers)
- **Visual Design:** An iridescent pastel gradient with a dynamic multi-color SVG border. Does not use star icons; identity is communicated purely through visual color-shifting and subtle split-fills.
- **Dynamic Neighbor Tinting:** Rainbow blocks sample all orthogonally adjacent colors and render translucent tinted accents along their edges.
- **Cluster Linking:** Adjacent rainbow blocks merge into a continuous wildcard conduit, sharing connected colors across the entire rainbow chain.

### 4.2. Multi-Coloured Number Blocks (Levels 61+)
- **Visual Design:** Diagonal split gradients exhibiting the accepted palette (e.g., half-coral red / half-sky blue) with a high-contrast centered numeral.
- **Functionality:** Provides multiple routing options to solve tight spaces. When completed, the tile glows with a composite multi-color outline.

### 4.3. Frozen Ice & Thaw Mechanics (Levels 101+)
- **Visual Design:** Encased in a semi-transparent frosted squircle with geometric glints and a clean snowflake icon.
- **Thawing Trigger:** When a player completes an adjacent color group (or completes a group connected to the frozen tile), the "heat" generated from the completed group immediately thaws the tile.
- **Thaw Animation:** The frosted coating dissolves with an amber warmth pulse, playing an unlocking sound/visual cue and freeing the tile for subsequent moves.

### 4.4. Move Limits, Extra Moves & Undo System
- **Introductory Free Play (Levels 1–4):** Unlimited moves to let players grasp basic mechanics without pressure.
- **Move Counter (Levels 5–150):** Starts with a calibrated move allowance (`maxMoves`). Each swap consumes 1 move.
- **Out of Moves Modal:** When moves reach 0 and the board is incomplete, the game pauses with two choices:
  - **Restart Level:** Resets the board to the initial layout.
  - **Watch Ad for +5 Moves:** Grants 5 bonus moves to continue solving without losing current board arrangement.
- **Undo System:**
  - Players start with 3 undo charges.
  - Reverses the last move, restoring tile positions and refunding 1 move.
  - **Rewarded Extra Undos:** When undos hit 0, tapping Undo offers **Watch Ad for +3 Undos** or **Skip**.

### 4.5. 3-Star Mastery & Par Move Rating
Every level features a deterministic Par Move Target (`parMoves`):
- **3 Stars (Mastery Deduction):** Solved in $\le \text{Par}$ moves (the optimal deduction path).
- **2 Stars (Great Deduction):** Solved within $\text{Par} + 4$ moves.
- **1 Star (Level Cleared):** Solved within the level's total move limit.
- **UI Elements:**
  - **In-Game Header:** Par target badge beside the moves counter.
  - **Victory Dialog:** Animated 3-star display with rating label (`Mastery Deduction`, `Great Deduction`, `Level Cleared`) and exact move comparison (`Completed in X moves · Par: Y moves`).
  - **Level Select Screen:** Each level button displays mini stars earned, with a cumulative counter in the header (`X / 450 Stars`).
  - **Home Screen:** Shows total mastered stars progress.

---

## 5. User Interface & Screen Architecture

### 5.1. Screen Flow
```
[ Home Screen ]
   ├── [ Play / Resume ] ───────> [ Game Screen ]
   │                                   ├── [ Move Limit Modal (Out of Moves) ]
   │                                   ├── [ Undo Ad Modal (0 Undos Left) ]
   │                                   ├── [ How to Play Modal ]
   │                                   └── [ Victory Card ] ───> [ Next Level ]
   └── [ Level Select (1-150) ] ─> [ Game Screen ]
```

### 5.2. Screen Breakdown
1. **Home Screen (`home`):**
   - Game Title with pastel squircle logo branding.
   - Primary "Play Level X" CTA button (resumes highest unlocked level).
   - "Select Level" button.
   - "How to Play" rulebook modal trigger.
   - Mastered Stars counter badge (`X / 450 Stars Mastered`).
2. **Game Screen (`game`):**
   - **Header:** Home navigation button, Level Title, Move Counter badge, Par Target badge, Reset button, and Help button.
   - **Main Area:** Centered board with responsive squircle tile grid and dynamic viewport scaling.
   - **Footer Controls:**
     - Left: Previous Level arrow.
     - Center: Dynamic Status Banner (Selection status / "LEVEL COMPLETED!" with 3-Star rating).
     - Right: Undo button with charge counter (Levels 5+) and Next Level arrow.
3. **Level Select Screen (`levels`):**
   - Back button to Home.
   - Total Star counter header (`X / 450 Stars`).
   - 5-column responsive scrollable grid for all 150 levels.
   - Cards display level number, active highlight, and mini 3-star ratings.

---

## 6. Visual, Audio & Tactile Design

### 6.1. Color Palette (Pastel Squircle Theme)
- **Backgrounds:** Clean slate off-white (`#F8F9FA`, `#ECEEF1`, `#FFFFFF`).
- **Tile Colors:**
  - Red / Coral: `#FF6B6B`
  - Yellow: `#FFD93D`
  - Green / Mint: `#6BCB77`
  - Blue / Sky: `#4D96FF`
  - Purple / Lavender: `#9D4EDD`
  - Orange: `#FA8231`
  - Pink: `#FF75A0`
  - Cyan: `#00D2D3`
  - Lime: `#A3CB38`
  - Charcoal / Slate: `#475569`
- **UI Accents:**
  - Primary Action / Play: Vibrant Orange (`#FA8231`)
  - Stars / Mastery: Radiant Amber (`#F59E0B` / `#FBBF24`)
  - Success / Completion: Emerald (`#10B981`)
  - Ice / Frosted: Sky Tint (`rgba(224, 242, 254, 0.85)`)

### 6.2. Animation Guidelines
- **Tile Transitions:** Framer Motion spring physics (`stiffness: 400`, `damping: 28`) for tactile swaps.
- **Victory Blast:** Multi-origin canvas confetti burst with custom pastel palettes.
- **Star Reveal:** Staggered scale and rotational spring pop (`delay: 0.15s`, `stiffness: 380`) with amber drop shadows.

---

## 7. Level Design Philosophy & Progression Curve

| Level Range | Core Theme | Key Mechanics Introduced |
|---|---|---|
| **1 – 4** | The Basics | Unlimited moves, basic $3 \times 3$ and $4 \times 4$ color grouping, tutorial gestures. |
| **5 – 20** | Deductive Foundations | Move limits introduced (10–12 moves), Undo system active, dual anchors. |
| **21 – 60** | Advanced Spatial Logic | Multi-anchor boards ($5 \times 5$), Rainbow Wildcard blocks, tight parity puzzles. |
| **61 – 100** | Dual Identities | Multi-Coloured Number blocks, non-trivial routing, shared border optimizations. |
| **101 – 150** | The Frost Dimension | Frozen ice blocks, thawing chain reactions, multi-stage cascading logic, 150 grandmaster finale. |

---

## 8. Data Persistence (Local Storage Schema)

| Key | Type | Description |
|---|---|---|
| `grid_puzzle_unlocked_max` | `number` | Highest unlocked level index (1 to 150). |
| `grid_puzzle_level_stars` | `Record<number, number>` | Map of Level ID to highest earned stars (1, 2, or 3). |
| `grid_puzzle_saved_undos` | `number` | Current available undo charges (refreshed or boosted via ads). |

---

## 9. Monitization & Rewarded Ad Flow

- **Non-Intrusive Design:** Zero forced interstitial popups during active solving.
- **Rewarded Touchpoints:**
  1. **+5 Moves on Out-of-Moves:** Player watches a simulated rewarded video to save a near-complete board.
  2. **+3 Undos on Exhaustion:** Player can restore undo charges without resetting their current game.

---

## 10. Future Expansion Roadmap

1. **Daily Puzzle Challenge:** A procedurally validated daily board with global move leaderboards.
2. **Zen Free-Play Mode:** Infinite randomized levels with customizable grid sizes ($4\times 4$ to $8\times 8$).
3. **Dark Mode Theme:** Deep slate/navy background with neon pastel squircle blocks.
4. **Haptic Feedback:** Native vibration API triggers for mobile browser tactile feedback on swap and thaw.
