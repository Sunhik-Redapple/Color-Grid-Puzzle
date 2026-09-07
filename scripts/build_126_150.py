import sys
sys.path.append('scripts')
from validator import verify_solution
from auto_designer import check_no_joker_leak

def make_level(level_id, grid_size, specs, scramble, frozen, moves):
    # Verify leak
    ok, msg = check_no_joker_leak(grid_size, specs)
    if not ok:
        raise ValueError(f"Level {level_id} leak: {msg}")
    
    # Verify solution
    anchors = [s['anchor'] for s in specs]
    sol_cells = {}
    for s in specs:
        for r, c, col, is_j in s['cells']:
            sol_cells[(r, c)] = (col, is_j)

    sol_tiles = []
    for r in range(grid_size):
        for c in range(grid_size):
            pos = (r, c)
            idx = r * grid_size + c
            t_id = f"l{level_id}-tile-{idx + 1}"
            a_match = [a for a in anchors if a[0] == r and a[1] == c]
            if a_match:
                a = a_match[0]
                t = {'id': t_id, 'color': a[2], 'number': a[3]}
                if len(a) > 4 and a[4]:
                    t['allowedColors'] = a[4]
                sol_tiles.append(t)
            elif pos in sol_cells:
                col, is_j = sol_cells[pos]
                t = {'id': t_id, 'color': 'joker' if is_j else col}
                if is_j:
                    t['isJoker'] = True
                sol_tiles.append(t)
            else:
                sol_tiles.append({'id': t_id, 'color': 'grey'})
    
    ok, msg = verify_solution(grid_size, sol_tiles)
    if not ok:
        raise ValueError(f"Level {level_id} solution failed: {msg}")

    # Build initial
    grid = {}
    anchor_pos = set()
    for a in anchors:
        pos = (a[0], a[1])
        anchor_pos.add(pos)
        t = {'color': a[2], 'number': a[3]}
        if len(a) > 4 and a[4]:
            t['allowedColors'] = a[4]
        grid[pos] = t
    
    for pos, (col, is_j) in sol_cells.items():
        init_pos = scramble.get(pos, pos)
        if init_pos in anchor_pos:
            raise ValueError(f"Level {level_id}: init_pos {init_pos} is anchor")
        if init_pos in grid:
            raise ValueError(f"Level {level_id}: collision at {init_pos}")
        t = {'color': 'joker' if is_j else col}
        if is_j:
            t['isJoker'] = True
        if init_pos in frozen:
            t['isFrozen'] = True
        grid[init_pos] = t

    initial_tiles = []
    for r in range(grid_size):
        for c in range(grid_size):
            pos = (r, c)
            idx = r * grid_size + c
            t_id = f"l{level_id}-tile-{idx + 1}"
            if pos in grid:
                t = dict(grid[pos])
                t['id'] = t_id
                initial_tiles.append(t)
            else:
                initial_tiles.append({'id': t_id, 'color': 'grey'})

    return {
        'id': level_id,
        'title': f"Level {level_id}",
        'gridSize': grid_size,
        'initialTiles': initial_tiles,
        'moves': moves
    }

print("make_level helper ready")
