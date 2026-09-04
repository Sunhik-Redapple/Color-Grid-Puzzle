function getNeighbors(idx, gridSize) {
  const r = Math.floor(idx / gridSize);
  const c = idx % gridSize;
  return [
    r > 0 ? (r - 1) * gridSize + c : null,
    r < gridSize - 1 ? (r + 1) * gridSize + c : null,
    c > 0 ? r * gridSize + (c - 1) : null,
    c < gridSize - 1 ? r * gridSize + (c + 1) : null,
  ].filter(n => n !== null);
}

function getConnectedComponentForAnchor(anchorIdx, tiles, gridSize) {
  const anchor = tiles[anchorIdx];
  if (anchor.number === undefined) return null;
  const targetSize = anchor.number;
  const allowed = anchor.allowedColors || [anchor.color];
  const visited = new Set([anchorIdx]);
  const queue = [anchorIdx];
  while (queue.length > 0) {
    const curr = queue.shift();
    for (const nIdx of getNeighbors(curr, gridSize)) {
      if (!visited.has(nIdx)) {
        const neighbor = tiles[nIdx];
        if (neighbor.color !== "grey") {
          const matches = neighbor.isJoker || allowed.includes(neighbor.color);
          if (matches) {
            visited.add(nIdx);
            queue.push(nIdx);
          }
        }
      }
    }
  }
  return visited.size === targetSize ? { indices: Array.from(visited) } : null;
}

function thaw(tiles, gridSize) {
  const completedGroupIndices = new Set();
  tiles.forEach((t, idx) => {
    if (t.number !== undefined) {
      const comp = getConnectedComponentForAnchor(idx, tiles, gridSize);
      if (comp) comp.indices.forEach(i => completedGroupIndices.add(i));
    }
  });

  return tiles.map((tile, idx) => {
    if (!tile.isFrozen) return tile;
    if (completedGroupIndices.has(idx)) return { ...tile, isFrozen: false };
    const neighbors = getNeighbors(idx, gridSize);
    if (neighbors.some(n => completedGroupIndices.has(n))) return { ...tile, isFrozen: false };
    return tile;
  });
}

function isComplete(tiles, gridSize) {
  const anchors = tiles.map((t, idx) => ({ t, idx })).filter(({ t }) => t.number !== undefined);
  return anchors.every(({ idx }) => getConnectedComponentForAnchor(idx, tiles, gridSize) !== null);
}

function testLevel(level, swaps) {
  if (level.initialTiles.length !== level.gridSize * level.gridSize) {
    throw new Error(`Tile count ${level.initialTiles.length} != ${level.gridSize * level.gridSize}`);
  }
  let tiles = JSON.parse(JSON.stringify(level.initialTiles));
  for (let i = 0; i < swaps.length; i++) {
    const [a, b] = swaps[i];
    if (tiles[a].isFrozen || tiles[b].isFrozen) throw new Error(`Level ${level.id} Move ${i+1}: tile frozen (${a} or ${b})`);
    if (tiles[a].number !== undefined || tiles[b].number !== undefined) throw new Error(`Level ${level.id} Move ${i+1}: cannot move anchor (${a} or ${b})`);
    const tmp = tiles[a];
    tiles[a] = tiles[b];
    tiles[b] = tmp;
    tiles = thaw(tiles, level.gridSize);
  }
  const complete = isComplete(tiles, level.gridSize);
  console.log(`Level ${level.id} (${level.title}): solved = ${complete} in ${swaps.length} moves (limit: ${level.maxMoves})`);
  if (!complete) throw new Error(`Level ${level.id} failed to complete!`);
}

// ---------------- LEVEL 102 (4x4) ----------------
const l102 = {
  id: 102,
  title: "Level 102",
  gridSize: 4,
  maxMoves: 12,
  initialTiles: [
    { id: "l102-tile-1", color: "green", number: 4 }, // 0
    { id: "l102-tile-2", color: "grey" },              // 1
    { id: "l102-tile-3", color: "green" },             // 2
    { id: "l102-tile-4", color: "grey" },              // 3
    { id: "l102-tile-5", color: "grey" },              // 4
    { id: "l102-tile-6", color: "pink", isFrozen: true }, // 5 (frozen Pink)
    { id: "l102-tile-7", color: "green" },             // 6
    { id: "l102-tile-8", color: "grey" },              // 7
    { id: "l102-tile-9", color: "green" },             // 8
    { id: "l102-tile-10", color: "grey" },             // 9
    { id: "l102-tile-11", color: "pink" },             // 10
    { id: "l102-tile-12", color: "grey" },             // 11
    { id: "l102-tile-13", color: "grey" },             // 12
    { id: "l102-tile-14", color: "grey" },             // 13
    { id: "l102-tile-15", color: "grey" },             // 14
    { id: "l102-tile-16", color: "pink", number: 3 },  // 15
  ]
};
testLevel(l102, [[2, 1], [6, 4], [5, 14], [10, 11]]);

// ---------------- LEVEL 103 (4x4) ----------------
const l103 = {
  id: 103,
  title: "Level 103",
  gridSize: 4,
  maxMoves: 14,
  initialTiles: [
    { id: "l103-tile-1", color: "red", number: 3 },    // 0
    { id: "l103-tile-2", color: "blue", isFrozen: true }, // 1 (frozen Blue)
    { id: "l103-tile-3", color: "grey" },              // 2
    { id: "l103-tile-4", color: "grey" },              // 3
    { id: "l103-tile-5", color: "red" },               // 4
    { id: "l103-tile-6", color: "grey" },              // 5
    { id: "l103-tile-7", color: "yellow" },            // 6
    { id: "l103-tile-8", color: "red" },               // 7
    { id: "l103-tile-9", color: "grey" },              // 8
    { id: "l103-tile-10", color: "grey" },             // 9
    { id: "l103-tile-11", color: "blue" },             // 10
    { id: "l103-tile-12", color: "grey" },             // 11
    { id: "l103-tile-13", color: "blue", number: 3 },  // 12
    { id: "l103-tile-14", color: "yellow", isFrozen: true }, // 13 (frozen Yellow)
    { id: "l103-tile-15", color: "grey" },             // 14
    { id: "l103-tile-16", color: "yellow", number: 3 }, // 15
  ]
};
testLevel(l103, [[7, 5], [1, 9], [10, 8], [13, 14], [6, 11]]);

// ---------------- LEVEL 104 (5x5) ----------------
// Anchors:
// Orange [4] at 0 (0,0). Neighbors: 1, 5.
// Cyan [4] at 20 (4,0). Neighbors: 15, 21.
// Purple [4] at 24 (4,4). Neighbors: 19, 23.
// Frozen blocks:
// Tile 1 (0,1): Cyan (frozen). Touching Orange anchor 0!
// Tile 21 (4,1): Purple (frozen). Touching Cyan anchor 20!
// Solution:
// Orange needs 4. Tiles: anchor 0, movables at 2, 6, 10.
// Form Orange at {0, 5, 10, 15}? No, Orange at {0, 5, 6, 7} or {0, 5, 10, 11}!
// When Orange completes, it touches Tile 1 (Cyan)! Tile 1 thaws!
// Cyan needs 4: anchor 20, thawed 1, and movables at 12, 17.
// Cyan forms at {20, 15, 16, 17} or {20, 15, 10, ...} or {20, 15, 16, 21(wait, 21 is Purple)}!
// Tile 21 is adjacent to 20!
// When Cyan completes, it touches Tile 21 (Purple)! Tile 21 thaws!
// Purple needs 4: anchor 24, thawed 21, and movables at 14, 18.
// Purple forms at {24, 23, 22, 21}!
const l104 = {
  id: 104,
  title: "Level 104",
  gridSize: 5,
  maxMoves: 18,
  initialTiles: [
    { id: "l104-tile-1", color: "orange", number: 4 }, // 0
    { id: "l104-tile-2", color: "cyan", isFrozen: true }, // 1 (frozen Cyan)
    { id: "l104-tile-3", color: "orange" },            // 2
    { id: "l104-tile-4", color: "grey" },              // 3
    { id: "l104-tile-5", color: "grey" },              // 4
    { id: "l104-tile-6", color: "grey" },              // 5
    { id: "l104-tile-7", color: "orange" },            // 6
    { id: "l104-tile-8", color: "grey" },              // 7
    { id: "l104-tile-9", color: "grey" },              // 8
    { id: "l104-tile-10", color: "orange" },           // 9
    { id: "l104-tile-11", color: "grey" },             // 10
    { id: "l104-tile-12", color: "grey" },             // 11
    { id: "l104-tile-13", color: "cyan" },             // 12
    { id: "l104-tile-14", color: "grey" },             // 13
    { id: "l104-tile-15", color: "purple" },           // 14
    { id: "l104-tile-16", color: "grey" },             // 15
    { id: "l104-tile-17", color: "grey" },             // 16
    { id: "l104-tile-17b", color: "cyan" },            // 17
    { id: "l104-tile-18", color: "purple" },           // 18
    { id: "l104-tile-19", color: "grey" },             // 19
    { id: "l104-tile-20", color: "cyan", number: 4 },  // 20
    { id: "l104-tile-21", color: "purple", isFrozen: true }, // 21 (frozen Purple)
    { id: "l104-tile-22", color: "grey" },             // 22
    { id: "l104-tile-23", color: "purple" },           // 23
    { id: "l104-tile-24", color: "purple", number: 4 }, // 24
  ]
};
// Orange {0, 5, 6, 7}: movables at 2->5, 9->7. (0, 5, 6, 7 is 4 tiles!) Orange complete -> thaws 1!
// Cyan {20, 15, 16, 17}: thawed 1->15, 12->16. (20, 15, 16, 17 is 4 tiles!) Cyan complete -> touches 21, thaws 21!
// Purple {24, 23, 22, 21}: thawed 21 at 21, 14->22, 18->23 is already? 23 has purple. 14->22! Purple at 24, 23, 22, 21!
testLevel(l104, [
  [2, 5],
  [9, 7],   // Orange complete at {0, 5, 6, 7}! Thaws 1 (Cyan).
  [1, 15],
  [12, 16], // Cyan complete at {20, 15, 16, 17}! Thaws 21 (Purple).
  [14, 22]  // Purple complete at {24, 23, 22, 21}! (with 18 left over? Wait, Purple anchor is 4: 24, 23, 22, 21 is 4!)
]);
