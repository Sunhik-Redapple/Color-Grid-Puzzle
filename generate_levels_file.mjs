import { writeFileSync } from "fs";

const levels = [];

// Level 102 (4x4)
levels.push({
  id: 102,
  title: "Level 102",
  gridSize: 4,
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
});

// Level 103 (4x4)
levels.push({
  id: 103,
  title: "Level 103",
  gridSize: 4,
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
});

// Level 104 (5x5)
levels.push({
  id: 104,
  title: "Level 104",
  gridSize: 5,
  initialTiles: [
    { id: "l104-tile-1", color: "orange", number: 4 },
    { id: "l104-tile-2", color: "cyan", isFrozen: true },
    { id: "l104-tile-3", color: "orange" },
    { id: "l104-tile-4", color: "grey" },
    { id: "l104-tile-5", color: "grey" },
    { id: "l104-tile-6", color: "grey" },
    { id: "l104-tile-7", color: "grey" },
    { id: "l104-tile-8", color: "orange" },
    { id: "l104-tile-9", color: "grey" },
    { id: "l104-tile-10", color: "grey" },
    { id: "l104-tile-11", color: "orange" },
    { id: "l104-tile-12", color: "grey" },
    { id: "l104-tile-13", color: "cyan" },
    { id: "l104-tile-14", color: "grey" },
    { id: "l104-tile-15", color: "purple" },
    { id: "l104-tile-16", color: "grey" },
    { id: "l104-tile-17", color: "grey" },
    { id: "l104-tile-18", color: "cyan" },
    { id: "l104-tile-19", color: "grey" },
    { id: "l104-tile-20", color: "grey" },
    { id: "l104-tile-21", color: "cyan", number: 4 },
    { id: "l104-tile-22", color: "purple", isFrozen: true },
    { id: "l104-tile-23", color: "grey" },
    { id: "l104-tile-24", color: "grey" },
    { id: "l104-tile-25", color: "purple", number: 3 },
  ]
});

// Level 105 (5x5)
levels.push({
  id: 105,
  title: "Level 105",
  gridSize: 5,
  initialTiles: [
    { id: "l105-tile-1", color: "grey" },
    { id: "l105-tile-2", color: "lime" },
    { id: "l105-tile-3", color: "lime", number: 4 },
    { id: "l105-tile-4", color: "grey" },
    { id: "l105-tile-5", color: "lime" },
    { id: "l105-tile-6", color: "lime" },
    { id: "l105-tile-7", color: "grey" },
    { id: "l105-tile-8", color: "joker", isJoker: true, isFrozen: true },
    { id: "l105-tile-9", color: "grey" },
    { id: "l105-tile-10", color: "grey" },
    { id: "l105-tile-11", color: "grey" },
    { id: "l105-tile-12", color: "grey" },
    { id: "l105-tile-13", color: "grey" },
    { id: "l105-tile-14", color: "indigo" },
    { id: "l105-tile-15", color: "grey" },
    { id: "l105-tile-16", color: "grey" },
    { id: "l105-tile-17", color: "grey" },
    { id: "l105-tile-18", color: "indigo", isFrozen: true },
    { id: "l105-tile-19", color: "grey" },
    { id: "l105-tile-20", color: "grey" },
    { id: "l105-tile-21", color: "indigo" },
    { id: "l105-tile-22", color: "grey" },
    { id: "l105-tile-23", color: "indigo", number: 5 },
    { id: "l105-tile-24", color: "grey" },
    { id: "l105-tile-25", color: "grey" },
  ]
});

// Level 106 (5x5)
levels.push({
  id: 106,
  title: "Level 106",
  gridSize: 5,
  initialTiles: [
    { id: "l106-tile-1", color: "blue", number: 4 },
    { id: "l106-tile-2", color: "orange" },
    { id: "l106-tile-3", color: "grey" },
    { id: "l106-tile-4", color: "grey" },
    { id: "l106-tile-5", color: "blue" },
    { id: "l106-tile-6", color: "grey" },
    { id: "l106-tile-7", color: "grey" },
    { id: "l106-tile-8", color: "blue", isFrozen: true },
    { id: "l106-tile-9", color: "grey" },
    { id: "l106-tile-10", color: "grey" },
    { id: "l106-tile-11", color: "grey" },
    { id: "l106-tile-12", color: "orange" },
    { id: "l106-tile-13", color: "orange", allowedColors: ["orange", "yellow"], number: 5 },
    { id: "l106-tile-14", color: "yellow" },
    { id: "l106-tile-15", color: "grey" },
    { id: "l106-tile-16", color: "grey" },
    { id: "l106-tile-17", color: "grey" },
    { id: "l106-tile-18", color: "blue", isFrozen: true },
    { id: "l106-tile-19", color: "grey" },
    { id: "l106-tile-20", color: "grey" },
    { id: "l106-tile-21", color: "grey" },
    { id: "l106-tile-22", color: "grey" },
    { id: "l106-tile-23", color: "grey" },
    { id: "l106-tile-24", color: "yellow" },
    { id: "l106-tile-25", color: "grey" },
  ]
});

// Level 107 (5x5)
levels.push({
  id: 107,
  title: "Level 107",
  gridSize: 5,
  initialTiles: [
    { id: "l107-tile-1", color: "pink" },
    { id: "l107-tile-2", color: "pink", isFrozen: true },
    { id: "l107-tile-3", color: "charcoal", number: 3 },
    { id: "l107-tile-4", color: "green", isFrozen: true },
    { id: "l107-tile-5", color: "green" },
    { id: "l107-tile-6", color: "grey" },
    { id: "l107-tile-7", color: "charcoal" },
    { id: "l107-tile-8", color: "grey" },
    { id: "l107-tile-9", color: "charcoal" },
    { id: "l107-tile-10", color: "grey" },
    { id: "l107-tile-11", color: "pink", number: 4 },
    { id: "l107-tile-12", color: "grey" },
    { id: "l107-tile-13", color: "grey" },
    { id: "l107-tile-14", color: "grey" },
    { id: "l107-tile-15", color: "green", number: 4 },
    { id: "l107-tile-16", color: "pink" },
    { id: "l107-tile-17", color: "grey" },
    { id: "l107-tile-18", color: "amber" },
    { id: "l107-tile-19", color: "grey" },
    { id: "l107-tile-20", color: "green" },
    { id: "l107-tile-21", color: "grey" },
    { id: "l107-tile-22", color: "amber", isFrozen: true },
    { id: "l107-tile-23", color: "amber", number: 3 },
    { id: "l107-tile-24", color: "grey" },
    { id: "l107-tile-25", color: "grey" },
  ]
});

// Level 108 (6x6)
levels.push({
  id: 108,
  title: "Level 108",
  gridSize: 6,
  initialTiles: [
    { id: "l108-tile-1", color: "blue", allowedColors: ["blue", "cyan"], number: 5 },
    { id: "l108-tile-2", color: "cyan", isFrozen: true },
    { id: "l108-tile-3", color: "grey" },
    { id: "l108-tile-4", color: "grey" },
    { id: "l108-tile-5", color: "grey" },
    { id: "l108-tile-6", color: "grey" },
    { id: "l108-tile-7", color: "blue" },
    { id: "l108-tile-8", color: "grey" },
    { id: "l108-tile-9", color: "cyan" },
    { id: "l108-tile-10", color: "lime" },
    { id: "l108-tile-11", color: "grey" },
    { id: "l108-tile-12", color: "grey" },
    { id: "l108-tile-13", color: "blue" },
    { id: "l108-tile-14", color: "grey" },
    { id: "l108-tile-15", color: "grey" },
    { id: "l108-tile-16", color: "lime", isFrozen: true },
    { id: "l108-tile-17", color: "grey" },
    { id: "l108-tile-18", color: "grey" },
    { id: "l108-tile-19", color: "grey" },
    { id: "l108-tile-20", color: "grey" },
    { id: "l108-tile-21", color: "grey" },
    { id: "l108-tile-22", color: "lime", number: 4 },
    { id: "l108-tile-23", color: "lime" },
    { id: "l108-tile-24", color: "purple" },
    { id: "l108-tile-25", color: "grey" },
    { id: "l108-tile-26", color: "grey" },
    { id: "l108-tile-27", color: "grey" },
    { id: "l108-tile-28", color: "grey" },
    { id: "l108-tile-29", color: "pink" },
    { id: "l108-tile-30", color: "purple" },
    { id: "l108-tile-31", color: "grey" },
    { id: "l108-tile-32", color: "grey" },
    { id: "l108-tile-33", color: "grey" },
    { id: "l108-tile-34", color: "grey" },
    { id: "l108-tile-35", color: "pink", isFrozen: true },
    { id: "l108-tile-36", color: "purple", allowedColors: ["purple", "pink"], number: 5 },
  ]
});

// Level 109 (6x6)
const l109Tiles = Array.from({ length: 36 }, (_, i) => ({ id: `l109-tile-${i+1}`, color: "grey" }));
l109Tiles[0] = { id: "l109-tile-1", color: "red", number: 5 };
l109Tiles[5] = { id: "l109-tile-6", color: "yellow", number: 5 };
l109Tiles[35] = { id: "l109-tile-36", color: "green", number: 5 };
l109Tiles[24] = { id: "l109-tile-25", color: "red", isFrozen: true };
l109Tiles[1] = { id: "l109-tile-2", color: "yellow", isFrozen: true };
l109Tiles[11] = { id: "l109-tile-12", color: "green", isFrozen: true };
l109Tiles[6] = { id: "l109-tile-7", color: "red" };
l109Tiles[12] = { id: "l109-tile-13", color: "red" };
l109Tiles[19] = { id: "l109-tile-20", color: "red" };
l109Tiles[4] = { id: "l109-tile-5", color: "yellow" };
l109Tiles[3] = { id: "l109-tile-4", color: "yellow" };
l109Tiles[8] = { id: "l109-tile-9", color: "yellow" };
l109Tiles[29] = { id: "l109-tile-30", color: "green" };
l109Tiles[23] = { id: "l109-tile-24", color: "green" };
l109Tiles[22] = { id: "l109-tile-23", color: "green" };
levels.push({
  id: 109,
  title: "Level 109",
  gridSize: 6,
  initialTiles: l109Tiles
});

// Level 110 (6x6)
const l110Tiles = Array.from({ length: 36 }, (_, i) => ({ id: `l110-tile-${i+1}`, color: "grey" }));
l110Tiles[0] = { id: "l110-tile-1", color: "purple", number: 4 };
l110Tiles[14] = { id: "l110-tile-15", color: "orange", allowedColors: ["orange", "red", "amber"], number: 6 };
l110Tiles[21] = { id: "l110-tile-22", color: "cyan", allowedColors: ["cyan", "lime", "teal"], number: 6 };
l110Tiles[8] = { id: "l110-tile-9", color: "red", isFrozen: true };
l110Tiles[15] = { id: "l110-tile-16", color: "lime", isFrozen: true };
l110Tiles[20] = { id: "l110-tile-21", color: "amber", isFrozen: true };
l110Tiles[27] = { id: "l110-tile-28", color: "cyan", isFrozen: true };
l110Tiles[9] = { id: "l110-tile-10", color: "joker", isJoker: true };
l110Tiles[26] = { id: "l110-tile-27", color: "joker", isJoker: true };
l110Tiles[1] = { id: "l110-tile-2", color: "purple" };
l110Tiles[2] = { id: "l110-tile-3", color: "purple" };
l110Tiles[18] = { id: "l110-tile-19", color: "purple" };
l110Tiles[32] = { id: "l110-tile-33", color: "orange" };
l110Tiles[33] = { id: "l110-tile-34", color: "cyan" };
levels.push({
  id: 110,
  title: "Level 110",
  gridSize: 6,
  initialTiles: l110Tiles
});

function serializeLevel(lvl) {
  const lines = [];
  lines.push("  {");
  lines.push(`    id: ${lvl.id},`);
  lines.push(`    title: '${lvl.title}',`);
  lines.push(`    gridSize: ${lvl.gridSize},`);
  lines.push("    initialTiles: [");
  for (const t of lvl.initialTiles) {
    const parts = [`id: '${t.id}'`, `color: '${t.color}'`];
    if (t.number !== undefined) parts.push(`number: ${t.number}`);
    if (t.allowedColors) parts.push(`allowedColors: ${JSON.stringify(t.allowedColors).replace(/"/g, "'")}`);
    if (t.isJoker) parts.push(`isJoker: true`);
    if (t.isFrozen) parts.push(`isFrozen: true`);
    lines.push(`      { ${parts.join(", ")} },`);
  }
  lines.push("    ],");
  lines.push("  },");
  return lines.join("\n");
}

const serializedCode = levels.map(serializeLevel).join("\n");
writeFileSync("generated_levels_102_110.txt", serializedCode);
console.log("Successfully wrote generated_levels_102_110.txt");
