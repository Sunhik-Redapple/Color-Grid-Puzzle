# Agent Instructions & Project Rules

## Preserved Level Data Rule
- **Fixed Levels 1 to 60**: All existing 60 levels defined in the codebase are strictly saved and finalized.
- **Do Not Modify Existing Levels**: NEVER change, recalculate, overwrite, delete, or randomize any of the existing levels (1 through 60) unless the user explicitly requests changes to specific levels.
- **Adding New Levels**: Any future levels requested by the user should be appended after Level 60 without altering the configurations of previous levels.

## Gameplay & Aesthetic Rules
- **Move Limits & Rewarded Extra Moves**:
  - Levels 1 to 4 have unlimited moves as introductory tutorial stages.
  - Starting from Level 5, levels have a calibrated move limit (starting at 10 moves for Level 5 and scaled with grid complexity).
  - When moves hit 0 without completing the level, an "Out of Moves" modal offers the player two primary actions: **Restart Level** or **Watch Ad for +5 Moves** (which grants 5 moves to continue solving the level without losing their board progress).
- **Undo Moves & Rewarded Extra Undos (Level 5+)**:
  - From Level 5 onwards, players have an Undo button in the bottom bar to reverse their last move (restoring the previous board snapshot and refunding the move).
  - Players start with 3 Undo moves.
  - When undos are exhausted (0 undos), tapping Undo presents a modal allowing the player to either **Watch Ad for +3 Undos** or **Skip**.
- **Rainbow Blocks (Wildcards)**:
  - When neighboring colored blocks are present, rainbow blocks adapt by displaying subtle translucent tints of the neighbor colors over their iridescent rainbow base.
  - When two or more rainbow blocks are adjacent, they connect into a cluster and share all neighbor colors equally across the cluster.
  - Rainbow blocks do not have a star icon; their identity is represented cleanly through the subtle colors, split fills, and multi-color SVG borders.
- **Multi-Coloured Number Blocks (Level 61+)**:
  - Numbered anchor blocks can specify two or more allowed colors (e.g. `allowedColors: ['red', 'blue']`).
  - Players can place any of the specified color blocks adjacent to the multi-coloured anchor to form connected orthogonal sets matching the anchor's target number.
  - Visually styled with clean diagonal split gradients representing the accepted colors, crisp high-contrast centered typography, and multi-colored illuminated border glows upon completion.

