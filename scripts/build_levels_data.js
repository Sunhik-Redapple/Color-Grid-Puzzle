import fs from 'fs';

// Helper functions
function coordToIdx(r, c, gridSize) {
  return r * gridSize + c;
}

function verifySolution(gridSize, finalTiles) {
  const numberedTiles = finalTiles
    .map((tile, idx) => ({ tile, idx }))
    .filter(({ tile }) => tile.number !== undefined);
  
  if (numberedTiles.length === 0) return { ok: false, reason: 'No anchors' };

  for (const { tile: anchor, idx: anchorIdx } of numberedTiles) {
    const targetSize = anchor.number;
    const allowedColors = anchor.allowedColors && anchor.allowedColors.length > 0
      ? anchor.allowedColors
      : [anchor.color];

    let satisfied = false;

    // 1. Single allowed colors
    for (const color of allowedColors) {
      const visited = new Set();
      const queue = [anchorIdx];
      visited.add(anchorIdx);
      while (queue.length > 0) {
        const cur = queue.shift();
        const r = Math.floor(cur / gridSize);
        const c = cur % gridSize;
        const neighbors = [
          r > 0 ? (r - 1) * gridSize + c : null,
          r < gridSize - 1 ? (r + 1) * gridSize + c : null,
          c > 0 ? r * gridSize + (c - 1) : null,
          c < gridSize - 1 ? r * gridSize + (c + 1) : null,
        ];
        for (const nIdx of neighbors) {
          if (nIdx !== null && !visited.has(nIdx)) {
            const nTile = finalTiles[nIdx];
            const isMatching = nTile.color === color || (nTile.allowedColors && nTile.allowedColors.includes(color));
            const isJoker = nTile.color === 'joker' || nTile.isJoker === true;
            if (isMatching || isJoker) {
              visited.add(nIdx);
              queue.push(nIdx);
            }
          }
        }
      }
      if (visited.size === targetSize) {
        satisfied = true;
        break;
      }
    }

    // 2. Multi-color check
    if (!satisfied && allowedColors.length > 1) {
      const visited = new Set();
      const queue = [anchorIdx];
      visited.add(anchorIdx);
      while (queue.length > 0) {
        const cur = queue.shift();
        const r = Math.floor(cur / gridSize);
        const c = cur % gridSize;
        const neighbors = [
          r > 0 ? (r - 1) * gridSize + c : null,
          r < gridSize - 1 ? (r + 1) * gridSize + c : null,
          c > 0 ? r * gridSize + (c - 1) : null,
          c < gridSize - 1 ? r * gridSize + (c + 1) : null,
        ];
        for (const nIdx of neighbors) {
          if (nIdx !== null && !visited.has(nIdx)) {
            const nTile = finalTiles[nIdx];
            const isAllowed = allowedColors.includes(nTile.color) || (nTile.allowedColors && nTile.allowedColors.some(ac => allowedColors.includes(ac)));
            const isJoker = nTile.color === 'joker' || nTile.isJoker === true;
            if (isAllowed || isJoker) {
              visited.add(nIdx);
              queue.push(nIdx);
            }
          }
        }
      }
      if (visited.size === targetSize) {
        satisfied = true;
      }
    }

    if (!satisfied) {
      return { ok: false, reason: `Anchor at index ${anchorIdx} (target ${targetSize}) is not satisfied in final state` };
    }
  }

  return { ok: true };
}

console.log('Template created successfully');
