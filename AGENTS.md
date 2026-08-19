# Agent Instructions & Project Rules

## Preserved Level Data Rule
- **Fixed Levels 1 to 60**: All existing 60 levels defined in the codebase are strictly saved and finalized.
- **Do Not Modify Existing Levels**: NEVER change, recalculate, overwrite, delete, or randomize any of the existing levels (1 through 60) unless the user explicitly requests changes to specific levels.
- **Adding New Levels**: Any future levels requested by the user should be appended after Level 60 without altering the configurations of previous levels.

## Gameplay & Aesthetic Rules
- **Rainbow Blocks (Wildcards)**:
  - When neighboring colored blocks are present, rainbow blocks adapt by displaying subtle translucent tints of the neighbor colors over their iridescent rainbow base.
  - When two or more rainbow blocks are adjacent, they connect into a cluster and share all neighbor colors equally across the cluster.
  - Rainbow blocks do not have a star icon; their identity is represented cleanly through the subtle colors, split fills, and multi-color SVG borders.
