# Level Generator and Validator for Levels 111 - 150
import json

def verify_solution(grid_size, tiles):
    # tiles is a list of dicts: {'id': ..., 'color': ..., 'number': ..., 'allowedColors': ..., 'isJoker': ...}
    numbered_tiles = [(i, t) for i, t in enumerate(tiles) if t.get('number') is not None]
    if not numbered_tiles:
        return False, "No anchors found"

    for anchor_idx, anchor in numbered_tiles:
        target_size = anchor['number']
        allowed_colors = anchor.get('allowedColors', [anchor['color']])
        
        satisfied = False
        # 1. Single allowed colors
        for color in allowed_colors:
            visited = set()
            queue = [anchor_idx]
            visited.add(anchor_idx)
            while queue:
                cur = queue.pop(0)
                r, c = cur // grid_size, cur % grid_size
                neighbors = []
                if r > 0: neighbors.append((r - 1) * grid_size + c)
                if r < grid_size - 1: neighbors.append((r + 1) * grid_size + c)
                if c > 0: neighbors.append(r * grid_size + (c - 1))
                if c < grid_size - 1: neighbors.append(r * grid_size + (c + 1))

                for n_idx in neighbors:
                    if n_idx not in visited:
                        n_tile = tiles[n_idx]
                        is_match = n_tile.get('color') == color or (n_tile.get('allowedColors') and color in n_tile['allowedColors'])
                        is_joker = n_tile.get('color') == 'joker' or n_tile.get('isJoker') == True
                        if is_match or is_joker:
                            visited.add(n_idx)
                            queue.append(n_idx)
            if len(visited) == target_size:
                satisfied = True
                break

        # 2. Multi-color check
        if not satisfied and len(allowed_colors) > 1:
            visited = set()
            queue = [anchor_idx]
            visited.add(anchor_idx)
            while queue:
                cur = queue.pop(0)
                r, c = cur // grid_size, cur % grid_size
                neighbors = []
                if r > 0: neighbors.append((r - 1) * grid_size + c)
                if r < grid_size - 1: neighbors.append((r + 1) * grid_size + c)
                if c > 0: neighbors.append(r * grid_size + (c - 1))
                if c < grid_size - 1: neighbors.append(r * grid_size + (c + 1))

                for n_idx in neighbors:
                    if n_idx not in visited:
                        n_tile = tiles[n_idx]
                        is_allowed = n_tile.get('color') in allowed_colors or (n_tile.get('allowedColors') and any(ac in allowed_colors for ac in n_tile['allowedColors']))
                        is_joker = n_tile.get('color') == 'joker' or n_tile.get('isJoker') == True
                        if is_allowed or is_joker:
                            visited.add(n_idx)
                            queue.append(n_idx)
            if len(visited) == target_size:
                satisfied = True

        if not satisfied:
            return False, f"Anchor at index {anchor_idx} ({anchor.get('color')}, target {target_size}) not satisfied (found component size {len(visited)} or mismatch)"

    return True, "All anchors satisfied"

print("Python validator ready")
