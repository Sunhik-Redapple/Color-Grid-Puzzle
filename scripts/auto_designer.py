import sys
sys.path.append('scripts')
from validator import verify_solution

def check_no_joker_leak(grid_size, anchor_specs):
    # Map every (r, c) to group_id (spec index)
    cell_to_group = {}
    joker_cells = []
    for g_idx, spec in enumerate(anchor_specs):
        a = spec['anchor']
        cell_to_group[(a[0], a[1])] = g_idx
        for r, c, col, is_j in spec['cells']:
            cell_to_group[(r, c)] = g_idx
            if is_j or col == 'joker':
                joker_cells.append(((r, c), g_idx))

    for (jr, jc), g_idx in joker_cells:
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = jr + dr, jc + dc
            if (nr, nc) in cell_to_group:
                other_g = cell_to_group[(nr, nc)]
                if other_g != g_idx:
                    return False, f"Joker at {(jr, jc)} (group {g_idx}) leaks into cell {(nr, nc)} of group {other_g}"
    return True, "No joker leaks"

print("Joker leak checker ready")
