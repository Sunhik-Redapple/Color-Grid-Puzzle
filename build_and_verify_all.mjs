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
  return anchors.length > 0 && anchors.every(({ idx }) => getConnectedComponentForAnchor(idx, tiles, gridSize) !== null);
}

function verifyAndSolve(level, solution) {
  const expectedLen = level.gridSize * level.gridSize;
  if (level.initialTiles.length !== expectedLen) {
    throw new Error(`Level ${level.id} tile count mismatch: ${level.initialTiles.length} !== ${expectedLen}`);
  }

  let tiles = JSON.parse(JSON.stringify(level.initialTiles));
  let step = 0;
  for (const [a, b] of solution) {
    step++;
    if (tiles[a].isFrozen || tiles[b].isFrozen) {
      throw new Error(`Level ${level.id} Step ${step}: Cannot move frozen tile at ${tiles[a].isFrozen ? a : b}`);
    }
    if (tiles[a].number !== undefined || tiles[b].number !== undefined) {
      throw new Error(`Level ${level.id} Step ${step}: Cannot move anchor at ${tiles[a].number !== undefined ? a : b}`);
    }
    const temp = tiles[a];
    tiles[a] = tiles[b];
    tiles[b] = temp;
    tiles = thaw(tiles, level.gridSize);
  }

  const complete = isComplete(tiles, level.gridSize);
  if (!complete) {
    throw new Error(`Level ${level.id} failed to complete after ${solution.length} moves!`);
  }
  console.log(`✓ Level ${level.id} (${level.title}, ${level.gridSize}x${level.gridSize}): Solved in ${solution.length} moves (Limit: ${level.maxMoves})`);
}

// ==========================================
// Level 102 (4x4)
// 1 frozen Pink block. Green [4], Pink [3].
// ==========================================
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
    { id: "l102-tile-6", color: "pink", isFrozen: true }, // 5 (frozen)
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
verifyAndSolve(l102, [[2, 1], [6, 4], [5, 14], [10, 11]]);

// ==========================================
// Level 103 (4x4)
// 2 frozen blocks. Chain reaction: Red [3] -> thaws Blue -> Blue [3] -> thaws Yellow -> Yellow [3].
// ==========================================
const l103 = {
  id: 103,
  title: "Level 103",
  gridSize: 4,
  maxMoves: 14,
  initialTiles: [
    { id: "l103-tile-1", color: "red", number: 3 },    // 0
    { id: "l103-tile-2", color: "blue", isFrozen: true }, // 1 (frozen)
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
    { id: "l103-tile-14", color: "yellow", isFrozen: true }, // 13 (frozen)
    { id: "l103-tile-15", color: "grey" },             // 14
    { id: "l103-tile-16", color: "yellow", number: 3 }, // 15
  ]
};
verifyAndSolve(l103, [[7, 5], [1, 9], [10, 8], [13, 14], [6, 11]]);

// ==========================================
// Level 104 (5x5)
// 2 frozen blocks. Orange [4], Cyan [4], Purple [3].
// Orange: anchor at 0, movables at 2, 7, 10. Forms {0, 5, 10, 15} or {0, 5, 6, 7}.
// Wait, neighbors of 0: 1 (frozen cyan), 5.
// If Orange forms at {0, 5, 6, 7}: touches 1! Thaws Cyan at 1.
// Cyan anchor at 20. Movables at 12, 17, and thawed at 1.
// Cyan forms at {20, 15, 16, 17}. Touches 21 (frozen purple)! Thaws Purple at 21.
// Purple anchor at 24. Movables at 14, and thawed at 21.
// Purple forms at {24, 23, 22? wait: anchor 24 + thawed 21 + movable 14 = 3 purples.
// Purples can form at {24, 23, 22}: move 21 to 22, move 14 to 23. That is exactly 3 purples!
// ==========================================
const l104 = {
  id: 104,
  title: "Level 104",
  gridSize: 5,
  maxMoves: 16,
  initialTiles: [
    { id: "l104-tile-1", color: "orange", number: 4 }, // 0
    { id: "l104-tile-2", color: "cyan", isFrozen: true }, // 1 (frozen)
    { id: "l104-tile-3", color: "orange" },            // 2
    { id: "l104-tile-4", color: "grey" },              // 3
    { id: "l104-tile-5", color: "grey" },              // 4
    { id: "l104-tile-6", color: "grey" },              // 5
    { id: "l104-tile-7", color: "grey" },              // 6
    { id: "l104-tile-8", color: "orange" },            // 7
    { id: "l104-tile-9", color: "grey" },              // 8
    { id: "l104-tile-10", color: "grey" },             // 9
    { id: "l104-tile-11", color: "orange" },           // 10
    { id: "l104-tile-12", color: "grey" },             // 11
    { id: "l104-tile-13", color: "cyan" },             // 12
    { id: "l104-tile-14", color: "grey" },             // 13
    { id: "l104-tile-15", color: "purple" },           // 14
    { id: "l104-tile-16", color: "grey" },             // 15
    { id: "l104-tile-17", color: "grey" },             // 16
    { id: "l104-tile-18", color: "cyan" },             // 17
    { id: "l104-tile-19", color: "grey" },             // 18
    { id: "l104-tile-20", color: "grey" },             // 19
    { id: "l104-tile-21", color: "cyan", number: 4 },  // 20
    { id: "l104-tile-22", color: "purple", isFrozen: true }, // 21 (frozen)
    { id: "l104-tile-23", color: "grey" },             // 22
    { id: "l104-tile-24", color: "grey" },             // 23
    { id: "l104-tile-25", color: "purple", number: 3 }, // 24
  ]
};
verifyAndSolve(l104, [
  [2, 5],
  [10, 6],  // Orange now at {0, 5, 6, 7} (4 tiles). Orange complete! Touches 1 -> thaws 1 (Cyan).
  [1, 15],
  [12, 16], // Cyan now at {20, 15, 16, 17} (4 tiles). Cyan complete! Touches 21 -> thaws 21 (Purple).
  [21, 22],
  [14, 23]  // Purple now at {24, 23, 22} (3 tiles). Purple complete! All solved!
]);

// ==========================================
// Level 105 (5x5)
// Introduces FROZEN RAINBOW JOKER BLOCK!
// Anchors: Lime [4] at tile 2 (0,2), Indigo [5] at tile 22 (4,2).
// Frozen:
// Tile 7 (1,2): Rainbow Joker (frozen)!
// Tile 17 (3,2): Indigo (frozen)!
// Lime has 3 movables: at 1, 3, 6.
// Lime forms around anchor at 2: {2, 1, 3, 6} (4 tiles!).
// Completed Lime group touches tile 7 (Rainbow Joker)! Tile 7 thaws!
// Once tile 7 thaws, we can place the Joker or another block to touch tile 17?
// Wait: when Joker or another block joins Indigo anchor at 22:
// Indigo anchor at 22 has neighbors 21, 23, 17. Tile 17 is frozen Indigo!
// Indigo movables: 2 indigo tiles (at 10, 14).
// If Indigos form at {22, 21, 23}: that is 3 tiles.
// When Joker moves to 16, or what if Joker joins Indigo at 22?
// What if forming Lime [4] thaws Joker at 7, AND Joker connects {7, 12, 17}?
// Wait, can an anchor group thaw tiles along the way?
// If Indigo forms around 22: Indigo needs 5 tiles!
// Indigo has anchor at 22, frozen indigo at 17, movable indigos at 21, 23, and thawed joker at 7!
// Wait! Can Indigo form at {22, 21, 23, 17, 12}? But 17 is frozen!
// Can a frozen tile BE PART of the completed group?
// YES! Remember: "When a player completes an adjacent color group (or a group containing the frozen tile), heat from the completed set melts the ice, thawing the block!"
// So if tiles 21, 23, 12, 22 surround 17, {22, 17, 21, 23, 12} forms a connected group of 5 matching Indigo!
// The moment it reaches 5, the group is completed and tile 17 thaws!
// Even better: Lime [4] at 2 thaws Joker at 7, and Joker moves down to 12 to complete Indigo [5]!
// Let us test Level 105!
// ==========================================
const l105 = {
  id: 105,
  title: "Level 105",
  gridSize: 5,
  maxMoves: 18,
  initialTiles: [
    { id: "l105-tile-1", color: "grey" },              // 0
    { id: "l105-tile-2", color: "lime" },              // 1
    { id: "l105-tile-3", color: "lime", number: 4 },   // 2
    { id: "l105-tile-4", color: "lime" },              // 3
    { id: "l105-tile-5", color: "grey" },              // 4
    { id: "l105-tile-6", color: "grey" },              // 5
    { id: "l105-tile-7", color: "lime" },              // 6
    { id: "l105-tile-8", color: "joker", isJoker: true, isFrozen: true }, // 7 (frozen Joker!)
    { id: "l105-tile-9", color: "grey" },              // 8
    { id: "l105-tile-10", color: "grey" },             // 9
    { id: "l105-tile-11", color: "grey" },             // 10
    { id: "l105-tile-12", color: "grey" },             // 11
    { id: "l105-tile-13", color: "grey" },             // 12
    { id: "l105-tile-14", color: "indigo" },           // 13
    { id: "l105-tile-15", color: "grey" },             // 14
    { id: "l105-tile-16", color: "grey" },             // 15
    { id: "l105-tile-17", color: "indigo" },           // 16
    { id: "l105-tile-18", color: "indigo", isFrozen: true }, // 17 (frozen Indigo)
    { id: "l105-tile-19", color: "grey" },             // 18
    { id: "l105-tile-20", color: "grey" },             // 19
    { id: "l105-tile-21", color: "indigo" },           // 20
    { id: "l105-tile-22", color: "grey" },             // 21
    { id: "l105-tile-23", color: "indigo", number: 5 }, // 22
    { id: "l105-tile-24", color: "grey" },             // 23
    { id: "l105-tile-25", color: "grey" },             // 24
  ]
};
// Lime needs 4: already has 1, 2, 3, 6!
// Wait, at start 1, 2, 3, 6 is ALREADY 4 connected lime tiles!
// We want the player to have to make moves.
// So let lime at 6 be at 5, and lime at 3 be at 4.
// Let us adjust initialTiles for 105:
l105.initialTiles[3] = { id: "l105-tile-4", color: "grey" };
l105.initialTiles[4] = { id: "l105-tile-5", color: "lime" }; // lime at 4
l105.initialTiles[6] = { id: "l105-tile-7", color: "grey" };
l105.initialTiles[5] = { id: "l105-tile-6", color: "lime" }; // lime at 5

verifyAndSolve(l105, [
  [4, 3],  // move lime from 4 to 3 (Lime now at 1, 2, 3)
  [5, 6],  // move lime from 5 to 6 (Lime now at 1, 2, 3, 6: 4 tiles! Lime complete -> touches 7, thaws Joker at 7!)
  [7, 12], // move thawed Joker from 7 to 12 (now touches frozen indigo at 17!)
  [13, 21], // move indigo from 13 to 21
  [20, 23], // move indigo from 20 to 23 (Indigo is now {22, 17(frozen), 12(joker), 21, 23}: 5 tiles! Indigo complete -> thaws 17!)
]);

