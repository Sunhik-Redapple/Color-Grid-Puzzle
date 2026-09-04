const { simulateSolution, isLevelComplete, checkAndThawTiles } = require('./test_design_all.js');

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
    if (tiles[a].isFrozen || tiles[b].isFrozen) throw new Error(`Move ${i+1}: tile frozen (${a} or ${b})`);
    if (tiles[a].number !== undefined || tiles[b].number !== undefined) throw new Error(`Move ${i+1}: cannot move anchor (${a} or ${b})`);
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
    { id: "l102-tile-1", color: "green", number: 4 },
    { id: "l102-tile-2", color: "grey" },
    { id: "l102-tile-3", color: "green" },
    { id: "l102-tile-4", color: "grey" },
    { id: "l102-tile-5", color: "grey" },
    { id: "l102-tile-6", color: "pink", isFrozen: true },
    { id: "l102-tile-7", color: "green" },
    { id: "l102-tile-8", color: "grey" },
    { id: "l102-tile-9", color: "green" },
    { id: "l102-tile-10", color: "grey" },
    { id: "l102-tile-11", color: "pink" },
    { id: "l102-tile-12", color: "grey" },
    { id: "l102-tile-13", color: "grey" },
    { id: "l102-tile-14", color: "grey" },
    { id: "l102-tile-15", color: "grey" },
    { id: "l102-tile-16", color: "pink", number: 3 },
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
    { id: "l103-tile-1", color: "red", number: 3 },
    { id: "l103-tile-2", color: "blue", isFrozen: true },
    { id: "l103-tile-3", color: "grey" },
    { id: "l103-tile-4", color: "grey" },
    { id: "l103-tile-5", color: "red" },
    { id: "l103-tile-6", color: "grey" },
    { id: "l103-tile-7", color: "yellow" },
    { id: "l103-tile-8", color: "red" },
    { id: "l103-tile-9", color: "grey" },
    { id: "l103-tile-10", color: "grey" },
    { id: "l103-tile-11", color: "blue" },
    { id: "l103-tile-12", color: "grey" },
    { id: "l103-tile-13", color: "blue", number: 3 },
    { id: "l103-tile-14", color: "yellow", isFrozen: true },
    { id: "l103-tile-15", color: "grey" },
    { id: "l103-tile-16", color: "yellow", number: 3 },
  ]
};
testLevel(l103, [[7, 5], [1, 9], [10, 8], [13, 14], [6, 11]]);

// ---------------- LEVEL 104 (5x5) ----------------
// Anchors:
// Orange [4] at 0 (0,0)
// Cyan [4] at 20 (4,0)
// Purple [3] at 24 (4,4)
// Frozen:
// Tile 1 (0,1): Frozen Cyan
// Tile 21 (4,1): Frozen Purple
const l104 = {
  id: 104,
  title: "Level 104",
  gridSize: 5,
  maxMoves: 18,
  initialTiles: [
    { id: "l104-tile-1", color: "orange", number: 4 }, // 0
    { id: "l104-tile-2", color: "cyan", isFrozen: true }, // 1 (frozen Cyan)
    { id: "l104-tile-3", color: "grey" },              // 2
    { id: "l104-tile-4", color: "orange" },            // 3
    { id: "l104-tile-5", color: "grey" },              // 4
    { id: "l104-tile-6", color: "orange" },            // 5
    { id: "l104-tile-7", color: "grey" },              // 6
    { id: "l104-tile-8", color: "purple" },            // 7
    { id: "l104-tile-9", color: "grey" },              // 8
    { id: "l104-tile-10", color: "orange" },           // 9
    { id: "l104-tile-11", color: "grey" },             // 10
    { id: "l104-tile-12", color: "cyan" },             // 11
    { id: "l104-tile-13", color: "grey" },             // 12
    { id: "l104-tile-14", color: "cyan" },             // 13
    { id: "l104-tile-15", color: "grey" },             // 14
    { id: "l104-tile-16", color: "grey" },             // 15
    { id: "l104-tile-17", color: "purple" },           // 16
    { id: "l104-tile-18", color: "grey" },             // 17
    { id: "l104-tile-19", color: "grey" },             // 18
    { id: "l104-tile-20", color: "grey" },             // 19
    { id: "l104-tile-21", color: "cyan", number: 4 },  // 20
    { id: "l104-tile-22", color: "purple", isFrozen: true }, // 21 (frozen Purple)
    { id: "l104-tile-23", color: "grey" },             // 22
    { id: "l104-tile-24", color: "grey" },             // 23
    { id: "l104-tile-25", color: "purple", number: 3 }, // 24
  ]
};
// Orange forms at {0, 5, 10, 15} or {0, 5, 6, 7}?
// Orange has tiles at 3, 5, 9.
// Swaps for 104:
// 3 -> 10 (orange at 0, 5, 10)
// 9 -> 15 (orange at 0, 5, 10, 15: 4 tiles! Orange complete -> touches tile 0 which touches 1, so tile 1 thaws!)
// Thawed cyan at 1 -> 16
// Cyan at 11 -> 15? Wait, 15 has orange. Cyan at 11 -> 25? No. Cyan anchor at 20.
// Cyan needs 4 tiles: anchor 20, tiles at 11, 13, and thawed at 1.
// Cyan can form at {20, 15? no, {20, 21 is purple, {20, 21?, wait, if cyan is at 20, neighbors of 20 are 15 and 21.
// Cyan can go to 15? Orange can be formed at {0, 1(wait 1 is cyan), 5, 6, 7}?
// Let us test:
