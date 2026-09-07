import sys
import json
sys.path.append('scripts')
from validator import verify_solution
from auto_designer import check_no_joker_leak

levels = []
max_moves_map = {}

def add_level(level_id, grid_size, anchor_specs, initial_scramble, frozen_pos, moves):
    # Check joker leaks
    leak_ok, leak_msg = check_no_joker_leak(grid_size, anchor_specs)
    if not leak_ok:
        raise ValueError(f"Level {level_id} joker leak: {leak_msg}")

    anchors = []
    solution_cells = {}
    for spec in anchor_specs:
        a = spec['anchor']
        anchors.append(a)
        for r, c, col, is_j in spec['cells']:
            solution_cells[(r, c)] = (col, is_j)

    # Verify solution
    sol_tiles = []
    for r in range(grid_size):
        for c in range(grid_size):
            pos = (r, c)
            idx = r * grid_size + c
            tile_id = f"l{level_id}-tile-{idx + 1}"
            a_match = [a for a in anchors if a[0] == r and a[1] == c]
            if a_match:
                a = a_match[0]
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

    # Build initial
    grid = {}
    anchor_positions = set()
    for a in anchors:
        pos = (a[0], a[1])
        anchor_positions.add(pos)
        t = {'color': a[2], 'number': a[3]}
        if len(a) > 4 and a[4]:
            t['allowedColors'] = a[4]
        grid[pos] = t

    for sol_pos, (col, is_j) in solution_cells.items():
        init_pos = initial_scramble.get(sol_pos, sol_pos)
        if init_pos in anchor_positions:
            raise ValueError(f"Level {level_id}: movable tile {sol_pos} placed on anchor {init_pos}")
        if init_pos in grid:
            raise ValueError(f"Level {level_id}: collision at {init_pos} for tile {sol_pos}")
        t = {'color': 'joker' if is_j else col}
        if is_j:
            t['isJoker'] = True
        if init_pos in frozen_pos:
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

    levels.append({
        'id': level_id,
        'title': f"Level {level_id}",
        'gridSize': grid_size,
        'initialTiles': initial_tiles
    })
    max_moves_map[level_id] = moves

print("Level builder initialized")
