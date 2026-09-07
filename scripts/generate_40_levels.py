import json
from validator import verify_solution

levels_data = []
max_moves_data = {}

# Helper to build a level
def create_level(level_id, grid_size, title, anchors, solution_cells, initial_scramble, frozen_cells, jokers, max_moves):
    # solution_cells: dict of (r, c) -> (color, is_joker)
    # verify solution first
    sol_tiles = []
    for r in range(grid_size):
        for c in range(grid_size):
            pos = (r, c)
            idx = r * grid_size + c
            tile_id = f"l{level_id}-tile-{idx + 1}"
            
            # Check anchor
            anchor_match = [a for a in anchors if a[0] == r and a[1] == c]
            if anchor_match:
                a = anchor_match[0]
                t = {'id': tile_id, 'color': a[2], 'number': a[3]}
                if a[4]:
                    t['allowedColors'] = a[4]
                sol_tiles.append(t)
            elif pos in solution_cells:
                color, is_j = solution_cells[pos]
                t = {'id': tile_id, 'color': color}
                if is_j:
                    t['isJoker'] = True
                    t['color'] = 'joker'
                sol_tiles.append(t)
            else:
                sol_tiles.append({'id': tile_id, 'color': 'grey'})
    
    ok, msg = verify_solution(grid_size, sol_tiles)
    if not ok:
        raise ValueError(f"Level {level_id} solution failed verification: {msg}")

    # Now create initialTiles based on initial_scramble and frozen_cells
    # initial_scramble is a dict of target_pos -> initial_pos for movable tiles.
    # If a tile in solution_cells is not in initial_scramble, it starts at its target_pos.
    grid = {}
    # Place anchors
    for a in anchors:
        pos = (a[0], a[1])
        t = {'color': a[2], 'number': a[3]}
        if a[4]:
            t['allowedColors'] = a[4]
        grid[pos] = t

    # Gather all colored/joker tiles from solution that are not anchors
    # and assign their initial positions
    for pos, (col, is_j) in solution_cells.items():
        init_pos = initial_scramble.get(pos, pos)
        if init_pos in grid:
            raise ValueError(f"Level {level_id}: collision at {init_pos} for initial placement of {pos}")
        
        t = {'color': col}
        if is_j:
            t['color'] = 'joker'
            t['isJoker'] = True
        if pos in frozen_cells or init_pos in frozen_cells:
            t['isFrozen'] = True
        grid[init_pos] = t

    # Fill remaining with grey
    initial_tiles = []
    for r in range(grid_size):
        for c in range(grid_size):
            pos = (r, c)
            idx = r * grid_size + c
            tile_id = f"l{level_id}-tile-{idx + 1}"
            if pos in grid:
                t = dict(grid[pos])
                t['id'] = tile_id
                initial_tiles.append(t)
            else:
                initial_tiles.append({'id': tile_id, 'color': 'grey'})

    # Verify tile count
    if len(initial_tiles) != grid_size * grid_size:
        raise ValueError(f"Level {level_id}: tile count {len(initial_tiles)} != {grid_size*grid_size}")

    levels_data.append({
        'id': level_id,
        'title': f"Level {level_id}",
        'gridSize': grid_size,
        'initialTiles': initial_tiles
    })
    max_moves_data[level_id] = max_moves

print("create_level helper ready")
