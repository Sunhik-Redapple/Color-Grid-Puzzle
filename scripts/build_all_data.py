import json
import sys
from validator import verify_solution

levels_data = []
max_moves_data = {}

def add_level(level_id, grid_size, anchors, solution_cells, initial_scramble, frozen_initial_pos, max_moves):
    # 1. Check solution
    sol_tiles = []
    for r in range(grid_size):
        for c in range(grid_size):
            pos = (r, c)
            idx = r * grid_size + c
            tile_id = f"l{level_id}-tile-{idx + 1}"
            anchor_match = [a for a in anchors if a[0] == r and a[1] == c]
            if anchor_match:
                a = anchor_match[0]
                t = {'id': tile_id, 'color': a[2], 'number': a[3]}
                if len(a) > 4 and a[4]:
                    t['allowedColors'] = a[4]
                sol_tiles.append(t)
            elif pos in solution_cells:
                col, is_j = solution_cells[pos]
                t = {'id': tile_id, 'color': 'joker' if is_j else col}
                if is_j:
                    t['isJoker'] = True
                sol_tiles.append(t)
            else:
                sol_tiles.append({'id': tile_id, 'color': 'grey'})
    
    ok, msg = verify_solution(grid_size, sol_tiles)
    if not ok:
        raise ValueError(f"Level {level_id} solution failed verification: {msg}")

    # 2. Build initial tiles
    grid = {}
    for a in anchors:
        pos = (a[0], a[1])
        t = {'color': a[2], 'number': a[3]}
        if len(a) > 4 and a[4]:
            t['allowedColors'] = a[4]
        grid[pos] = t

    for sol_pos, (col, is_j) in solution_cells.items():
        init_pos = initial_scramble.get(sol_pos, sol_pos)
        if init_pos in grid:
            raise ValueError(f"Level {level_id}: collision at {init_pos} for initial placement of {sol_pos}")
        t = {'color': 'joker' if is_j else col}
        if is_j:
            t['isJoker'] = True
        if init_pos in frozen_initial_pos:
            t['isFrozen'] = True
        grid[init_pos] = t

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

    levels_data.append({
        'id': level_id,
        'title': f"Level {level_id}",
        'gridSize': grid_size,
        'initialTiles': initial_tiles
    })
    max_moves_data[level_id] = max_moves

print("Script framework initialized")
