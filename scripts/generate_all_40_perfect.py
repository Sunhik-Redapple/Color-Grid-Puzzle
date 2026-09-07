import sys
import json
import random

sys.path.append('scripts')
from validator import verify_solution
from auto_designer import check_no_joker_leak

levels = []
max_moves_map = {}

def auto_scramble(grid_size, anchors, sol_cells, seed=42):
    rng = random.Random(seed)
    anchor_pos = {(a[0], a[1]) for a in anchors}
    all_non_anchors = [(r, c) for r in range(grid_size) for c in range(grid_size) if (r, c) not in anchor_pos]
    sol_list = list(sol_cells.keys())
    for _ in range(1000):
        chosen = rng.sample(all_non_anchors, len(sol_list))
        displaced = sum(1 for s, c in zip(sol_list, chosen) if s != c)
        if displaced >= len(sol_list) * 0.8:
            return dict(zip(sol_list, chosen))
    return dict(zip(sol_list, sol_list))

def add_level(level_id, grid_size, specs, scramble, frozen, moves):
    leak_ok, leak_msg = check_no_joker_leak(grid_size, specs)
    if not leak_ok:
        raise ValueError(f"Level {level_id} leak: {leak_msg}")

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

    if scramble is None:
        scramble = auto_scramble(grid_size, anchors, sol_cells, seed=level_id * 100 + 7)

    grid = {}
    anchor_pos = set()
    for a in anchors:
        pos = (a[0], a[1])
        anchor_pos.add(pos)
        t = {'color': a[2], 'number': a[3]}
        if len(a) > 4 and a[4]:
            t['allowedColors'] = a[4]
        grid[pos] = t

    # If frozen is an integer N, pick N random movable tiles to freeze
    if isinstance(frozen, int):
        rng = random.Random(level_id * 33 + 5)
        chosen_frozen = set(rng.sample(list(scramble.values()), min(frozen, len(scramble))))
    else:
        chosen_frozen = set(frozen)

    for pos, (col, is_j) in sol_cells.items():
        init_pos = scramble.get(pos, pos)
        if init_pos in anchor_pos:
            raise ValueError(f"Level {level_id}: init_pos {init_pos} is anchor")
        if init_pos in grid:
            raise ValueError(f"Level {level_id}: collision at {init_pos}")
        t = {'color': 'joker' if is_j else col}
        if is_j:
            t['isJoker'] = True
        if init_pos in chosen_frozen:
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

    levels.append({
        'id': level_id,
        'title': f"Level {level_id}",
        'gridSize': grid_size,
        'initialTiles': initial_tiles
    })
    max_moves_map[level_id] = moves

# ==================== 111 - 114 (5x5) ====================
add_level(111, 5, [{'anchor': (0, 0, 'red', 3, None), 'cells': [(0, 1, 'red', False), (1, 0, 'red', False)]}, {'anchor': (4, 4, 'blue', 5, ['blue', 'cyan']), 'cells': [(4, 3, 'cyan', False), (3, 4, 'blue', False), (4, 2, 'cyan', False), (3, 3, 'blue', False)]}], {(0, 1): (0, 3), (1, 0): (1, 0), (4, 3): (1, 1), (3, 4): (2, 4), (4, 2): (4, 1), (3, 3): (3, 3)}, {(1, 1), (3, 3)}, 18)
add_level(112, 5, [{'anchor': (0, 1, 'purple', 4, None), 'cells': [(0, 0, 'purple', False), (1, 1, 'purple', False), (0, 2, 'purple', False)]}, {'anchor': (4, 3, 'orange', 4, ['orange', 'amber']), 'cells': [(4, 2, 'orange', False), (3, 3, 'amber', False), (4, 4, 'orange', False)]}, {'anchor': (2, 4, 'lime', 3, None), 'cells': [(1, 4, 'lime', False), (3, 4, 'lime', False)]}], {(0, 0): (0, 0), (1, 1): (2, 1), (0, 2): (0, 3), (4, 2): (4, 0), (3, 3): (2, 2), (4, 4): (4, 4), (1, 4): (0, 4), (3, 4): (3, 2)}, {(0, 3), (2, 2)}, 22)
add_level(113, 5, [{'anchor': (0, 4, 'pink', 3, None), 'cells': [(0, 3, 'pink', False), (1, 4, 'pink', False)]}, {'anchor': (2, 0, 'green', 4, ['green', 'lime']), 'cells': [(1, 0, 'green', False), (3, 0, 'lime', False), (2, 1, 'joker', True)]}, {'anchor': (4, 2, 'charcoal', 4, None), 'cells': [(4, 1, 'charcoal', False), (4, 3, 'charcoal', False), (3, 2, 'charcoal', False)]}], {(0, 3): (0, 2), (1, 4): (1, 4), (1, 0): (1, 2), (3, 0): (4, 0), (2, 1): (2, 3), (4, 1): (3, 1), (4, 3): (4, 4), (3, 2): (2, 2)}, {(2, 3), (2, 2)}, 24)
add_level(114, 5, [{'anchor': (0, 0, 'indigo', 4, ['indigo', 'purple']), 'cells': [(0, 1, 'indigo', False), (1, 0, 'purple', False), (1, 1, 'indigo', False)]}, {'anchor': (0, 4, 'yellow', 3, None), 'cells': [(0, 3, 'yellow', False), (1, 4, 'yellow', False)]}, {'anchor': (4, 0, 'red', 4, ['red', 'orange']), 'cells': [(3, 0, 'red', False), (4, 1, 'orange', False), (3, 1, 'red', False)]}, {'anchor': (4, 4, 'cyan', 3, None), 'cells': [(3, 4, 'cyan', False), (4, 3, 'cyan', False)]}], {(0, 1): (2, 0), (1, 0): (1, 2), (1, 1): (0, 2), (0, 3): (1, 3), (1, 4): (2, 4), (3, 0): (3, 2), (4, 1): (4, 2), (3, 1): (2, 2), (3, 4): (3, 4), (4, 3): (2, 3)}, {(1, 2), (3, 2)}, 26)

# ==================== 115 - 125 (6x6) ====================
add_level(115, 6, [{'anchor': (0, 0, 'blue', 5, ['blue', 'indigo']), 'cells': [(0, 1, 'blue', False), (1, 0, 'indigo', False), (1, 1, 'blue', False), (0, 2, 'joker', True)]}, {'anchor': (0, 5, 'amber', 4, None), 'cells': [(0, 4, 'amber', False), (1, 5, 'amber', False), (1, 4, 'amber', False)]}, {'anchor': (5, 2, 'green', 5, ['green', 'lime']), 'cells': [(5, 1, 'green', False), (5, 3, 'lime', False), (4, 2, 'green', False), (4, 3, 'lime', False)]}], {(0, 1): (2, 0), (1, 0): (1, 2), (1, 1): (2, 2), (0, 2): (0, 3), (0, 4): (3, 5), (1, 5): (1, 3), (1, 4): (2, 4), (5, 1): (4, 0), (5, 3): (3, 3), (4, 2): (5, 4), (4, 3): (4, 4)}, {(1, 2), (2, 4), (3, 3), (5, 4)}, 30)
add_level(116, 6, [{'anchor': (1, 1, 'orange', 4, None), 'cells': [(0, 1, 'orange', False), (1, 0, 'orange', False), (2, 1, 'orange', False)]}, {'anchor': (1, 4, 'purple', 5, ['purple', 'pink']), 'cells': [(0, 4, 'purple', False), (1, 5, 'pink', False), (2, 4, 'purple', False), (1, 3, 'joker', True)]}, {'anchor': (4, 1, 'cyan', 4, ['cyan', 'blue']), 'cells': [(4, 0, 'cyan', False), (5, 1, 'blue', False), (3, 1, 'cyan', False)]}, {'anchor': (4, 4, 'yellow', 3, None), 'cells': [(4, 5, 'yellow', False), (5, 4, 'yellow', False)]}], {(0, 1): (0, 0), (1, 0): (3, 0), (2, 1): (2, 0), (0, 4): (0, 5), (1, 5): (3, 5), (2, 4): (2, 5), (1, 3): (2, 2), (4, 0): (5, 0), (5, 1): (5, 2), (3, 1): (3, 2), (4, 5): (4, 3), (5, 4): (5, 5)}, {(2, 0), (2, 5), (3, 2), (4, 3)}, 32)
add_level(117, 6, [{'anchor': (0, 2, 'red', 5, ['red', 'orange', 'pink']), 'cells': [(0, 1, 'red', False), (0, 3, 'orange', False), (1, 2, 'pink', False), (1, 3, 'joker', True)]}, {'anchor': (2, 5, 'charcoal', 4, None), 'cells': [(1, 5, 'charcoal', False), (3, 5, 'charcoal', False), (2, 4, 'charcoal', False)]}, {'anchor': (5, 3, 'lime', 5, ['lime', 'green']), 'cells': [(5, 2, 'lime', False), (5, 4, 'green', False), (4, 3, 'lime', False), (4, 4, 'green', False)]}, {'anchor': (3, 0, 'blue', 4, None), 'cells': [(2, 0, 'blue', False), (4, 0, 'blue', False), (3, 1, 'blue', False)]}], {(0, 1): (0, 0), (0, 3): (0, 4), (1, 2): (1, 1), (1, 3): (2, 2), (1, 5): (0, 5), (3, 5): (4, 5), (2, 4): (2, 3), (5, 2): (5, 1), (5, 4): (5, 5), (4, 3): (4, 2), (4, 4): (3, 3), (2, 0): (1, 0), (4, 0): (5, 0), (3, 1): (3, 2)}, {(1, 1), (2, 3), (4, 2), (3, 2), (3, 3)}, 34)
add_level(118, 6, [{'anchor': (0, 0, 'pink', 4, None), 'cells': [(0, 1, 'pink', False), (1, 0, 'pink', False), (1, 1, 'pink', False)]}, {'anchor': (0, 5, 'indigo', 5, ['indigo', 'blue']), 'cells': [(0, 4, 'indigo', False), (1, 5, 'blue', False), (1, 4, 'indigo', False), (0, 3, 'joker', True)]}, {'anchor': (5, 0, 'amber', 5, ['amber', 'yellow']), 'cells': [(4, 0, 'amber', False), (5, 1, 'yellow', False), (4, 1, 'amber', False), (5, 2, 'joker', True)]}, {'anchor': (5, 5, 'cyan', 4, None), 'cells': [(5, 4, 'cyan', False), (4, 5, 'cyan', False), (4, 4, 'cyan', False)]}], {(0, 1): (0, 2), (1, 0): (2, 0), (1, 1): (2, 1), (0, 4): (1, 3), (1, 5): (2, 5), (1, 4): (2, 4), (0, 3): (0, 3), (4, 0): (3, 0), (5, 1): (5, 3), (4, 1): (3, 1), (5, 2): (4, 2), (5, 4): (3, 4), (4, 5): (3, 5), (4, 4): (4, 3)}, {(2, 1), (2, 4), (3, 1), (4, 3), (4, 2)}, 36)
add_level(119, 6, [{'anchor': (1, 0, 'purple', 4, None), 'cells': [(0, 0, 'purple', False), (2, 0, 'purple', False), (1, 1, 'purple', False)]}, {'anchor': (0, 3, 'green', 5, ['green', 'cyan']), 'cells': [(0, 2, 'green', False), (0, 4, 'cyan', False), (1, 3, 'green', False), (1, 4, 'joker', True)]}, {'anchor': (3, 5, 'red', 5, ['red', 'amber']), 'cells': [(2, 5, 'red', False), (4, 5, 'amber', False), (3, 4, 'red', False), (4, 4, 'joker', True)]}, {'anchor': (5, 2, 'orange', 4, None), 'cells': [(5, 1, 'orange', False), (5, 3, 'orange', False), (4, 2, 'orange', False)]}], {(0, 0): (0, 1), (2, 0): (3, 0), (1, 1): (2, 1), (0, 2): (1, 2), (0, 4): (0, 5), (1, 3): (2, 3), (1, 4): (2, 4), (2, 5): (1, 5), (4, 5): (5, 5), (3, 4): (3, 3), (4, 4): (3, 2), (5, 1): (5, 0), (5, 3): (5, 4), (4, 2): (4, 1)}, {(2, 1), (2, 3), (3, 3), (4, 1), (3, 2)}, 36)
add_level(120, 6, [{'anchor': (0, 1, 'blue', 5, ['blue', 'purple']), 'cells': [(0, 0, 'blue', False), (0, 2, 'purple', False), (1, 1, 'blue', False), (1, 2, 'joker', True)]}, {'anchor': (1, 5, 'yellow', 4, None), 'cells': [(0, 5, 'yellow', False), (2, 5, 'yellow', False), (1, 4, 'yellow', False)]}, {'anchor': (4, 0, 'lime', 4, None), 'cells': [(3, 0, 'lime', False), (5, 0, 'lime', False), (4, 1, 'lime', False)]}, {'anchor': (5, 4, 'charcoal', 5, ['charcoal', 'indigo']), 'cells': [(5, 3, 'charcoal', False), (5, 5, 'indigo', False), (4, 4, 'charcoal', False), (4, 3, 'joker', True)]}], {(0, 0): (1, 0), (0, 2): (0, 3), (1, 1): (2, 1), (1, 2): (2, 2), (0, 5): (0, 4), (2, 5): (3, 5), (1, 4): (2, 4), (3, 0): (2, 0), (5, 0): (5, 1), (4, 1): (3, 1), (5, 3): (5, 2), (5, 5): (4, 5), (4, 4): (3, 4), (4, 3): (3, 3)}, {(2, 1), (2, 4), (3, 1), (3, 4), (3, 3)}, 38)
add_level(121, 6, [{'anchor': (0, 0, 'cyan', 5, ['cyan', 'lime', 'green']), 'cells': [(0, 1, 'lime', False), (1, 0, 'joker', True), (1, 1, 'cyan', False), (2, 0, 'green', False)]}, {'anchor': (0, 4, 'pink', 4, None), 'cells': [(0, 3, 'pink', False), (0, 5, 'pink', False), (1, 4, 'pink', False)]}, {'anchor': (3, 1, 'amber', 4, ['amber', 'orange']), 'cells': [(2, 1, 'amber', False), (4, 1, 'orange', False), (3, 2, 'amber', False)]}, {'anchor': (5, 5, 'indigo', 5, None), 'cells': [(5, 4, 'indigo', False), (4, 5, 'indigo', False), (4, 4, 'indigo', False), (5, 3, 'joker', True)]}], {(0, 1): (0, 2), (1, 0): (3, 0), (1, 1): (1, 2), (2, 0): (1, 3), (0, 3): (2, 4), (0, 5): (1, 5), (1, 4): (2, 5), (2, 1): (2, 2), (4, 1): (5, 1), (3, 2): (4, 2), (5, 4): (5, 2), (4, 5): (3, 5), (4, 4): (4, 3), (5, 3): (3, 3)}, {(1, 2), (2, 2), (4, 2), (4, 3), (3, 3)}, 38)
add_level(122, 6, [{'anchor': (1, 2, 'orange', 4, None), 'cells': [(0, 2, 'orange', False), (1, 1, 'orange', False), (1, 3, 'orange', False)]}, {'anchor': (0, 5, 'purple', 5, ['purple', 'indigo']), 'cells': [(0, 4, 'purple', False), (1, 5, 'indigo', False), (1, 4, 'purple', False), (2, 5, 'joker', True)]}, {'anchor': (5, 0, 'red', 5, ['red', 'pink']), 'cells': [(4, 0, 'red', False), (5, 1, 'pink', False), (4, 1, 'red', False), (3, 0, 'joker', True)]}, {'anchor': (4, 3, 'green', 4, None), 'cells': [(3, 3, 'green', False), (5, 3, 'green', False), (4, 4, 'green', False)]}], {(0, 2): (0, 1), (1, 1): (2, 1), (1, 3): (0, 3), (0, 4): (2, 4), (1, 5): (3, 5), (1, 4): (3, 4), (2, 5): (4, 5), (4, 0): (5, 2), (5, 1): (3, 1), (4, 1): (4, 2), (3, 0): (2, 0), (3, 3): (2, 3), (5, 3): (5, 4), (4, 4): (3, 2)}, {(2, 1), (3, 4), (4, 2), (2, 3), (3, 2), (3, 1)}, 40)
add_level(123, 6, [{'anchor': (0, 2, 'yellow', 5, ['yellow', 'amber']), 'cells': [(0, 1, 'yellow', False), (0, 3, 'amber', False), (1, 2, 'yellow', False), (1, 3, 'joker', True)]}, {'anchor': (2, 0, 'blue', 4, None), 'cells': [(1, 0, 'blue', False), (3, 0, 'blue', False), (2, 1, 'blue', False)]}, {'anchor': (3, 5, 'cyan', 5, ['cyan', 'lime']), 'cells': [(2, 5, 'cyan', False), (4, 5, 'lime', False), (3, 4, 'cyan', False), (2, 4, 'joker', True)]}, {'anchor': (5, 3, 'charcoal', 4, None), 'cells': [(5, 4, 'charcoal', False), (4, 3, 'charcoal', False), (5, 2, 'charcoal', False)]}, {'anchor': (5, 1, 'pink', 3, None), 'cells': [(4, 1, 'pink', False), (5, 0, 'pink', False)]}], {(0, 1): (0, 0), (0, 3): (0, 4), (1, 2): (1, 1), (1, 3): (2, 2), (1, 0): (1, 4), (3, 0): (4, 0), (2, 1): (3, 1), (2, 5): (1, 5), (4, 5): (5, 5), (3, 4): (4, 4), (2, 4): (3, 3), (5, 4): (4, 2), (4, 3): (3, 2), (5, 2): (2, 3), (4, 1): (4, 1), (5, 0): (3, 0)}, {(1, 1), (2, 2), (3, 1), (3, 3), (3, 2), (2, 3)}, 42)
add_level(124, 6, [{'anchor': (0, 0, 'indigo', 4, None), 'cells': [(0, 1, 'indigo', False), (1, 0, 'indigo', False), (1, 1, 'indigo', False)]}, {'anchor': (1, 4, 'green', 5, ['green', 'lime', 'cyan']), 'cells': [(0, 4, 'lime', False), (1, 5, 'cyan', False), (2, 4, 'green', False), (1, 3, 'joker', True)]}, {'anchor': (4, 1, 'orange', 5, ['orange', 'red']), 'cells': [(3, 1, 'orange', False), (5, 1, 'red', False), (4, 2, 'orange', False), (4, 0, 'joker', True)]}, {'anchor': (5, 5, 'purple', 4, None), 'cells': [(5, 4, 'purple', False), (4, 5, 'purple', False), (4, 4, 'purple', False)]}], {(0, 1): (0, 2), (1, 0): (2, 0), (1, 1): (2, 1), (0, 4): (0, 3), (1, 5): (2, 5), (2, 4): (3, 4), (1, 3): (2, 3), (3, 1): (3, 0), (5, 1): (5, 2), (4, 2): (3, 2), (4, 0): (5, 0), (5, 4): (5, 3), (4, 5): (3, 5), (4, 4): (4, 3)}, {(2, 1), (2, 3), (3, 2), (4, 3), (3, 4), (2, 5)}, 42)
add_level(125, 6, [{'anchor': (0, 3, 'red', 4, None), 'cells': [(0, 2, 'red', False), (0, 4, 'red', False), (1, 3, 'red', False)]}, {'anchor': (2, 5, 'amber', 5, ['amber', 'yellow']), 'cells': [(1, 5, 'amber', False), (3, 5, 'yellow', False), (2, 4, 'amber', False), (3, 4, 'joker', True)]}, {'anchor': (5, 2, 'blue', 5, ['blue', 'cyan']), 'cells': [(5, 1, 'blue', False), (5, 3, 'cyan', False), (4, 2, 'blue', False), (4, 3, 'cyan', False)]}, {'anchor': (3, 0, 'charcoal', 4, None), 'cells': [(2, 0, 'charcoal', False), (4, 0, 'charcoal', False), (3, 1, 'charcoal', False)]}, {'anchor': (1, 1, 'lime', 3, None), 'cells': [(0, 1, 'lime', False), (1, 0, 'lime', False)]}], None, 6, 44)

# ==================== 126 - 135 (6x6) ====================
add_level(126, 6, [
    {'anchor': (0, 0, 'purple', 4, None), 'cells': [(0, 1, 'purple', False), (1, 0, 'purple', False), (1, 1, 'purple', False)]},
    {'anchor': (0, 5, 'cyan', 5, ['cyan', 'blue']), 'cells': [(0, 4, 'blue', False), (1, 5, 'cyan', False), (1, 4, 'blue', False), (2, 5, 'joker', True)]},
    {'anchor': (5, 0, 'orange', 4, ['orange', 'amber']), 'cells': [(4, 0, 'amber', False), (5, 1, 'orange', False), (4, 1, 'amber', False)]},
    {'anchor': (5, 5, 'lime', 4, None), 'cells': [(5, 4, 'lime', False), (4, 5, 'lime', False), (4, 4, 'lime', False)]},
    {'anchor': (2, 2, 'pink', 3, None), 'cells': [(2, 3, 'pink', False), (3, 2, 'pink', False)]}
], None, 6, 42)

add_level(127, 6, [
    {'anchor': (0, 1, 'green', 5, ['green', 'lime']), 'cells': [(0, 0, 'green', False), (0, 2, 'lime', False), (1, 1, 'green', False), (1, 0, 'joker', True)]},
    {'anchor': (0, 4, 'charcoal', 4, None), 'cells': [(0, 3, 'charcoal', False), (0, 5, 'charcoal', False), (1, 4, 'charcoal', False)]},
    {'anchor': (5, 1, 'red', 5, ['red', 'pink']), 'cells': [(5, 0, 'red', False), (5, 2, 'pink', False), (4, 1, 'red', False), (4, 0, 'joker', True)]},
    {'anchor': (5, 4, 'indigo', 4, None), 'cells': [(5, 3, 'indigo', False), (5, 5, 'indigo', False), (4, 4, 'indigo', False)]},
    {'anchor': (2, 2, 'yellow', 4, ['yellow', 'amber']), 'cells': [(2, 3, 'amber', False), (3, 2, 'yellow', False), (3, 3, 'amber', False)]}
], None, 6, 44)

add_level(128, 6, [
    {'anchor': (0, 0, 'amber', 4, ['amber', 'yellow']), 'cells': [(0, 1, 'amber', False), (1, 0, 'yellow', False), (1, 1, 'amber', False)]},
    {'anchor': (0, 5, 'blue', 5, ['blue', 'cyan']), 'cells': [(0, 4, 'blue', False), (1, 5, 'cyan', False), (1, 4, 'blue', False), (2, 5, 'joker', True)]},
    {'anchor': (5, 0, 'purple', 5, ['purple', 'pink']), 'cells': [(4, 0, 'purple', False), (5, 1, 'pink', False), (4, 1, 'purple', False), (3, 0, 'joker', True)]},
    {'anchor': (5, 5, 'green', 4, None), 'cells': [(5, 4, 'green', False), (4, 5, 'green', False), (4, 4, 'green', False)]},
    {'anchor': (2, 3, 'red', 3, None), 'cells': [(2, 2, 'red', False), (3, 3, 'red', False)]}
], None, 6, 44)

add_level(129, 6, [
    {'anchor': (0, 1, 'lime', 4, ['lime', 'green']), 'cells': [(0, 0, 'lime', False), (0, 2, 'green', False), (1, 1, 'lime', False)]},
    {'anchor': (1, 4, 'orange', 5, ['orange', 'red']), 'cells': [(0, 4, 'orange', False), (1, 5, 'red', False), (2, 4, 'orange', False), (0, 5, 'joker', True)]},
    {'anchor': (4, 1, 'cyan', 4, None), 'cells': [(3, 1, 'cyan', False), (5, 1, 'cyan', False), (4, 0, 'cyan', False)]},
    {'anchor': (5, 4, 'charcoal', 5, ['charcoal', 'indigo']), 'cells': [(5, 3, 'charcoal', False), (5, 5, 'indigo', False), (4, 4, 'charcoal', False), (4, 5, 'joker', True)]},
    {'anchor': (2, 2, 'purple', 3, None), 'cells': [(3, 2, 'purple', False), (2, 3, 'purple', False)]}
], None, 6, 46)

add_level(130, 6, [
    {'anchor': (0, 0, 'pink', 5, ['pink', 'purple']), 'cells': [(0, 1, 'pink', False), (1, 0, 'purple', False), (1, 1, 'pink', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 5, 'yellow', 4, None), 'cells': [(0, 4, 'yellow', False), (1, 5, 'yellow', False), (1, 4, 'yellow', False)]},
    {'anchor': (5, 0, 'blue', 5, ['blue', 'indigo']), 'cells': [(4, 0, 'blue', False), (5, 1, 'indigo', False), (4, 1, 'blue', False), (5, 2, 'joker', True)]},
    {'anchor': (5, 5, 'amber', 4, ['amber', 'orange']), 'cells': [(5, 4, 'amber', False), (4, 5, 'orange', False), (4, 4, 'amber', False)]},
    {'anchor': (2, 3, 'lime', 4, None), 'cells': [(2, 2, 'lime', False), (3, 3, 'lime', False), (3, 2, 'lime', False)]}
], None, 7, 46)

add_level(131, 6, [
    {'anchor': (0, 1, 'indigo', 5, ['indigo', 'blue']), 'cells': [(0, 0, 'indigo', False), (0, 2, 'blue', False), (1, 1, 'indigo', False), (1, 0, 'joker', True)]},
    {'anchor': (1, 5, 'green', 5, ['green', 'lime']), 'cells': [(0, 5, 'green', False), (2, 5, 'lime', False), (1, 4, 'green', False), (0, 4, 'joker', True)]},
    {'anchor': (4, 0, 'red', 4, None), 'cells': [(3, 0, 'red', False), (5, 0, 'red', False), (4, 1, 'red', False)]},
    {'anchor': (5, 4, 'cyan', 4, ['cyan', 'blue']), 'cells': [(5, 3, 'cyan', False), (5, 5, 'blue', False), (4, 4, 'cyan', False)]},
    {'anchor': (2, 2, 'charcoal', 4, None), 'cells': [(2, 3, 'charcoal', False), (3, 2, 'charcoal', False), (3, 3, 'charcoal', False)]}
], None, 7, 46)

add_level(132, 6, [
    {'anchor': (0, 0, 'orange', 5, ['orange', 'amber']), 'cells': [(0, 1, 'orange', False), (1, 0, 'amber', False), (1, 1, 'orange', False), (2, 0, 'joker', True)]},
    {'anchor': (0, 4, 'purple', 4, None), 'cells': [(0, 3, 'purple', False), (0, 5, 'purple', False), (1, 4, 'purple', False)]},
    {'anchor': (5, 0, 'lime', 5, ['lime', 'cyan']), 'cells': [(4, 0, 'lime', False), (5, 1, 'cyan', False), (4, 1, 'joker', True), (5, 2, 'lime', False)]},
    {'anchor': (5, 5, 'pink', 4, None), 'cells': [(5, 4, 'pink', False), (4, 5, 'pink', False), (4, 4, 'pink', False)]},
    {'anchor': (2, 2, 'yellow', 4, None), 'cells': [(2, 3, 'yellow', False), (3, 2, 'yellow', False), (3, 3, 'yellow', False)]}
], None, 7, 48)

add_level(133, 6, [
    {'anchor': (0, 1, 'cyan', 5, ['cyan', 'green']), 'cells': [(0, 0, 'cyan', False), (0, 2, 'green', False), (1, 1, 'cyan', False), (1, 0, 'joker', True)]},
    {'anchor': (0, 5, 'red', 5, ['red', 'orange']), 'cells': [(0, 4, 'red', False), (1, 5, 'orange', False), (1, 4, 'red', False), (2, 5, 'joker', True)]},
    {'anchor': (4, 0, 'charcoal', 4, None), 'cells': [(3, 0, 'charcoal', False), (5, 0, 'charcoal', False), (4, 1, 'charcoal', False)]},
    {'anchor': (5, 4, 'blue', 5, ['blue', 'purple']), 'cells': [(5, 3, 'blue', False), (5, 5, 'purple', False), (4, 4, 'blue', False), (4, 3, 'joker', True)]},
    {'anchor': (2, 2, 'amber', 3, None), 'cells': [(2, 3, 'amber', False), (3, 2, 'amber', False)]}
], None, 7, 48)

add_level(134, 6, [
    {'anchor': (0, 0, 'amber', 5, ['amber', 'yellow']), 'cells': [(0, 1, 'amber', False), (1, 0, 'yellow', False), (1, 1, 'amber', False), (2, 0, 'joker', True)]},
    {'anchor': (0, 5, 'lime', 4, None), 'cells': [(0, 4, 'lime', False), (1, 5, 'lime', False), (1, 4, 'lime', False)]},
    {'anchor': (5, 0, 'indigo', 5, ['indigo', 'purple']), 'cells': [(4, 0, 'indigo', False), (5, 1, 'purple', False), (4, 1, 'joker', True), (5, 2, 'indigo', False)]},
    {'anchor': (5, 5, 'green', 5, ['green', 'cyan']), 'cells': [(5, 4, 'green', False), (4, 5, 'cyan', False), (4, 4, 'green', False), (3, 5, 'joker', True)]},
    {'anchor': (2, 2, 'pink', 4, None), 'cells': [(2, 3, 'pink', False), (3, 2, 'pink', False), (3, 3, 'pink', False)]}
], None, 8, 48)

add_level(135, 6, [
    {'anchor': (0, 0, 'red', 6, ['red', 'orange', 'pink']), 'cells': [(0, 1, 'red', False), (1, 0, 'orange', False), (1, 1, 'joker', True), (2, 0, 'red', False), (2, 1, 'pink', False)]},
    {'anchor': (0, 5, 'blue', 6, ['blue', 'indigo', 'cyan']), 'cells': [(0, 4, 'blue', False), (1, 5, 'indigo', False), (1, 4, 'joker', True), (2, 5, 'blue', False), (2, 4, 'cyan', False)]},
    {'anchor': (5, 0, 'green', 6, ['green', 'lime', 'cyan']), 'cells': [(4, 0, 'green', False), (5, 1, 'lime', False), (4, 1, 'joker', True), (5, 2, 'green', False), (4, 2, 'cyan', False)]},
    {'anchor': (5, 5, 'purple', 5, None), 'cells': [(5, 4, 'purple', False), (4, 5, 'purple', False), (4, 4, 'joker', True), (3, 5, 'purple', False)]},
    {'anchor': (2, 2, 'yellow', 3, None), 'cells': [(2, 3, 'yellow', False), (3, 2, 'yellow', False)]}
], None, 8, 50)

# ==================== 136 - 150 (7x7) ====================
add_level(136, 7, [
    {'anchor': (0, 0, 'red', 6, ['red', 'orange']), 'cells': [(0, 1, 'red', False), (1, 0, 'orange', False), (1, 1, 'red', False), (2, 0, 'orange', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'blue', 5, ['blue', 'cyan']), 'cells': [(0, 5, 'blue', False), (1, 6, 'cyan', False), (1, 5, 'blue', False), (2, 6, 'joker', True)]},
    {'anchor': (6, 0, 'lime', 6, ['lime', 'green']), 'cells': [(5, 0, 'lime', False), (6, 1, 'green', False), (5, 1, 'lime', False), (4, 0, 'green', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'purple', 5, None), 'cells': [(6, 5, 'purple', False), (5, 6, 'purple', False), (5, 5, 'purple', False), (4, 6, 'joker', True)]},
    {'anchor': (3, 3, 'amber', 4, None), 'cells': [(2, 3, 'amber', False), (4, 3, 'amber', False), (3, 2, 'amber', False)]}
], None, 8, 52)

add_level(137, 7, [
    {'anchor': (0, 0, 'green', 6, ['green', 'lime']), 'cells': [(0, 1, 'green', False), (1, 0, 'lime', False), (1, 1, 'green', False), (2, 0, 'lime', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'pink', 5, None), 'cells': [(0, 5, 'pink', False), (1, 6, 'pink', False), (1, 5, 'pink', False), (2, 6, 'pink', False)]},
    {'anchor': (6, 0, 'orange', 6, ['orange', 'amber']), 'cells': [(5, 0, 'orange', False), (6, 1, 'amber', False), (5, 1, 'orange', False), (4, 0, 'amber', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'indigo', 5, ['indigo', 'blue']), 'cells': [(6, 5, 'indigo', False), (5, 6, 'blue', False), (5, 5, 'indigo', False), (4, 6, 'joker', True)]},
    {'anchor': (3, 3, 'cyan', 4, None), 'cells': [(3, 2, 'cyan', False), (3, 4, 'cyan', False), (2, 3, 'cyan', False)]}
], None, 8, 52)

add_level(138, 7, [
    {'anchor': (0, 0, 'cyan', 6, ['cyan', 'blue']), 'cells': [(0, 1, 'cyan', False), (1, 0, 'blue', False), (1, 1, 'cyan', False), (2, 0, 'blue', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'red', 6, ['red', 'pink']), 'cells': [(0, 5, 'red', False), (1, 6, 'pink', False), (1, 5, 'red', False), (2, 6, 'pink', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'yellow', 5, None), 'cells': [(5, 0, 'yellow', False), (6, 1, 'yellow', False), (5, 1, 'yellow', False), (4, 0, 'yellow', False)]},
    {'anchor': (6, 6, 'charcoal', 6, ['charcoal', 'indigo']), 'cells': [(6, 5, 'charcoal', False), (5, 6, 'indigo', False), (5, 5, 'charcoal', False), (4, 6, 'indigo', False), (6, 4, 'joker', True)]},
    {'anchor': (3, 3, 'lime', 4, None), 'cells': [(3, 2, 'lime', False), (3, 4, 'lime', False), (4, 3, 'lime', False)]}
], None, 8, 54)

add_level(139, 7, [
    {'anchor': (0, 0, 'amber', 6, ['amber', 'orange']), 'cells': [(0, 1, 'amber', False), (1, 0, 'orange', False), (1, 1, 'amber', False), (2, 0, 'orange', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'lime', 6, ['lime', 'green']), 'cells': [(0, 5, 'lime', False), (1, 6, 'green', False), (1, 5, 'lime', False), (2, 6, 'green', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'blue', 6, ['blue', 'cyan']), 'cells': [(5, 0, 'blue', False), (6, 1, 'cyan', False), (5, 1, 'blue', False), (4, 0, 'cyan', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'pink', 5, None), 'cells': [(6, 5, 'pink', False), (5, 6, 'pink', False), (5, 5, 'pink', False), (4, 6, 'pink', False)]},
    {'anchor': (3, 3, 'purple', 4, None), 'cells': [(2, 3, 'purple', False), (4, 3, 'purple', False), (3, 2, 'purple', False)]}
], None, 8, 54)

add_level(140, 7, [
    {'anchor': (0, 0, 'purple', 6, ['purple', 'pink']), 'cells': [(0, 1, 'purple', False), (1, 0, 'pink', False), (1, 1, 'purple', False), (2, 0, 'pink', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'amber', 6, ['amber', 'yellow']), 'cells': [(0, 5, 'amber', False), (1, 6, 'yellow', False), (1, 5, 'amber', False), (2, 6, 'yellow', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'green', 6, ['green', 'cyan']), 'cells': [(5, 0, 'green', False), (6, 1, 'cyan', False), (5, 1, 'green', False), (4, 0, 'cyan', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'red', 5, None), 'cells': [(6, 5, 'red', False), (5, 6, 'red', False), (5, 5, 'red', False), (4, 6, 'red', False)]},
    {'anchor': (3, 3, 'indigo', 4, None), 'cells': [(3, 2, 'indigo', False), (3, 4, 'indigo', False), (2, 3, 'indigo', False)]}
], None, 8, 54)

add_level(141, 7, [
    {'anchor': (0, 0, 'indigo', 6, ['indigo', 'blue']), 'cells': [(0, 1, 'indigo', False), (1, 0, 'blue', False), (1, 1, 'indigo', False), (2, 0, 'blue', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'cyan', 6, ['cyan', 'lime']), 'cells': [(0, 5, 'cyan', False), (1, 6, 'lime', False), (1, 5, 'cyan', False), (2, 6, 'lime', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'orange', 6, ['orange', 'red']), 'cells': [(5, 0, 'orange', False), (6, 1, 'red', False), (5, 1, 'orange', False), (4, 0, 'red', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'yellow', 5, None), 'cells': [(6, 5, 'yellow', False), (5, 6, 'yellow', False), (5, 5, 'yellow', False), (4, 6, 'yellow', False)]},
    {'anchor': (3, 3, 'charcoal', 4, None), 'cells': [(2, 3, 'charcoal', False), (4, 3, 'charcoal', False), (3, 4, 'charcoal', False)]}
], None, 8, 54)

add_level(142, 7, [
    {'anchor': (0, 0, 'lime', 6, ['lime', 'green', 'cyan']), 'cells': [(0, 1, 'lime', False), (1, 0, 'green', False), (1, 1, 'cyan', False), (2, 0, 'lime', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'charcoal', 6, ['charcoal', 'indigo']), 'cells': [(0, 5, 'charcoal', False), (1, 6, 'indigo', False), (1, 5, 'charcoal', False), (2, 6, 'indigo', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'pink', 6, ['pink', 'purple']), 'cells': [(5, 0, 'pink', False), (6, 1, 'purple', False), (5, 1, 'pink', False), (4, 0, 'purple', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'blue', 5, None), 'cells': [(6, 5, 'blue', False), (5, 6, 'blue', False), (5, 5, 'blue', False), (4, 6, 'blue', False)]},
    {'anchor': (3, 3, 'amber', 4, None), 'cells': [(3, 2, 'amber', False), (3, 4, 'amber', False), (4, 3, 'amber', False)]}
], None, 8, 56)

add_level(143, 7, [
    {'anchor': (0, 0, 'red', 6, ['red', 'orange']), 'cells': [(0, 1, 'red', False), (1, 0, 'orange', False), (1, 1, 'red', False), (2, 0, 'orange', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'blue', 6, ['blue', 'cyan']), 'cells': [(0, 5, 'blue', False), (1, 6, 'cyan', False), (1, 5, 'blue', False), (2, 6, 'cyan', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'green', 6, ['green', 'lime']), 'cells': [(5, 0, 'green', False), (6, 1, 'lime', False), (5, 1, 'green', False), (4, 0, 'lime', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'amber', 6, ['amber', 'yellow']), 'cells': [(6, 5, 'amber', False), (5, 6, 'yellow', False), (5, 5, 'amber', False), (4, 6, 'yellow', False), (6, 4, 'joker', True)]},
    {'anchor': (3, 3, 'purple', 4, None), 'cells': [(2, 3, 'purple', False), (4, 3, 'purple', False), (3, 2, 'purple', False)]},
    {'anchor': (3, 0, 'charcoal', 3, None), 'cells': [(3, 1, 'charcoal', False), (2, 1, 'charcoal', False)]}
], None, 9, 56)

add_level(144, 7, [
    {'anchor': (0, 0, 'orange', 6, ['orange', 'amber']), 'cells': [(0, 1, 'orange', False), (1, 0, 'joker', True), (1, 1, 'orange', False), (2, 0, 'amber', False), (2, 1, 'amber', False)]},
    {'anchor': (0, 6, 'indigo', 6, ['indigo', 'blue']), 'cells': [(0, 5, 'indigo', False), (1, 6, 'joker', True), (1, 5, 'indigo', False), (2, 6, 'blue', False), (2, 5, 'blue', False)]},
    {'anchor': (6, 0, 'lime', 6, ['lime', 'cyan']), 'cells': [(5, 0, 'joker', True), (6, 1, 'cyan', False), (5, 1, 'lime', False), (4, 0, 'cyan', False), (4, 1, 'lime', False)]},
    {'anchor': (6, 6, 'charcoal', 6, None), 'cells': [(6, 5, 'charcoal', False), (5, 6, 'charcoal', False), (5, 5, 'charcoal', False), (4, 6, 'charcoal', False), (6, 4, 'charcoal', False)]},
    {'anchor': (3, 3, 'pink', 4, None), 'cells': [(2, 3, 'pink', False), (4, 3, 'pink', False), (3, 4, 'pink', False)]},
    {'anchor': (0, 3, 'yellow', 3, None), 'cells': [(1, 3, 'yellow', False), (1, 4, 'yellow', False)]}
], None, 9, 56)

add_level(145, 7, [
    {'anchor': (0, 0, 'cyan', 6, ['cyan', 'blue']), 'cells': [(0, 1, 'cyan', False), (1, 0, 'joker', True), (1, 1, 'cyan', False), (2, 0, 'blue', False), (2, 1, 'blue', False)]},
    {'anchor': (0, 6, 'purple', 6, ['purple', 'pink']), 'cells': [(0, 5, 'purple', False), (1, 6, 'joker', True), (1, 5, 'purple', False), (2, 6, 'pink', False), (2, 5, 'pink', False)]},
    {'anchor': (6, 0, 'amber', 6, ['amber', 'orange']), 'cells': [(5, 0, 'joker', True), (6, 1, 'orange', False), (5, 1, 'amber', False), (4, 0, 'orange', False), (4, 1, 'amber', False)]},
    {'anchor': (6, 6, 'green', 6, ['green', 'lime']), 'cells': [(6, 5, 'green', False), (5, 6, 'joker', True), (5, 5, 'lime', False), (4, 6, 'lime', False), (4, 5, 'green', False)]},
    {'anchor': (3, 3, 'red', 4, None), 'cells': [(3, 2, 'red', False), (3, 4, 'red', False), (2, 3, 'red', False)]},
    {'anchor': (6, 3, 'blue', 3, None), 'cells': [(5, 3, 'blue', False), (5, 4, 'blue', False)]}
], None, 9, 58)

add_level(146, 7, [
    {'anchor': (0, 0, 'pink', 6, ['pink', 'purple']), 'cells': [(0, 1, 'pink', False), (1, 0, 'purple', False), (1, 1, 'pink', False), (2, 0, 'purple', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'yellow', 6, None), 'cells': [(0, 5, 'yellow', False), (1, 6, 'yellow', False), (1, 5, 'yellow', False), (2, 6, 'yellow', False), (0, 4, 'yellow', False)]},
    {'anchor': (6, 0, 'indigo', 6, ['indigo', 'blue']), 'cells': [(5, 0, 'indigo', False), (6, 1, 'blue', False), (5, 1, 'indigo', False), (4, 0, 'blue', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'orange', 6, ['orange', 'red']), 'cells': [(6, 5, 'orange', False), (5, 6, 'red', False), (5, 5, 'orange', False), (4, 6, 'red', False), (6, 4, 'joker', True)]},
    {'anchor': (3, 3, 'lime', 4, None), 'cells': [(2, 3, 'lime', False), (4, 3, 'lime', False), (3, 2, 'lime', False)]},
    {'anchor': (3, 6, 'charcoal', 3, None), 'cells': [(3, 5, 'charcoal', False), (2, 5, 'charcoal', False)]}
], None, 9, 58)

add_level(147, 7, [
    {'anchor': (0, 0, 'red', 6, ['red', 'orange']), 'cells': [(0, 1, 'red', False), (1, 0, 'orange', False), (1, 1, 'red', False), (2, 0, 'orange', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'blue', 6, ['blue', 'cyan']), 'cells': [(0, 5, 'blue', False), (1, 6, 'cyan', False), (1, 5, 'blue', False), (2, 6, 'cyan', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'green', 6, ['green', 'lime']), 'cells': [(5, 0, 'green', False), (6, 1, 'lime', False), (5, 1, 'green', False), (4, 0, 'lime', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'amber', 6, ['amber', 'yellow']), 'cells': [(6, 5, 'amber', False), (5, 6, 'yellow', False), (5, 5, 'amber', False), (4, 6, 'yellow', False), (6, 4, 'joker', True)]},
    {'anchor': (2, 3, 'purple', 4, None), 'cells': [(1, 3, 'purple', False), (2, 2, 'purple', False), (2, 4, 'purple', False)]},
    {'anchor': (4, 3, 'cyan', 4, None), 'cells': [(5, 3, 'cyan', False), (4, 2, 'cyan', False), (4, 4, 'cyan', False)]}
], None, 10, 58)

add_level(148, 7, [
    {'anchor': (0, 0, 'lime', 6, ['lime', 'green']), 'cells': [(0, 1, 'lime', False), (1, 0, 'green', False), (1, 1, 'lime', False), (2, 0, 'green', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'indigo', 6, ['indigo', 'blue']), 'cells': [(0, 5, 'indigo', False), (1, 6, 'blue', False), (1, 5, 'indigo', False), (2, 6, 'blue', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'orange', 6, ['orange', 'amber']), 'cells': [(5, 0, 'orange', False), (6, 1, 'amber', False), (5, 1, 'orange', False), (4, 0, 'amber', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'charcoal', 6, None), 'cells': [(6, 5, 'charcoal', False), (5, 6, 'charcoal', False), (5, 5, 'charcoal', False), (4, 6, 'charcoal', False), (6, 4, 'charcoal', False)]},
    {'anchor': (2, 3, 'pink', 4, None), 'cells': [(1, 3, 'pink', False), (2, 2, 'pink', False), (2, 4, 'pink', False)]},
    {'anchor': (4, 3, 'yellow', 4, None), 'cells': [(5, 3, 'yellow', False), (4, 2, 'yellow', False), (4, 4, 'yellow', False)]}
], None, 10, 58)

add_level(149, 7, [
    {'anchor': (0, 0, 'cyan', 7, ['cyan', 'blue', 'green']), 'cells': [(0, 1, 'cyan', False), (1, 0, 'blue', False), (1, 1, 'green', False), (2, 0, 'blue', False), (2, 1, 'cyan', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'amber', 7, ['amber', 'yellow', 'orange']), 'cells': [(0, 5, 'amber', False), (1, 6, 'yellow', False), (1, 5, 'orange', False), (2, 6, 'yellow', False), (2, 5, 'amber', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'purple', 7, ['purple', 'indigo', 'pink']), 'cells': [(5, 0, 'purple', False), (6, 1, 'indigo', False), (5, 1, 'pink', False), (4, 0, 'indigo', False), (4, 1, 'purple', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'red', 7, ['red', 'orange', 'pink']), 'cells': [(6, 5, 'red', False), (5, 6, 'orange', False), (5, 5, 'pink', False), (4, 6, 'orange', False), (4, 5, 'red', False), (6, 4, 'joker', True)]},
    {'anchor': (3, 1, 'lime', 3, None), 'cells': [(3, 2, 'lime', False), (2, 2, 'lime', False)]},
    {'anchor': (3, 5, 'charcoal', 3, None), 'cells': [(3, 4, 'charcoal', False), (4, 4, 'charcoal', False)]}
], None, 10, 60)

# Level 150 - The Grand Masterpiece
add_level(150, 7, [
    {'anchor': (0, 0, 'indigo', 7, ['indigo', 'blue', 'purple']), 'cells': [(0, 1, 'indigo', False), (1, 0, 'blue', False), (1, 1, 'purple', False), (2, 0, 'blue', False), (2, 1, 'indigo', False), (0, 2, 'joker', True)]},
    {'anchor': (0, 6, 'green', 7, ['green', 'lime', 'cyan']), 'cells': [(0, 5, 'green', False), (1, 6, 'lime', False), (1, 5, 'cyan', False), (2, 6, 'lime', False), (2, 5, 'green', False), (0, 4, 'joker', True)]},
    {'anchor': (6, 0, 'orange', 7, ['orange', 'amber', 'red']), 'cells': [(5, 0, 'orange', False), (6, 1, 'amber', False), (5, 1, 'red', False), (4, 0, 'amber', False), (4, 1, 'orange', False), (6, 2, 'joker', True)]},
    {'anchor': (6, 6, 'pink', 7, ['pink', 'purple', 'red']), 'cells': [(6, 5, 'pink', False), (5, 6, 'purple', False), (5, 5, 'red', False), (4, 6, 'purple', False), (4, 5, 'pink', False), (6, 4, 'joker', True)]},
    {'anchor': (2, 3, 'yellow', 4, None), 'cells': [(1, 3, 'yellow', False), (2, 2, 'yellow', False), (2, 4, 'yellow', False)]},
    {'anchor': (4, 3, 'charcoal', 4, None), 'cells': [(5, 3, 'charcoal', False), (4, 2, 'charcoal', False), (4, 4, 'charcoal', False)]}
], None, 12, 60)

print(f"All {len(levels)} levels (111-150) successfully verified!")

# Write to TypeScript file
ts_output = """import { LevelConfig } from './types';

export const LEVELS_111_150: LevelConfig[] = [
"""

for lvl in levels:
    ts_output += f"  {{\n    id: {lvl['id']},\n    title: '{lvl['title']}',\n    gridSize: {lvl['gridSize']},\n    initialTiles: [\n"
    for t in lvl['initialTiles']:
        fields = [f"id: '{t['id']}'", f"color: '{t['color']}'"]
        if 'number' in t:
            fields.append(f"number: {t['number']}")
        if t.get('isJoker'):
            fields.append("isJoker: true")
        if t.get('isFrozen'):
            fields.append("isFrozen: true")
        if t.get('allowedColors'):
            ac_str = "[" + ", ".join([f"'{c}'" for c in t['allowedColors']]) + "]"
            fields.append(f"allowedColors: {ac_str}")
        ts_output += "      { " + ", ".join(fields) + " },\n"
    ts_output += "    ],\n  },\n"

ts_output += "];\n\nexport const LEVEL_MAX_MOVES_111_150: Record<number, number> = {\n"
for lvl_id, mv in sorted(max_moves_map.items()):
    ts_output += f"  {lvl_id}: {mv},\n"
ts_output += "};\n"

with open("src/levels_111_150.ts", "w") as f:
    f.write(ts_output)

print("Saved src/levels_111_150.ts successfully!")
