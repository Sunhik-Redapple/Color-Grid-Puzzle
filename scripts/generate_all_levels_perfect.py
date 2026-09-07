import sys
import json
sys.path.append('scripts')
from validator import verify_solution

levels = []
max_moves_map = {}

def add_level(level_id, grid_size, anchor_specs, initial_scramble, frozen_pos, moves):
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

# ==================== 111 - 114 (5x5) ====================
add_level(
    111, 5,
    [
        {'anchor': (0, 0, 'red', 3, None), 'cells': [(0, 1, 'red', False), (1, 0, 'red', False)]},
        {'anchor': (4, 4, 'blue', 5, ['blue', 'cyan']), 'cells': [
            (4, 3, 'cyan', False), (3, 4, 'blue', False), (4, 2, 'cyan', False), (3, 3, 'blue', False)
        ]}
    ],
    initial_scramble={(0, 1): (0, 3), (1, 0): (1, 0), (4, 3): (1, 1), (3, 4): (2, 4), (4, 2): (4, 1), (3, 3): (3, 3)},
    frozen_pos={(1, 1), (3, 3)},
    moves=18
)

add_level(
    112, 5,
    [
        {'anchor': (0, 1, 'purple', 4, None), 'cells': [(0, 0, 'purple', False), (1, 1, 'purple', False), (0, 2, 'purple', False)]},
        {'anchor': (4, 3, 'orange', 4, ['orange', 'amber']), 'cells': [(4, 2, 'orange', False), (3, 3, 'amber', False), (4, 4, 'orange', False)]},
        {'anchor': (2, 4, 'lime', 3, None), 'cells': [(1, 4, 'lime', False), (3, 4, 'lime', False)]}
    ],
    initial_scramble={(0, 0): (0, 0), (1, 1): (2, 1), (0, 2): (0, 3), (4, 2): (4, 0), (3, 3): (2, 2), (4, 4): (4, 4), (1, 4): (0, 4), (3, 4): (3, 2)},
    frozen_pos={(0, 3), (2, 2)},
    moves=22
)

add_level(
    113, 5,
    [
        {'anchor': (0, 4, 'pink', 3, None), 'cells': [(0, 3, 'pink', False), (1, 4, 'pink', False)]},
        {'anchor': (2, 0, 'green', 4, ['green', 'lime']), 'cells': [(1, 0, 'green', False), (3, 0, 'lime', False), (2, 1, 'joker', True)]},
        {'anchor': (4, 2, 'charcoal', 4, None), 'cells': [(4, 1, 'charcoal', False), (4, 3, 'charcoal', False), (3, 2, 'charcoal', False)]}
    ],
    initial_scramble={(0, 3): (0, 2), (1, 4): (1, 4), (1, 0): (1, 2), (3, 0): (4, 0), (2, 1): (2, 3), (4, 1): (3, 1), (4, 3): (4, 4), (3, 2): (2, 2)},
    frozen_pos={(2, 3), (2, 2)},
    moves=24
)

add_level(
    114, 5,
    [
        {'anchor': (0, 0, 'indigo', 4, ['indigo', 'purple']), 'cells': [(0, 1, 'indigo', False), (1, 0, 'purple', False), (1, 1, 'indigo', False)]},
        {'anchor': (0, 4, 'yellow', 3, None), 'cells': [(0, 3, 'yellow', False), (1, 4, 'yellow', False)]},
        {'anchor': (4, 0, 'red', 4, ['red', 'orange']), 'cells': [(3, 0, 'red', False), (4, 1, 'orange', False), (3, 1, 'red', False)]},
        {'anchor': (4, 4, 'cyan', 3, None), 'cells': [(3, 4, 'cyan', False), (4, 3, 'cyan', False)]}
    ],
    initial_scramble={
        (0, 1): (2, 0), (1, 0): (1, 2), (1, 1): (0, 2),
        (0, 3): (1, 3), (1, 4): (2, 4),
        (3, 0): (3, 2), (4, 1): (4, 2), (3, 1): (2, 2),
        (3, 4): (3, 4), (4, 3): (2, 3)
    },
    frozen_pos={(1, 2), (3, 2)},
    moves=26
)

# ==================== 115 - 125 (6x6) ====================
add_level(
    115, 6,
    [
        {'anchor': (0, 0, 'blue', 5, ['blue', 'indigo']), 'cells': [(0, 1, 'blue', False), (1, 0, 'indigo', False), (1, 1, 'blue', False), (0, 2, 'joker', True)]},
        {'anchor': (0, 5, 'amber', 4, None), 'cells': [(0, 4, 'amber', False), (1, 5, 'amber', False), (1, 4, 'amber', False)]},
        {'anchor': (5, 2, 'green', 5, ['green', 'lime']), 'cells': [(5, 1, 'green', False), (5, 3, 'lime', False), (4, 2, 'green', False), (4, 3, 'lime', False)]}
    ],
    initial_scramble={
        (0, 1): (2, 0), (1, 0): (1, 2), (1, 1): (2, 2), (0, 2): (0, 3),
        (0, 4): (3, 5), (1, 5): (1, 3), (1, 4): (2, 4),
        (5, 1): (4, 0), (5, 3): (3, 3), (4, 2): (5, 4), (4, 3): (4, 4)
    },
    frozen_pos={(1, 2), (2, 4), (3, 3), (5, 4)},
    moves=30
)

add_level(
    116, 6,
    [
        {'anchor': (1, 1, 'orange', 4, None), 'cells': [(0, 1, 'orange', False), (1, 0, 'orange', False), (2, 1, 'orange', False)]},
        {'anchor': (1, 4, 'purple', 5, ['purple', 'pink']), 'cells': [(0, 4, 'purple', False), (1, 5, 'pink', False), (2, 4, 'purple', False), (1, 3, 'joker', True)]},
        {'anchor': (4, 1, 'cyan', 4, ['cyan', 'blue']), 'cells': [(4, 0, 'cyan', False), (5, 1, 'blue', False), (3, 1, 'cyan', False)]},
        {'anchor': (4, 4, 'yellow', 3, None), 'cells': [(4, 5, 'yellow', False), (5, 4, 'yellow', False)]}
    ],
    initial_scramble={
        (0, 1): (0, 0), (1, 0): (3, 0), (2, 1): (2, 0),
        (0, 4): (0, 5), (1, 5): (3, 5), (2, 4): (2, 5), (1, 3): (2, 2),
        (4, 0): (5, 0), (5, 1): (5, 2), (3, 1): (3, 2),
        (4, 5): (4, 3), (5, 4): (5, 5)
    },
    frozen_pos={(2, 0), (2, 5), (3, 2), (4, 3)},
    moves=32
)

add_level(
    117, 6,
    [
        {'anchor': (0, 2, 'red', 5, ['red', 'orange', 'pink']), 'cells': [(0, 1, 'red', False), (0, 3, 'orange', False), (1, 2, 'pink', False), (1, 3, 'joker', True)]},
        {'anchor': (2, 5, 'charcoal', 4, None), 'cells': [(1, 5, 'charcoal', False), (3, 5, 'charcoal', False), (2, 4, 'charcoal', False)]},
        {'anchor': (5, 3, 'lime', 5, ['lime', 'green']), 'cells': [(5, 2, 'lime', False), (5, 4, 'green', False), (4, 3, 'lime', False), (4, 4, 'green', False)]},
        {'anchor': (3, 0, 'blue', 4, None), 'cells': [(2, 0, 'blue', False), (4, 0, 'blue', False), (3, 1, 'blue', False)]}
    ],
    initial_scramble={
        (0, 1): (0, 0), (0, 3): (0, 4), (1, 2): (1, 1), (1, 3): (2, 2),
        (1, 5): (0, 5), (3, 5): (4, 5), (2, 4): (2, 3),
        (5, 2): (5, 1), (5, 4): (5, 5), (4, 3): (4, 2), (4, 4): (3, 3),
        (2, 0): (1, 0), (4, 0): (5, 0), (3, 1): (3, 2)
    },
    frozen_pos={(1, 1), (2, 3), (4, 2), (3, 2), (3, 3)},
    moves=34
)

add_level(
    118, 6,
    [
        {'anchor': (0, 0, 'pink', 4, None), 'cells': [(0, 1, 'pink', False), (1, 0, 'pink', False), (1, 1, 'pink', False)]},
        {'anchor': (0, 5, 'indigo', 5, ['indigo', 'blue']), 'cells': [(0, 4, 'indigo', False), (1, 5, 'blue', False), (1, 4, 'indigo', False), (0, 3, 'joker', True)]},
        {'anchor': (5, 0, 'amber', 5, ['amber', 'yellow']), 'cells': [(4, 0, 'amber', False), (5, 1, 'yellow', False), (4, 1, 'amber', False), (5, 2, 'joker', True)]},
        {'anchor': (5, 5, 'cyan', 4, None), 'cells': [(5, 4, 'cyan', False), (4, 5, 'cyan', False), (4, 4, 'cyan', False)]}
    ],
    initial_scramble={
        (0, 1): (0, 2), (1, 0): (2, 0), (1, 1): (2, 1),
        (0, 4): (1, 3), (1, 5): (2, 5), (1, 4): (2, 4), (0, 3): (0, 3),
        (4, 0): (3, 0), (5, 1): (5, 3), (4, 1): (3, 1), (5, 2): (4, 2),
        (5, 4): (3, 4), (4, 5): (3, 5), (4, 4): (4, 3)
    },
    frozen_pos={(2, 1), (2, 4), (3, 1), (4, 3), (4, 2)},
    moves=36
)

add_level(
    119, 6,
    [
        {'anchor': (1, 0, 'purple', 4, None), 'cells': [(0, 0, 'purple', False), (2, 0, 'purple', False), (1, 1, 'purple', False)]},
        {'anchor': (0, 3, 'green', 5, ['green', 'cyan']), 'cells': [(0, 2, 'green', False), (0, 4, 'cyan', False), (1, 3, 'green', False), (1, 4, 'joker', True)]},
        {'anchor': (3, 5, 'red', 5, ['red', 'amber']), 'cells': [(2, 5, 'red', False), (4, 5, 'amber', False), (3, 4, 'red', False), (4, 4, 'joker', True)]},
        {'anchor': (5, 2, 'orange', 4, None), 'cells': [(5, 1, 'orange', False), (5, 3, 'orange', False), (4, 2, 'orange', False)]}
    ],
    initial_scramble={
        (0, 0): (0, 1), (2, 0): (3, 0), (1, 1): (2, 1),
        (0, 2): (1, 2), (0, 4): (0, 5), (1, 3): (2, 3), (1, 4): (2, 4),
        (2, 5): (1, 5), (4, 5): (5, 5), (3, 4): (3, 3), (4, 4): (3, 2),
        (5, 1): (5, 0), (5, 3): (5, 4), (4, 2): (4, 1)
    },
    frozen_pos={(2, 1), (2, 3), (3, 3), (4, 1), (3, 2)},
    moves=36
)

add_level(
    120, 6,
    [
        {'anchor': (0, 1, 'blue', 5, ['blue', 'purple']), 'cells': [(0, 0, 'blue', False), (0, 2, 'purple', False), (1, 1, 'blue', False), (1, 2, 'joker', True)]},
        {'anchor': (1, 5, 'yellow', 4, None), 'cells': [(0, 5, 'yellow', False), (2, 5, 'yellow', False), (1, 4, 'yellow', False)]},
        {'anchor': (4, 0, 'lime', 4, None), 'cells': [(3, 0, 'lime', False), (5, 0, 'lime', False), (4, 1, 'lime', False)]},
        {'anchor': (5, 4, 'charcoal', 5, ['charcoal', 'indigo']), 'cells': [(5, 3, 'charcoal', False), (5, 5, 'indigo', False), (4, 4, 'charcoal', False), (4, 3, 'joker', True)]}
    ],
    initial_scramble={
        (0, 0): (1, 0), (0, 2): (0, 3), (1, 1): (2, 1), (1, 2): (2, 2),
        (0, 5): (0, 4), (2, 5): (3, 5), (1, 4): (2, 4),
        (3, 0): (2, 0), (5, 0): (5, 1), (4, 1): (3, 1),
        (5, 3): (5, 2), (5, 5): (4, 5), (4, 4): (3, 4), (4, 3): (3, 3)
    },
    frozen_pos={(2, 1), (2, 4), (3, 1), (3, 4), (3, 3)},
    moves=38
)

add_level(
    121, 6,
    [
        {'anchor': (0, 0, 'cyan', 5, ['cyan', 'lime', 'green']), 'cells': [(0, 1, 'lime', False), (1, 0, 'green', False), (1, 1, 'cyan', False), (2, 0, 'joker', True)]},
        {'anchor': (0, 4, 'pink', 4, None), 'cells': [(0, 3, 'pink', False), (0, 5, 'pink', False), (1, 4, 'pink', False)]},
        {'anchor': (3, 1, 'amber', 4, ['amber', 'orange']), 'cells': [(2, 1, 'amber', False), (4, 1, 'orange', False), (3, 2, 'amber', False)]},
        {'anchor': (5, 5, 'indigo', 5, None), 'cells': [(5, 4, 'indigo', False), (4, 5, 'indigo', False), (4, 4, 'indigo', False), (5, 3, 'joker', True)]}
    ],
    initial_scramble={
        (0, 1): (0, 2), (1, 0): (3, 0), (1, 1): (1, 2), (2, 0): (1, 3),
        (0, 3): (2, 4), (0, 5): (1, 5), (1, 4): (2, 5),
        (2, 1): (2, 2), (4, 1): (5, 1), (3, 2): (4, 2),
        (5, 4): (5, 2), (4, 5): (3, 5), (4, 4): (4, 3), (5, 3): (3, 3)
    },
    frozen_pos={(1, 2), (2, 2), (4, 2), (4, 3), (3, 3)},
    moves=38
)

add_level(
    122, 6,
    [
        {'anchor': (1, 2, 'orange', 4, None), 'cells': [(0, 2, 'orange', False), (1, 1, 'orange', False), (1, 3, 'orange', False)]},
        {'anchor': (0, 5, 'purple', 5, ['purple', 'indigo']), 'cells': [(0, 4, 'purple', False), (1, 5, 'indigo', False), (1, 4, 'purple', False), (2, 5, 'joker', True)]},
        {'anchor': (5, 0, 'red', 5, ['red', 'pink']), 'cells': [(4, 0, 'red', False), (5, 1, 'pink', False), (4, 1, 'red', False), (3, 0, 'joker', True)]},
        {'anchor': (4, 3, 'green', 4, None), 'cells': [(3, 3, 'green', False), (5, 3, 'green', False), (4, 4, 'green', False)]}
    ],
    initial_scramble={
        (0, 2): (0, 1), (1, 1): (2, 1), (1, 3): (0, 3),
        (0, 4): (2, 4), (1, 5): (3, 5), (1, 4): (3, 4), (2, 5): (4, 5),
        (4, 0): (5, 2), (5, 1): (3, 1), (4, 1): (4, 2), (3, 0): (2, 0),
        (3, 3): (2, 3), (5, 3): (5, 4), (4, 4): (3, 2)
    },
    frozen_pos={(2, 1), (3, 4), (4, 2), (2, 3), (3, 2), (3, 1)},
    moves=40
)

add_level(
    123, 6,
    [
        {'anchor': (0, 2, 'yellow', 5, ['yellow', 'amber']), 'cells': [(0, 1, 'yellow', False), (0, 3, 'amber', False), (1, 2, 'yellow', False), (1, 3, 'joker', True)]},
        {'anchor': (2, 0, 'blue', 4, None), 'cells': [(1, 0, 'blue', False), (3, 0, 'blue', False), (2, 1, 'blue', False)]},
        {'anchor': (3, 5, 'cyan', 5, ['cyan', 'lime']), 'cells': [(2, 5, 'cyan', False), (4, 5, 'lime', False), (3, 4, 'cyan', False), (2, 4, 'joker', True)]},
        {'anchor': (5, 3, 'charcoal', 4, None), 'cells': [(5, 4, 'charcoal', False), (4, 3, 'charcoal', False), (5, 2, 'charcoal', False)]},
        {'anchor': (5, 1, 'pink', 3, None), 'cells': [(4, 1, 'pink', False), (5, 0, 'pink', False)]}
    ],
    initial_scramble={
        (0, 1): (0, 0), (0, 3): (0, 4), (1, 2): (1, 1), (1, 3): (2, 2),
        (1, 0): (1, 4), (3, 0): (4, 0), (2, 1): (3, 1),
        (2, 5): (1, 5), (4, 5): (5, 5), (3, 4): (4, 4), (2, 4): (3, 3),
        (5, 4): (4, 2), (4, 3): (3, 2), (5, 2): (2, 3),
        (4, 1): (4, 1), (5, 0): (3, 0)
    },
    frozen_pos={(1, 1), (2, 2), (3, 1), (3, 3), (3, 2), (2, 3)},
    moves=42
)

add_level(
    124, 6,
    [
        {'anchor': (0, 0, 'indigo', 4, None), 'cells': [(0, 1, 'indigo', False), (1, 0, 'indigo', False), (1, 1, 'indigo', False)]},
        {'anchor': (1, 4, 'green', 5, ['green', 'lime', 'cyan']), 'cells': [(0, 4, 'lime', False), (1, 5, 'cyan', False), (2, 4, 'green', False), (1, 3, 'joker', True)]},
        {'anchor': (4, 1, 'orange', 5, ['orange', 'red']), 'cells': [(3, 1, 'orange', False), (5, 1, 'red', False), (4, 2, 'orange', False), (4, 0, 'joker', True)]},
        {'anchor': (5, 5, 'purple', 4, None), 'cells': [(5, 4, 'purple', False), (4, 5, 'purple', False), (4, 4, 'purple', False)]}
    ],
    initial_scramble={
        (0, 1): (0, 2), (1, 0): (2, 0), (1, 1): (2, 1),
        (0, 4): (0, 3), (1, 5): (2, 5), (2, 4): (3, 4), (1, 3): (2, 3),
        (3, 1): (3, 0), (5, 1): (5, 2), (4, 2): (3, 2), (4, 0): (5, 0),
        (5, 4): (5, 3), (4, 5): (3, 5), (4, 4): (4, 3)
    },
    frozen_pos={(2, 1), (2, 3), (3, 2), (4, 3), (3, 4), (2, 5)},
    moves=42
)

add_level(
    125, 6,
    [
        {'anchor': (0, 3, 'red', 4, None), 'cells': [(0, 2, 'red', False), (0, 4, 'red', False), (1, 3, 'red', False)]},
        {'anchor': (2, 5, 'amber', 5, ['amber', 'yellow']), 'cells': [(1, 5, 'amber', False), (3, 5, 'yellow', False), (2, 4, 'amber', False), (1, 4, 'joker', True)]},
        {'anchor': (5, 2, 'blue', 5, ['blue', 'cyan']), 'cells': [(5, 1, 'blue', False), (5, 3, 'cyan', False), (4, 2, 'blue', False), (4, 3, 'joker', True)]},
        {'anchor': (3, 0, 'charcoal', 4, None), 'cells': [(2, 0, 'charcoal', False), (4, 0, 'charcoal', False), (3, 1, 'charcoal', False)]},
        {'anchor': (1, 1, 'lime', 3, None), 'cells': [(0, 1, 'lime', False), (1, 0, 'lime', False)]}
    ],
    initial_scramble={
        (0, 2): (0, 0), (0, 4): (0, 5), (1, 3): (2, 3),
        (1, 5): (3, 4), (3, 5): (4, 5), (2, 4): (2, 5), (1, 4): (1, 2),
        (5, 1): (5, 0), (5, 3): (5, 4), (4, 2): (3, 2), (4, 3): (3, 3),
        (2, 0): (1, 0), (4, 0): (5, 5), (3, 1): (4, 1),
        (0, 1): (2, 1), (1, 0): (2, 2)
    },
    frozen_pos={(2, 3), (1, 2), (3, 2), (3, 3), (2, 1), (2, 2)},
    moves=44
)

print(f"Verified {len(levels)} levels so far (111-125)")
