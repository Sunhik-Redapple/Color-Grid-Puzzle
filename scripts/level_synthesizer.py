import sys
import random
sys.path.append('scripts')
from validator import verify_solution

def build_level_spec(level_id, grid_size, anchor_specs, moves):
    # anchor_specs: list of dicts:
    # {
    #   'anchor': (r, c, color, number, allowedColors),
    #   'cells': [(r1, c1, color, is_joker), ...]  # remaining cells (excluding anchor) of this component
    # }
    anchors = []
    solution_cells = {}
    
    for spec in anchor_specs:
        a = spec['anchor']
        anchors.append(a)
        for r, c, col, is_j in spec['cells']:
            solution_cells[(r, c)] = (col, is_j)

    # Verify solution first
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

    return {
        'level_id': level_id,
        'grid_size': grid_size,
        'anchors': anchors,
        'solution_cells': solution_cells,
        'moves': moves
    }

print("Synthesizer helper ready")
