/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, HelpCircle, X, Sparkles, Undo2, Lock, Play, Grid } from 'lucide-react';

type TileColor = 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan' | 'lime' | 'grey';

interface Tile {
  id: string;
  color: TileColor;
  number?: number;
}

interface LevelConfig {
  id: number;
  title: string;
  gridSize: number;
  initialTiles: Tile[];
}

type ScreenMode = 'home' | 'level-select' | 'game';

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Level 1',
    gridSize: 2,
    initialTiles: [
      { id: 'l1-tile-1', color: 'red' },
      { id: 'l1-tile-2', color: 'grey' },
      { id: 'l1-tile-3', color: 'grey' },
      { id: 'l1-tile-4', color: 'red', number: 2 },
    ],
  },
  {
    id: 2,
    title: 'Level 2',
    gridSize: 3,
    initialTiles: [
      { id: 'l2-tile-1', color: 'red' },
      { id: 'l2-tile-2', color: 'grey' },
      { id: 'l2-tile-3', color: 'red' },
      { id: 'l2-tile-4', color: 'grey' },
      { id: 'l2-tile-5', color: 'grey' },
      { id: 'l2-tile-6', color: 'grey' },
      { id: 'l2-tile-7', color: 'grey' },
      { id: 'l2-tile-8', color: 'grey' },
      { id: 'l2-tile-9', color: 'red', number: 3 },
    ],
  },
  {
    id: 3,
    title: 'Level 3',
    gridSize: 3,
    initialTiles: [
      { id: 'l3-tile-1', color: 'yellow', number: 2 },
      { id: 'l3-tile-2', color: 'grey' },
      { id: 'l3-tile-3', color: 'green' },
      { id: 'l3-tile-4', color: 'grey' },
      { id: 'l3-tile-5', color: 'yellow' },
      { id: 'l3-tile-6', color: 'green' },
      { id: 'l3-tile-7', color: 'green' },
      { id: 'l3-tile-8', color: 'grey' },
      { id: 'l3-tile-9', color: 'green', number: 4 },
    ],
  },
  {
    id: 4,
    title: 'Level 4',
    gridSize: 3,
    initialTiles: [
      { id: 'l4-tile-1', color: 'grey' },
      { id: 'l4-tile-2', color: 'blue', number: 3 },
      { id: 'l4-tile-3', color: 'orange' },
      { id: 'l4-tile-4', color: 'grey' },
      { id: 'l4-tile-5', color: 'blue' },
      { id: 'l4-tile-6', color: 'grey' },
      { id: 'l4-tile-7', color: 'orange', number: 2 },
      { id: 'l4-tile-8', color: 'grey' },
      { id: 'l4-tile-9', color: 'blue' },
    ],
  },
  {
    id: 5,
    title: 'Level 5',
    gridSize: 3,
    initialTiles: [
      { id: 'l5-tile-1', color: 'red', number: 3 },
      { id: 'l5-tile-2', color: 'grey' },
      { id: 'l5-tile-3', color: 'purple' },
      { id: 'l5-tile-4', color: 'grey' },
      { id: 'l5-tile-5', color: 'purple', number: 3 },
      { id: 'l5-tile-6', color: 'red' },
      { id: 'l5-tile-7', color: 'purple' },
      { id: 'l5-tile-8', color: 'grey' },
      { id: 'l5-tile-9', color: 'red' },
    ],
  },
  {
    id: 6,
    title: 'Level 6',
    gridSize: 4,
    initialTiles: [
      { id: 'l6-tile-1', color: 'blue' },
      { id: 'l6-tile-2', color: 'grey' },
      { id: 'l6-tile-3', color: 'grey' },
      { id: 'l6-tile-4', color: 'blue' },
      { id: 'l6-tile-5', color: 'grey' },
      { id: 'l6-tile-6', color: 'grey' },
      { id: 'l6-tile-7', color: 'grey' },
      { id: 'l6-tile-8', color: 'grey' },
      { id: 'l6-tile-9', color: 'grey' },
      { id: 'l6-tile-10', color: 'blue' },
      { id: 'l6-tile-11', color: 'grey' },
      { id: 'l6-tile-12', color: 'grey' },
      { id: 'l6-tile-13', color: 'grey' },
      { id: 'l6-tile-14', color: 'grey' },
      { id: 'l6-tile-15', color: 'grey' },
      { id: 'l6-tile-16', color: 'blue', number: 4 },
    ],
  },
  {
    id: 7,
    title: 'Level 7',
    gridSize: 4,
    initialTiles: [
      { id: 'l7-tile-1', color: 'yellow', number: 3 },
      { id: 'l7-tile-2', color: 'grey' },
      { id: 'l7-tile-3', color: 'purple' },
      { id: 'l7-tile-4', color: 'grey' },
      { id: 'l7-tile-5', color: 'grey' },
      { id: 'l7-tile-6', color: 'yellow' },
      { id: 'l7-tile-7', color: 'grey' },
      { id: 'l7-tile-8', color: 'purple' },
      { id: 'l7-tile-9', color: 'yellow' },
      { id: 'l7-tile-10', color: 'grey' },
      { id: 'l7-tile-11', color: 'purple' },
      { id: 'l7-tile-12', color: 'grey' },
      { id: 'l7-tile-13', color: 'grey' },
      { id: 'l7-tile-14', color: 'grey' },
      { id: 'l7-tile-15', color: 'grey' },
      { id: 'l7-tile-16', color: 'purple', number: 4 },
    ],
  },
  {
    id: 8,
    title: 'Level 8',
    gridSize: 4,
    initialTiles: [
      { id: 'l8-tile-1', color: 'green' },
      { id: 'l8-tile-2', color: 'grey' },
      { id: 'l8-tile-3', color: 'red' },
      { id: 'l8-tile-4', color: 'grey' },
      { id: 'l8-tile-5', color: 'grey' },
      { id: 'l8-tile-6', color: 'green', number: 5 },
      { id: 'l8-tile-7', color: 'green' },
      { id: 'l8-tile-8', color: 'grey' },
      { id: 'l8-tile-9', color: 'grey' },
      { id: 'l8-tile-10', color: 'green' },
      { id: 'l8-tile-11', color: 'grey' },
      { id: 'l8-tile-12', color: 'red' },
      { id: 'l8-tile-13', color: 'red', number: 3 },
      { id: 'l8-tile-14', color: 'grey' },
      { id: 'l8-tile-15', color: 'green' },
      { id: 'l8-tile-16', color: 'grey' },
    ],
  },
  {
    id: 9,
    title: 'Level 9',
    gridSize: 4,
    initialTiles: [
      { id: 'l9-tile-1', color: 'grey' },
      { id: 'l9-tile-2', color: 'orange' },
      { id: 'l9-tile-3', color: 'grey' },
      { id: 'l9-tile-4', color: 'orange', number: 4 },
      { id: 'l9-tile-5', color: 'blue' },
      { id: 'l9-tile-6', color: 'grey' },
      { id: 'l9-tile-7', color: 'pink', number: 2 },
      { id: 'l9-tile-8', color: 'orange' },
      { id: 'l9-tile-9', color: 'grey' },
      { id: 'l9-tile-10', color: 'pink' },
      { id: 'l9-tile-11', color: 'grey' },
      { id: 'l9-tile-12', color: 'orange' },
      { id: 'l9-tile-13', color: 'blue', number: 3 },
      { id: 'l9-tile-14', color: 'grey' },
      { id: 'l9-tile-15', color: 'blue' },
      { id: 'l9-tile-16', color: 'grey' },
    ],
  },
  {
    id: 10,
    title: 'Level 10',
    gridSize: 4,
    initialTiles: [
      { id: 'l10-tile-1', color: 'red', number: 4 },
      { id: 'l10-tile-2', color: 'yellow' },
      { id: 'l10-tile-3', color: 'green' },
      { id: 'l10-tile-4', color: 'yellow', number: 3 },
      { id: 'l10-tile-5', color: 'red' },
      { id: 'l10-tile-6', color: 'grey' },
      { id: 'l10-tile-7', color: 'purple' },
      { id: 'l10-tile-8', color: 'yellow' },
      { id: 'l10-tile-9', color: 'red' },
      { id: 'l10-tile-10', color: 'purple' },
      { id: 'l10-tile-11', color: 'grey' },
      { id: 'l10-tile-12', color: 'green' },
      { id: 'l10-tile-13', color: 'green', number: 4 },
      { id: 'l10-tile-14', color: 'red' },
      { id: 'l10-tile-15', color: 'green' },
      { id: 'l10-tile-16', color: 'purple', number: 3 },
    ],
  },
  {
    id: 11,
    title: 'Level 11',
    gridSize: 4,
    initialTiles: [
      { id: 'l11-tile-1', color: 'pink', number: 5 },
      { id: 'l11-tile-2', color: 'grey' },
      { id: 'l11-tile-3', color: 'cyan' },
      { id: 'l11-tile-4', color: 'grey' },
      { id: 'l11-tile-5', color: 'grey' },
      { id: 'l11-tile-6', color: 'pink' },
      { id: 'l11-tile-7', color: 'grey' },
      { id: 'l11-tile-8', color: 'pink' },
      { id: 'l11-tile-9', color: 'cyan', number: 3 },
      { id: 'l11-tile-10', color: 'grey' },
      { id: 'l11-tile-11', color: 'pink' },
      { id: 'l11-tile-12', color: 'grey' },
      { id: 'l11-tile-13', color: 'grey' },
      { id: 'l11-tile-14', color: 'cyan' },
      { id: 'l11-tile-15', color: 'grey' },
      { id: 'l11-tile-16', color: 'pink' },
    ],
  },
  {
    id: 12,
    title: 'Level 12',
    gridSize: 4,
    initialTiles: [
      { id: 'l12-tile-1', color: 'blue', number: 4 },
      { id: 'l12-tile-2', color: 'orange' },
      { id: 'l12-tile-3', color: 'lime' },
      { id: 'l12-tile-4', color: 'orange', number: 4 },
      { id: 'l12-tile-5', color: 'blue' },
      { id: 'l12-tile-6', color: 'grey' },
      { id: 'l12-tile-7', color: 'orange' },
      { id: 'l12-tile-8', color: 'blue' },
      { id: 'l12-tile-9', color: 'lime', number: 3 },
      { id: 'l12-tile-10', color: 'grey' },
      { id: 'l12-tile-11', color: 'grey' },
      { id: 'l12-tile-12', color: 'orange' },
      { id: 'l12-tile-13', color: 'grey' },
      { id: 'l12-tile-14', color: 'lime' },
      { id: 'l12-tile-15', color: 'blue' },
      { id: 'l12-tile-16', color: 'grey' },
    ],
  },
  {
    id: 13,
    title: 'Level 13',
    gridSize: 4,
    initialTiles: [
      { id: 'l13-tile-1', color: 'red', number: 5 },
      { id: 'l13-tile-2', color: 'green' },
      { id: 'l13-tile-3', color: 'grey' },
      { id: 'l13-tile-4', color: 'grey' },
      { id: 'l13-tile-5', color: 'grey' },
      { id: 'l13-tile-6', color: 'red' },
      { id: 'l13-tile-7', color: 'green' },
      { id: 'l13-tile-8', color: 'grey' },
      { id: 'l13-tile-9', color: 'red' },
      { id: 'l13-tile-10', color: 'grey' },
      { id: 'l13-tile-11', color: 'green' },
      { id: 'l13-tile-12', color: 'red' },
      { id: 'l13-tile-13', color: 'green' },
      { id: 'l13-tile-14', color: 'grey' },
      { id: 'l13-tile-15', color: 'red' },
      { id: 'l13-tile-16', color: 'green', number: 5 },
    ],
  },
  {
    id: 14,
    title: 'Level 14',
    gridSize: 5,
    initialTiles: [
      { id: 'l14-tile-1', color: 'purple', number: 5 },
      { id: 'l14-tile-2', color: 'grey' },
      { id: 'l14-tile-3', color: 'yellow' },
      { id: 'l14-tile-4', color: 'grey' },
      { id: 'l14-tile-5', color: 'purple' },
      { id: 'l14-tile-6', color: 'grey' },
      { id: 'l14-tile-7', color: 'grey' },
      { id: 'l14-tile-8', color: 'grey' },
      { id: 'l14-tile-9', color: 'grey' },
      { id: 'l14-tile-10', color: 'grey' },
      { id: 'l14-tile-11', color: 'purple' },
      { id: 'l14-tile-12', color: 'grey' },
      { id: 'l14-tile-13', color: 'grey' },
      { id: 'l14-tile-14', color: 'grey' },
      { id: 'l14-tile-15', color: 'yellow' },
      { id: 'l14-tile-16', color: 'grey' },
      { id: 'l14-tile-17', color: 'purple' },
      { id: 'l14-tile-18', color: 'grey' },
      { id: 'l14-tile-19', color: 'grey' },
      { id: 'l14-tile-20', color: 'grey' },
      { id: 'l14-tile-21', color: 'yellow', number: 4 },
      { id: 'l14-tile-22', color: 'grey' },
      { id: 'l14-tile-23', color: 'yellow' },
      { id: 'l14-tile-24', color: 'grey' },
      { id: 'l14-tile-25', color: 'purple' },
    ],
  },
  {
    id: 15,
    title: 'Level 15',
    gridSize: 5,
    initialTiles: [
      { id: 'l15-tile-1', color: 'cyan', number: 4 },
      { id: 'l15-tile-2', color: 'grey' },
      { id: 'l15-tile-3', color: 'orange' },
      { id: 'l15-tile-4', color: 'grey' },
      { id: 'l15-tile-5', color: 'green', number: 4 },
      { id: 'l15-tile-6', color: 'grey' },
      { id: 'l15-tile-7', color: 'cyan' },
      { id: 'l15-tile-8', color: 'grey' },
      { id: 'l15-tile-9', color: 'green' },
      { id: 'l15-tile-10', color: 'grey' },
      { id: 'l15-tile-11', color: 'orange', number: 4 },
      { id: 'l15-tile-12', color: 'grey' },
      { id: 'l15-tile-13', color: 'grey' },
      { id: 'l15-tile-14', color: 'grey' },
      { id: 'l15-tile-15', color: 'orange' },
      { id: 'l15-tile-16', color: 'grey' },
      { id: 'l15-tile-17', color: 'green' },
      { id: 'l15-tile-18', color: 'grey' },
      { id: 'l15-tile-19', color: 'cyan' },
      { id: 'l15-tile-20', color: 'grey' },
      { id: 'l15-tile-21', color: 'orange' },
      { id: 'l15-tile-22', color: 'grey' },
      { id: 'l15-tile-23', color: 'green' },
      { id: 'l15-tile-24', color: 'grey' },
      { id: 'l15-tile-25', color: 'cyan' },
    ],
  },
  {
    id: 16,
    title: 'Level 16',
    gridSize: 5,
    initialTiles: [
      { id: 'l16-tile-1', color: 'red', number: 5 },
      { id: 'l16-tile-2', color: 'blue' },
      { id: 'l16-tile-3', color: 'grey' },
      { id: 'l16-tile-4', color: 'red' },
      { id: 'l16-tile-5', color: 'blue', number: 5 },
      { id: 'l16-tile-6', color: 'grey' },
      { id: 'l16-tile-7', color: 'yellow' },
      { id: 'l16-tile-8', color: 'grey' },
      { id: 'l16-tile-9', color: 'grey' },
      { id: 'l16-tile-10', color: 'grey' },
      { id: 'l16-tile-11', color: 'red' },
      { id: 'l16-tile-12', color: 'grey' },
      { id: 'l16-tile-13', color: 'yellow', number: 3 },
      { id: 'l16-tile-14', color: 'grey' },
      { id: 'l16-tile-15', color: 'blue' },
      { id: 'l16-tile-16', color: 'grey' },
      { id: 'l16-tile-17', color: 'grey' },
      { id: 'l16-tile-18', color: 'grey' },
      { id: 'l16-tile-19', color: 'yellow' },
      { id: 'l16-tile-20', color: 'grey' },
      { id: 'l16-tile-21', color: 'blue' },
      { id: 'l16-tile-22', color: 'red' },
      { id: 'l16-tile-23', color: 'grey' },
      { id: 'l16-tile-24', color: 'blue' },
      { id: 'l16-tile-25', color: 'red' },
    ],
  },
  {
    id: 17,
    title: 'Level 17',
    gridSize: 5,
    initialTiles: [
      { id: 'l17-tile-1', color: 'pink', number: 4 },
      { id: 'l17-tile-2', color: 'grey' },
      { id: 'l17-tile-3', color: 'lime' },
      { id: 'l17-tile-4', color: 'grey' },
      { id: 'l17-tile-5', color: 'purple', number: 4 },
      { id: 'l17-tile-6', color: 'grey' },
      { id: 'l17-tile-7', color: 'pink' },
      { id: 'l17-tile-8', color: 'lime' },
      { id: 'l17-tile-9', color: 'purple' },
      { id: 'l17-tile-10', color: 'grey' },
      { id: 'l17-tile-11', color: 'lime', number: 4 },
      { id: 'l17-tile-12', color: 'purple' },
      { id: 'l17-tile-13', color: 'cyan' },
      { id: 'l17-tile-14', color: 'grey' },
      { id: 'l17-tile-15', color: 'cyan' },
      { id: 'l17-tile-16', color: 'cyan' },
      { id: 'l17-tile-17', color: 'lime' },
      { id: 'l17-tile-18', color: 'grey' },
      { id: 'l17-tile-19', color: 'pink' },
      { id: 'l17-tile-20', color: 'grey' },
      { id: 'l17-tile-21', color: 'cyan', number: 4 },
      { id: 'l17-tile-22', color: 'grey' },
      { id: 'l17-tile-23', color: 'purple' },
      { id: 'l17-tile-24', color: 'grey' },
      { id: 'l17-tile-25', color: 'pink' },
    ],
  },
  {
    id: 18,
    title: 'Level 18',
    gridSize: 5,
    initialTiles: [
      { id: 'l18-tile-1', color: 'green', number: 5 },
      { id: 'l18-tile-2', color: 'orange' },
      { id: 'l18-tile-3', color: 'grey' },
      { id: 'l18-tile-4', color: 'blue' },
      { id: 'l18-tile-5', color: 'orange', number: 5 },
      { id: 'l18-tile-6', color: 'grey' },
      { id: 'l18-tile-7', color: 'green' },
      { id: 'l18-tile-8', color: 'grey' },
      { id: 'l18-tile-9', color: 'orange' },
      { id: 'l18-tile-10', color: 'grey' },
      { id: 'l18-tile-11', color: 'blue' },
      { id: 'l18-tile-12', color: 'grey' },
      { id: 'l18-tile-13', color: 'blue', number: 5 },
      { id: 'l18-tile-14', color: 'grey' },
      { id: 'l18-tile-15', color: 'green' },
      { id: 'l18-tile-16', color: 'grey' },
      { id: 'l18-tile-17', color: 'orange' },
      { id: 'l18-tile-18', color: 'grey' },
      { id: 'l18-tile-19', color: 'blue' },
      { id: 'l18-tile-20', color: 'grey' },
      { id: 'l18-tile-21', color: 'green' },
      { id: 'l18-tile-22', color: 'grey' },
      { id: 'l18-tile-23', color: 'orange' },
      { id: 'l18-tile-24', color: 'blue' },
      { id: 'l18-tile-25', color: 'green' },
    ],
  },
  {
    id: 19,
    title: 'Level 19',
    gridSize: 5,
    initialTiles: [
      { id: 'l19-tile-1', color: 'red', number: 5 },
      { id: 'l19-tile-2', color: 'yellow' },
      { id: 'l19-tile-3', color: 'purple' },
      { id: 'l19-tile-4', color: 'lime' },
      { id: 'l19-tile-5', color: 'pink', number: 3 },
      { id: 'l19-tile-6', color: 'red' },
      { id: 'l19-tile-7', color: 'grey' },
      { id: 'l19-tile-8', color: 'yellow', number: 4 },
      { id: 'l19-tile-9', color: 'grey' },
      { id: 'l19-tile-10', color: 'pink' },
      { id: 'l19-tile-11', color: 'lime' },
      { id: 'l19-tile-12', color: 'red' },
      { id: 'l19-tile-13', color: 'grey' },
      { id: 'l19-tile-14', color: 'purple', number: 4 },
      { id: 'l19-tile-15', color: 'yellow' },
      { id: 'l19-tile-16', color: 'pink' },
      { id: 'l19-tile-17', color: 'grey' },
      { id: 'l19-tile-18', color: 'lime', number: 3 },
      { id: 'l19-tile-19', color: 'grey' },
      { id: 'l19-tile-20', color: 'red' },
      { id: 'l19-tile-21', color: 'yellow' },
      { id: 'l19-tile-22', color: 'purple' },
      { id: 'l19-tile-23', color: 'grey' },
      { id: 'l19-tile-24', color: 'purple' },
      { id: 'l19-tile-25', color: 'red' },
    ],
  },
  {
    id: 20,
    title: 'Level 20',
    gridSize: 5,
    initialTiles: [
      { id: 'l20-tile-1', color: 'cyan', number: 5 },
      { id: 'l20-tile-2', color: 'green' },
      { id: 'l20-tile-3', color: 'orange' },
      { id: 'l20-tile-4', color: 'blue' },
      { id: 'l20-tile-5', color: 'green', number: 5 },
      { id: 'l20-tile-6', color: 'cyan' },
      { id: 'l20-tile-7', color: 'grey' },
      { id: 'l20-tile-8', color: 'cyan' },
      { id: 'l20-tile-9', color: 'grey' },
      { id: 'l20-tile-10', color: 'orange' },
      { id: 'l20-tile-11', color: 'blue' },
      { id: 'l20-tile-12', color: 'orange' },
      { id: 'l20-tile-13', color: 'grey' },
      { id: 'l20-tile-14', color: 'green' },
      { id: 'l20-tile-15', color: 'blue' },
      { id: 'l20-tile-16', color: 'cyan' },
      { id: 'l20-tile-17', color: 'grey' },
      { id: 'l20-tile-18', color: 'blue' },
      { id: 'l20-tile-19', color: 'grey' },
      { id: 'l20-tile-20', color: 'green' },
      { id: 'l20-tile-21', color: 'orange', number: 5 },
      { id: 'l20-tile-22', color: 'green' },
      { id: 'l20-tile-23', color: 'cyan' },
      { id: 'l20-tile-24', color: 'orange' },
      { id: 'l20-tile-25', color: 'blue', number: 5 },
    ],
  },
  {
    id: 21,
    title: 'Level 21',
    gridSize: 6,
    initialTiles: [
      { id: 'l21-tile-1', color: 'cyan', number: 6 },
      { id: 'l21-tile-2', color: 'grey' },
      { id: 'l21-tile-3', color: 'purple' },
      { id: 'l21-tile-4', color: 'grey' },
      { id: 'l21-tile-5', color: 'orange' },
      { id: 'l21-tile-6', color: 'orange', number: 6 },
      { id: 'l21-tile-7', color: 'grey' },
      { id: 'l21-tile-8', color: 'orange' },
      { id: 'l21-tile-9', color: 'grey' },
      { id: 'l21-tile-10', color: 'cyan' },
      { id: 'l21-tile-11', color: 'grey' },
      { id: 'l21-tile-12', color: 'purple' },
      { id: 'l21-tile-13', color: 'purple' },
      { id: 'l21-tile-14', color: 'grey' },
      { id: 'l21-tile-15', color: 'cyan' },
      { id: 'l21-tile-16', color: 'grey' },
      { id: 'l21-tile-17', color: 'orange' },
      { id: 'l21-tile-18', color: 'grey' },
      { id: 'l21-tile-19', color: 'grey' },
      { id: 'l21-tile-20', color: 'orange' },
      { id: 'l21-tile-21', color: 'grey' },
      { id: 'l21-tile-22', color: 'purple' },
      { id: 'l21-tile-23', color: 'grey' },
      { id: 'l21-tile-24', color: 'cyan' },
      { id: 'l21-tile-25', color: 'cyan' },
      { id: 'l21-tile-26', color: 'grey' },
      { id: 'l21-tile-27', color: 'purple' },
      { id: 'l21-tile-28', color: 'grey' },
      { id: 'l21-tile-29', color: 'orange' },
      { id: 'l21-tile-30', color: 'grey' },
      { id: 'l21-tile-31', color: 'grey' },
      { id: 'l21-tile-32', color: 'cyan' },
      { id: 'l21-tile-33', color: 'purple', number: 6 },
      { id: 'l21-tile-34', color: 'grey' },
      { id: 'l21-tile-35', color: 'grey' },
      { id: 'l21-tile-36', color: 'grey' },
    ],
  },
  {
    id: 22,
    title: 'Level 22',
    gridSize: 6,
    initialTiles: [
      { id: 'l22-tile-1', color: 'lime', number: 6 },
      { id: 'l22-tile-2', color: 'grey' },
      { id: 'l22-tile-3', color: 'blue' },
      { id: 'l22-tile-4', color: 'grey' },
      { id: 'l22-tile-5', color: 'red' },
      { id: 'l22-tile-6', color: 'blue', number: 6 },
      { id: 'l22-tile-7', color: 'red' },
      { id: 'l22-tile-8', color: 'grey' },
      { id: 'l22-tile-9', color: 'yellow' },
      { id: 'l22-tile-10', color: 'red' },
      { id: 'l22-tile-11', color: 'lime' },
      { id: 'l22-tile-12', color: 'grey' },
      { id: 'l22-tile-13', color: 'grey' },
      { id: 'l22-tile-14', color: 'blue' },
      { id: 'l22-tile-15', color: 'lime' },
      { id: 'l22-tile-16', color: 'yellow' },
      { id: 'l22-tile-17', color: 'grey' },
      { id: 'l22-tile-18', color: 'red' },
      { id: 'l22-tile-19', color: 'lime' },
      { id: 'l22-tile-20', color: 'grey' },
      { id: 'l22-tile-21', color: 'red' },
      { id: 'l22-tile-22', color: 'grey' },
      { id: 'l22-tile-23', color: 'blue' },
      { id: 'l22-tile-24', color: 'grey' },
      { id: 'l22-tile-25', color: 'blue' },
      { id: 'l22-tile-26', color: 'yellow' },
      { id: 'l22-tile-27', color: 'grey' },
      { id: 'l22-tile-28', color: 'lime' },
      { id: 'l22-tile-29', color: 'grey' },
      { id: 'l22-tile-30', color: 'blue' },
      { id: 'l22-tile-31', color: 'red', number: 6 },
      { id: 'l22-tile-32', color: 'grey' },
      { id: 'l22-tile-33', color: 'lime' },
      { id: 'l22-tile-34', color: 'grey' },
      { id: 'l22-tile-35', color: 'yellow' },
      { id: 'l22-tile-36', color: 'yellow', number: 5 },
    ],
  },
  {
    id: 23,
    title: 'Level 23',
    gridSize: 6,
    initialTiles: [
      { id: 'l23-tile-1', color: 'grey' },
      { id: 'l23-tile-2', color: 'pink', number: 6 },
      { id: 'l23-tile-3', color: 'grey' },
      { id: 'l23-tile-4', color: 'cyan' },
      { id: 'l23-tile-5', color: 'cyan', number: 6 },
      { id: 'l23-tile-6', color: 'grey' },
      { id: 'l23-tile-7', color: 'green' },
      { id: 'l23-tile-8', color: 'grey' },
      { id: 'l23-tile-9', color: 'purple' },
      { id: 'l23-tile-10', color: 'green' },
      { id: 'l23-tile-11', color: 'orange' },
      { id: 'l23-tile-12', color: 'pink' },
      { id: 'l23-tile-13', color: 'green', number: 6 },
      { id: 'l23-tile-14', color: 'grey' },
      { id: 'l23-tile-15', color: 'cyan' },
      { id: 'l23-tile-16', color: 'pink' },
      { id: 'l23-tile-17', color: 'grey' },
      { id: 'l23-tile-18', color: 'purple' },
      { id: 'l23-tile-19', color: 'orange' },
      { id: 'l23-tile-20', color: 'green' },
      { id: 'l23-tile-21', color: 'pink' },
      { id: 'l23-tile-22', color: 'cyan' },
      { id: 'l23-tile-23', color: 'pink' },
      { id: 'l23-tile-24', color: 'purple', number: 5 },
      { id: 'l23-tile-25', color: 'purple' },
      { id: 'l23-tile-26', color: 'grey' },
      { id: 'l23-tile-27', color: 'green' },
      { id: 'l23-tile-28', color: 'orange' },
      { id: 'l23-tile-29', color: 'grey' },
      { id: 'l23-tile-30', color: 'cyan' },
      { id: 'l23-tile-31', color: 'pink' },
      { id: 'l23-tile-32', color: 'green' },
      { id: 'l23-tile-33', color: 'grey' },
      { id: 'l23-tile-34', color: 'orange', number: 4 },
      { id: 'l23-tile-35', color: 'purple' },
      { id: 'l23-tile-36', color: 'cyan' },
    ],
  },
  {
    id: 24,
    title: 'Level 24',
    gridSize: 6,
    initialTiles: [
      { id: 'l24-tile-1', color: 'red', number: 6 },
      { id: 'l24-tile-2', color: 'blue' },
      { id: 'l24-tile-3', color: 'grey' },
      { id: 'l24-tile-4', color: 'yellow' },
      { id: 'l24-tile-5', color: 'lime' },
      { id: 'l24-tile-6', color: 'yellow', number: 6 },
      { id: 'l24-tile-7', color: 'lime' },
      { id: 'l24-tile-8', color: 'grey' },
      { id: 'l24-tile-9', color: 'pink' },
      { id: 'l24-tile-10', color: 'red' },
      { id: 'l24-tile-11', color: 'grey' },
      { id: 'l24-tile-12', color: 'blue' },
      { id: 'l24-tile-13', color: 'yellow' },
      { id: 'l24-tile-14', color: 'pink' },
      { id: 'l24-tile-15', color: 'pink', number: 5 },
      { id: 'l24-tile-16', color: 'grey' },
      { id: 'l24-tile-17', color: 'lime' },
      { id: 'l24-tile-18', color: 'red' },
      { id: 'l24-tile-19', color: 'blue' },
      { id: 'l24-tile-20', color: 'grey' },
      { id: 'l24-tile-21', color: 'red' },
      { id: 'l24-tile-22', color: 'yellow' },
      { id: 'l24-tile-23', color: 'pink' },
      { id: 'l24-tile-24', color: 'lime' },
      { id: 'l24-tile-25', color: 'grey' },
      { id: 'l24-tile-26', color: 'lime' },
      { id: 'l24-tile-27', color: 'yellow' },
      { id: 'l24-tile-28', color: 'blue' },
      { id: 'l24-tile-29', color: 'grey' },
      { id: 'l24-tile-30', color: 'pink' },
      { id: 'l24-tile-31', color: 'blue', number: 6 },
      { id: 'l24-tile-32', color: 'red' },
      { id: 'l24-tile-33', color: 'yellow' },
      { id: 'l24-tile-34', color: 'blue' },
      { id: 'l24-tile-35', color: 'red' },
      { id: 'l24-tile-36', color: 'lime', number: 6 },
    ],
  },
  {
    id: 25,
    title: 'Level 25',
    gridSize: 6,
    initialTiles: [
      { id: 'l25-tile-1', color: 'red', number: 6 },
      { id: 'l25-tile-2', color: 'green' },
      { id: 'l25-tile-3', color: 'orange' },
      { id: 'l25-tile-4', color: 'purple' },
      { id: 'l25-tile-5', color: 'yellow' },
      { id: 'l25-tile-6', color: 'cyan', number: 6 },
      { id: 'l25-tile-7', color: 'cyan' },
      { id: 'l25-tile-8', color: 'grey' },
      { id: 'l25-tile-9', color: 'red' },
      { id: 'l25-tile-10', color: 'green' },
      { id: 'l25-tile-11', color: 'grey' },
      { id: 'l25-tile-12', color: 'orange' },
      { id: 'l25-tile-13', color: 'yellow' },
      { id: 'l25-tile-14', color: 'purple' },
      { id: 'l25-tile-15', color: 'purple', number: 5 },
      { id: 'l25-tile-16', color: 'cyan' },
      { id: 'l25-tile-17', color: 'red' },
      { id: 'l25-tile-18', color: 'green' },
      { id: 'l25-tile-19', color: 'orange' },
      { id: 'l25-tile-20', color: 'red' },
      { id: 'l25-tile-21', color: 'cyan' },
      { id: 'l25-tile-22', color: 'yellow', number: 4 },
      { id: 'l25-tile-23', color: 'grey' },
      { id: 'l25-tile-24', color: 'purple' },
      { id: 'l25-tile-25', color: 'green' },
      { id: 'l25-tile-26', color: 'grey' },
      { id: 'l25-tile-27', color: 'orange' },
      { id: 'l25-tile-28', color: 'cyan' },
      { id: 'l25-tile-29', color: 'purple' },
      { id: 'l25-tile-30', color: 'yellow' },
      { id: 'l25-tile-31', color: 'green', number: 6 },
      { id: 'l25-tile-32', color: 'red' },
      { id: 'l25-tile-33', color: 'cyan' },
      { id: 'l25-tile-34', color: 'green' },
      { id: 'l25-tile-35', color: 'red' },
      { id: 'l25-tile-36', color: 'orange', number: 5 },
    ],
  },
  {
    id: 26,
    title: 'Level 26',
    gridSize: 6,
    initialTiles: [
      { id: 'l26-tile-1', color: 'red', number: 5 },
      { id: 'l26-tile-2', color: 'blue' },
      { id: 'l26-tile-3', color: 'green' },
      { id: 'l26-tile-4', color: 'yellow' },
      { id: 'l26-tile-5', color: 'purple' },
      { id: 'l26-tile-6', color: 'blue', number: 5 },
      { id: 'l26-tile-7', color: 'orange' },
      { id: 'l26-tile-8', color: 'purple' },
      { id: 'l26-tile-9', color: 'yellow' },
      { id: 'l26-tile-10', color: 'green' },
      { id: 'l26-tile-11', color: 'grey' },
      { id: 'l26-tile-12', color: 'red' },
      { id: 'l26-tile-13', color: 'green', number: 5 },
      { id: 'l26-tile-14', color: 'grey' },
      { id: 'l26-tile-15', color: 'blue' },
      { id: 'l26-tile-16', color: 'orange' },
      { id: 'l26-tile-17', color: 'purple' },
      { id: 'l26-tile-18', color: 'yellow', number: 6 },
      { id: 'l26-tile-19', color: 'yellow' },
      { id: 'l26-tile-20', color: 'purple' },
      { id: 'l26-tile-21', color: 'red' },
      { id: 'l26-tile-22', color: 'blue' },
      { id: 'l26-tile-23', color: 'orange', number: 5 },
      { id: 'l26-tile-24', color: 'grey' },
      { id: 'l26-tile-25', color: 'purple', number: 6 },
      { id: 'l26-tile-26', color: 'green' },
      { id: 'l26-tile-27', color: 'orange' },
      { id: 'l26-tile-28', color: 'red' },
      { id: 'l26-tile-29', color: 'yellow' },
      { id: 'l26-tile-30', color: 'blue' },
      { id: 'l26-tile-31', color: 'orange' },
      { id: 'l26-tile-32', color: 'green' },
      { id: 'l26-tile-33', color: 'yellow' },
      { id: 'l26-tile-34', color: 'purple' },
      { id: 'l26-tile-35', color: 'red' },
      { id: 'l26-tile-36', color: 'grey' },
    ],
  },
  {
    id: 27,
    title: 'Level 27',
    gridSize: 6,
    initialTiles: [
      { id: 'l27-tile-1', color: 'lime', number: 5 },
      { id: 'l27-tile-2', color: 'pink' },
      { id: 'l27-tile-3', color: 'cyan' },
      { id: 'l27-tile-4', color: 'blue' },
      { id: 'l27-tile-5', color: 'red' },
      { id: 'l27-tile-6', color: 'pink', number: 5 },
      { id: 'l27-tile-7', color: 'yellow' },
      { id: 'l27-tile-8', color: 'lime' },
      { id: 'l27-tile-9', color: 'grey' },
      { id: 'l27-tile-10', color: 'cyan' },
      { id: 'l27-tile-11', color: 'blue' },
      { id: 'l27-tile-12', color: 'red' },
      { id: 'l27-tile-13', color: 'cyan', number: 5 },
      { id: 'l27-tile-14', color: 'yellow' },
      { id: 'l27-tile-15', color: 'grey' },
      { id: 'l27-tile-16', color: 'lime' },
      { id: 'l27-tile-17', color: 'pink' },
      { id: 'l27-tile-18', color: 'blue', number: 5 },
      { id: 'l27-tile-19', color: 'blue' },
      { id: 'l27-tile-20', color: 'red' },
      { id: 'l27-tile-21', color: 'yellow' },
      { id: 'l27-tile-22', color: 'cyan' },
      { id: 'l27-tile-23', color: 'lime' },
      { id: 'l27-tile-24', color: 'pink' },
      { id: 'l27-tile-25', color: 'red', number: 6 },
      { id: 'l27-tile-26', color: 'pink' },
      { id: 'l27-tile-27', color: 'grey' },
      { id: 'l27-tile-28', color: 'red' },
      { id: 'l27-tile-29', color: 'yellow' },
      { id: 'l27-tile-30', color: 'cyan' },
      { id: 'l27-tile-31', color: 'grey' },
      { id: 'l27-tile-32', color: 'blue' },
      { id: 'l27-tile-33', color: 'red' },
      { id: 'l27-tile-34', color: 'yellow' },
      { id: 'l27-tile-35', color: 'lime' },
      { id: 'l27-tile-36', color: 'yellow', number: 6 },
    ],
  },
  {
    id: 28,
    title: 'Level 28',
    gridSize: 6,
    initialTiles: [
      { id: 'l28-tile-1', color: 'grey' },
      { id: 'l28-tile-2', color: 'purple', number: 6 },
      { id: 'l28-tile-3', color: 'orange' },
      { id: 'l28-tile-4', color: 'green' },
      { id: 'l28-tile-5', color: 'cyan' },
      { id: 'l28-tile-6', color: 'pink' },
      { id: 'l28-tile-7', color: 'orange', number: 5 },
      { id: 'l28-tile-8', color: 'lime' },
      { id: 'l28-tile-9', color: 'purple' },
      { id: 'l28-tile-10', color: 'orange' },
      { id: 'l28-tile-11', color: 'green' },
      { id: 'l28-tile-12', color: 'green', number: 6 },
      { id: 'l28-tile-13', color: 'cyan' },
      { id: 'l28-tile-14', color: 'pink' },
      { id: 'l28-tile-15', color: 'lime' },
      { id: 'l28-tile-16', color: 'purple' },
      { id: 'l28-tile-17', color: 'grey' },
      { id: 'l28-tile-18', color: 'cyan' },
      { id: 'l28-tile-19', color: 'cyan', number: 6 },
      { id: 'l28-tile-20', color: 'green' },
      { id: 'l28-tile-21', color: 'pink' },
      { id: 'l28-tile-22', color: 'lime' },
      { id: 'l28-tile-23', color: 'purple' },
      { id: 'l28-tile-24', color: 'orange' },
      { id: 'l28-tile-25', color: 'green' },
      { id: 'l28-tile-26', color: 'cyan' },
      { id: 'l28-tile-27', color: 'purple' },
      { id: 'l28-tile-28', color: 'lime' },
      { id: 'l28-tile-29', color: 'pink' },
      { id: 'l28-tile-30', color: 'pink', number: 6 },
      { id: 'l28-tile-31', color: 'lime', number: 5 },
      { id: 'l28-tile-32', color: 'orange' },
      { id: 'l28-tile-33', color: 'green' },
      { id: 'l28-tile-34', color: 'cyan' },
      { id: 'l28-tile-35', color: 'pink' },
      { id: 'l28-tile-36', color: 'purple' },
    ],
  },
  {
    id: 29,
    title: 'Level 29',
    gridSize: 6,
    initialTiles: [
      { id: 'l29-tile-1', color: 'red', number: 6 },
      { id: 'l29-tile-2', color: 'blue' },
      { id: 'l29-tile-3', color: 'green' },
      { id: 'l29-tile-4', color: 'blue', number: 6 },
      { id: 'l29-tile-5', color: 'yellow' },
      { id: 'l29-tile-6', color: 'yellow', number: 5 },
      { id: 'l29-tile-7', color: 'cyan' },
      { id: 'l29-tile-8', color: 'purple' },
      { id: 'l29-tile-9', color: 'red' },
      { id: 'l29-tile-10', color: 'blue' },
      { id: 'l29-tile-11', color: 'green' },
      { id: 'l29-tile-12', color: 'yellow' },
      { id: 'l29-tile-13', color: 'purple' },
      { id: 'l29-tile-14', color: 'cyan' },
      { id: 'l29-tile-15', color: 'red' },
      { id: 'l29-tile-16', color: 'blue' },
      { id: 'l29-tile-17', color: 'green' },
      { id: 'l29-tile-18', color: 'grey' },
      { id: 'l29-tile-19', color: 'yellow' },
      { id: 'l29-tile-20', color: 'purple' },
      { id: 'l29-tile-21', color: 'grey' },
      { id: 'l29-tile-22', color: 'cyan' },
      { id: 'l29-tile-23', color: 'red' },
      { id: 'l29-tile-24', color: 'blue' },
      { id: 'l29-tile-25', color: 'green' },
      { id: 'l29-tile-26', color: 'yellow' },
      { id: 'l29-tile-27', color: 'purple' },
      { id: 'l29-tile-28', color: 'cyan' },
      { id: 'l29-tile-29', color: 'red' },
      { id: 'l29-tile-30', color: 'purple' },
      { id: 'l29-tile-31', color: 'green', number: 6 },
      { id: 'l29-tile-32', color: 'green' },
      { id: 'l29-tile-33', color: 'purple', number: 6 },
      { id: 'l29-tile-34', color: 'blue' },
      { id: 'l29-tile-35', color: 'red' },
      { id: 'l29-tile-36', color: 'cyan', number: 5 },
    ],
  },
  {
    id: 30,
    title: 'Level 30',
    gridSize: 6,
    initialTiles: [
      { id: 'l30-tile-1', color: 'grey' },
      { id: 'l30-tile-2', color: 'yellow' },
      { id: 'l30-tile-3', color: 'green' },
      { id: 'l30-tile-4', color: 'blue' },
      { id: 'l30-tile-5', color: 'orange' },
      { id: 'l30-tile-6', color: 'red', number: 6 },
      { id: 'l30-tile-7', color: 'yellow', number: 6 },
      { id: 'l30-tile-8', color: 'purple' },
      { id: 'l30-tile-9', color: 'red' },
      { id: 'l30-tile-10', color: 'green' },
      { id: 'l30-tile-11', color: 'blue' },
      { id: 'l30-tile-12', color: 'orange' },
      { id: 'l30-tile-13', color: 'green', number: 6 },
      { id: 'l30-tile-14', color: 'purple' },
      { id: 'l30-tile-15', color: 'yellow' },
      { id: 'l30-tile-16', color: 'red' },
      { id: 'l30-tile-17', color: 'blue' },
      { id: 'l30-tile-18', color: 'orange' },
      { id: 'l30-tile-19', color: 'purple' },
      { id: 'l30-tile-20', color: 'green' },
      { id: 'l30-tile-21', color: 'yellow' },
      { id: 'l30-tile-22', color: 'red' },
      { id: 'l30-tile-23', color: 'blue', number: 6 },
      { id: 'l30-tile-24', color: 'orange' },
      { id: 'l30-tile-25', color: 'orange', number: 6 },
      { id: 'l30-tile-26', color: 'blue' },
      { id: 'l30-tile-27', color: 'green' },
      { id: 'l30-tile-28', color: 'yellow' },
      { id: 'l30-tile-29', color: 'purple' },
      { id: 'l30-tile-30', color: 'red' },
      { id: 'l30-tile-31', color: 'purple', number: 5 },
      { id: 'l30-tile-32', color: 'red' },
      { id: 'l30-tile-33', color: 'orange' },
      { id: 'l30-tile-34', color: 'blue' },
      { id: 'l30-tile-35', color: 'green' },
      { id: 'l30-tile-36', color: 'yellow' },
    ],
  },
];

function getConnectedSameColorComponent(
  startIdx: number,
  tiles: Tile[],
  gridSize: number
): number[] {
  const targetColor = tiles[startIdx].color;
  const visited = new Set<number>();
  const queue: number[] = [startIdx];
  visited.add(startIdx);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const r = Math.floor(current / gridSize);
    const c = current % gridSize;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
        const neighborIdx = nr * gridSize + nc;
        if (!visited.has(neighborIdx) && tiles[neighborIdx].color === targetColor) {
          visited.add(neighborIdx);
          queue.push(neighborIdx);
        }
      }
    }
  }

  return Array.from(visited);
}

function TutorialHand() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 select-none">
      <div className="relative animate-finger-tap">
        {/* Tap Ripple Ring */}
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-white/90 bg-white/20 animate-tap-ripple pointer-events-none" />
        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full border-2 border-white animate-tap-arc pointer-events-none" />

        {/* Hand Icon matching Reference */}
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_6px_14px_rgba(0,0,0,0.65)]"
        >
          {/* Tap Arc over fingertip */}
          <path
            d="M 18,34 A 16,16 0 0,1 42,14"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-tap-arc"
          />
          {/* Hand Body */}
          <path
            d="M 32,22 C 32,15 41,15 41,22 L 41,46 C 44,43 50,43 52,47 C 55,44 61,44 63,48 C 66,46 72,48 73,53 C 74,58 73,66 70,74 C 66,84 57,93 45,94 C 34,95 24,88 20,80 L 14,68 C 11,63 14,57 19,56 C 24,55 28,59 30,64 L 32,68 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

interface TutorialGuidance {
  mainText: string;
  subText: string;
  fingerIndex: number | null;
}

function getTutorialGuidance(
  levelId: number,
  tiles: Tile[],
  selectedIndex: number | null,
  isLevelCompleted: boolean
): TutorialGuidance | null {
  if (levelId > 3) return null;

  // Level 1: Basic Movement
  if (levelId === 1) {
    if (isLevelCompleted) {
      return {
        mainText: 'LEVEL 1 COMPLETED!',
        subText: 'CONTINUOUS GROUP OF 2 FORMED',
        fingerIndex: null,
      };
    }
    if (selectedIndex === null) {
      return {
        mainText: 'TAP THE RED BLOCK',
        subText: 'SELECT A COLORED BLOCK',
        fingerIndex: 0,
      };
    }
    return {
      mainText: 'TAP AN EMPTY SPACE',
      subText: 'CONNECT 2 RED BLOCKS TOGETHER',
      fingerIndex: 1,
    };
  }

  // Level 2: Swapping Colored Blocks with Empty Blocks
  if (levelId === 2) {
    if (isLevelCompleted) {
      return {
        mainText: 'LEVEL 2 COMPLETED!',
        subText: 'EMPTY BLOCK SWAPPING MASTERED',
        fingerIndex: null,
      };
    }

    const connectedToAnchor = getConnectedSameColorComponent(8, tiles, 3);
    const connectedCount = connectedToAnchor.length;

    if (selectedIndex === null) {
      if (connectedCount === 1) {
        const firstMovableRed = tiles.findIndex((t) => t.color === 'red' && t.number === undefined);
        return {
          mainText: 'ONLY SWAP WITH EMPTY BLOCKS',
          subText: 'CANNOT DIRECTLY SWAP TWO COLORED BLOCKS',
          fingerIndex: firstMovableRed !== -1 ? firstMovableRed : 0,
        };
      } else {
        const unconnectedRed = tiles.findIndex(
          (t, i) => t.color === 'red' && t.number === undefined && !connectedToAnchor.includes(i)
        );
        return {
          mainText: 'SWAP NEXT RED BLOCK INTO EMPTY SPACE',
          subText: 'MANEUVER THROUGH GREY EMPTY BLOCKS',
          fingerIndex: unconnectedRed !== -1 ? unconnectedRed : 2,
        };
      }
    } else {
      // Red block selected, guide to empty grey space
      const targetEmptyIndex = tiles[5].color === 'grey' ? 5 : (tiles[7].color === 'grey' ? 7 : 4);
      return {
        mainText: 'TAP A GREY EMPTY BLOCK TO SWAP',
        subText: 'COLORED BLOCKS CAN ONLY MOVE INTO EMPTY SPACES',
        fingerIndex: targetEmptyIndex,
      };
    }
  }

  // Level 3: The Numbered Block & Goal of the Game
  if (levelId === 3) {
    if (isLevelCompleted) {
      return {
        mainText: 'LEVEL 3 COMPLETED!',
        subText: 'ALL GOALS MET! YOU ARE READY TO PLAY',
        fingerIndex: null,
      };
    }

    const yellowConnected = getConnectedSameColorComponent(0, tiles, 3).length >= 2;

    if (!yellowConnected) {
      if (selectedIndex === null) {
        const yellowMovable = tiles.findIndex((t) => t.color === 'yellow' && t.number === undefined);
        return {
          mainText: 'NUMBER [2] IS THE TARGET GROUP SIZE',
          subText: 'NUMBERED BLOCKS ARE FIXED ANCHORS — CONNECT 2 YELLOW',
          fingerIndex: yellowMovable !== -1 ? yellowMovable : 4,
        };
      } else if (tiles[selectedIndex].color === 'yellow') {
        const targetEmpty = tiles[1].color === 'grey' ? 1 : 3;
        return {
          mainText: 'CONNECT TO ANCHOR [2]',
          subText: 'GOAL: REACH EXACT NUMBER OF CONNECTED BLOCKS',
          fingerIndex: targetEmpty,
        };
      } else {
        return {
          mainText: 'SWAP INTO GREY EMPTY SPACE',
          subText: 'MOVE TO CONNECT WITH NUMBERED ANCHOR',
          fingerIndex: tiles.findIndex((t) => t.color === 'grey'),
        };
      }
    } else {
      // Yellow group is complete, now guide green group of 4
      const greenConnected = getConnectedSameColorComponent(8, tiles, 3);
      if (selectedIndex === null) {
        const unconnectedGreen = tiles.findIndex(
          (t, i) => t.color === 'green' && t.number === undefined && !greenConnected.includes(i)
        );
        return {
          mainText: 'NOW CONNECT 4 GREEN BLOCKS TO [4]',
          subText: 'GOAL: FORM CONTINUOUS ORTHOGONAL GROUPS',
          fingerIndex: unconnectedGreen !== -1 ? unconnectedGreen : 2,
        };
      } else {
        const emptySlot = tiles[7].color === 'grey' ? 7 : (tiles[4].color === 'grey' ? 4 : 5);
        return {
          mainText: 'SWAP TO COMPLETE GROUP OF 4',
          subText: 'ALL NUMBERED GROUPS MUST BE SATISFIED TO WIN',
          fingerIndex: emptySlot,
        };
      }
    }
  }

  return null;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenMode>('home');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const currentLevel = LEVELS[currentLevelIndex];

  const [unlockedLevelsMax, setUnlockedLevelsMax] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('grid_puzzle_unlocked_max');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 1 && val <= LEVELS.length) {
          return val;
        }
      }
    } catch (e) {
      // ignore
    }
    return 1;
  });

  const [tiles, setTiles] = useState<Tile[]>(currentLevel.initialTiles);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);
  const [hintToast, setHintToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setHintToast(message);
    setTimeout(() => {
      setHintToast((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const switchLevel = (levelIndex: number) => {
    setCurrentLevelIndex(levelIndex);
    setTiles(LEVELS[levelIndex].initialTiles);
    setSelectedIndex(null);
    setHintToast(null);
  };

  const handleStartPlay = () => {
    // Start at current level or highest unlocked level
    const targetIdx = Math.min(currentLevelIndex, unlockedLevelsMax - 1);
    switchLevel(targetIdx);
    setScreen('game');
  };

  const handleSelectLevel = (levelIdx: number) => {
    if (levelIdx + 1 <= unlockedLevelsMax) {
      switchLevel(levelIdx);
      setScreen('game');
    }
  };

  // Determine which tiles have changed boundaries based on continuous orthogonal connected components of matching color
  const changedBoundaryTileIds = new Set<string>();

  const numberedTiles = tiles
    .map((tile, idx) => ({ tile, idx }))
    .filter(({ tile }) => tile.number !== undefined);

  let allNumberedSatisfied = numberedTiles.length > 0;

  numberedTiles.forEach(({ tile, idx }) => {
    const targetSize = tile.number!;
    const connectedIndices = getConnectedSameColorComponent(
      idx,
      tiles,
      currentLevel.gridSize
    );

    if (connectedIndices.length >= targetSize) {
      connectedIndices.forEach((cIdx) => {
        changedBoundaryTileIds.add(tiles[cIdx].id);
      });
    } else {
      allNumberedSatisfied = false;
    }
  });

  const isLevelCompleted = allNumberedSatisfied && changedBoundaryTileIds.size > 0;
  const isTutorialLevel = currentLevel.id <= 3;
  const tutorialGuidance = getTutorialGuidance(
    currentLevel.id,
    tiles,
    selectedIndex,
    isLevelCompleted
  );

  // Automatically unlock next level upon completing the current level
  useEffect(() => {
    if (isLevelCompleted) {
      const nextLevelNum = currentLevel.id + 1;
      if (nextLevelNum > unlockedLevelsMax && nextLevelNum <= LEVELS.length) {
        setUnlockedLevelsMax(nextLevelNum);
        try {
          localStorage.setItem('grid_puzzle_unlocked_max', String(nextLevelNum));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isLevelCompleted, currentLevel.id, unlockedLevelsMax]);

  const handleTileClick = (index: number) => {
    // When level is completed, prevent interaction
    if (isLevelCompleted) {
      return;
    }

    const clickedTile = tiles[index];

    // Tiles with a number cannot be selected and cannot be swapped
    if (clickedTile.number !== undefined) {
      showToast('Numbered blocks are fixed anchors and cannot move!');
      return;
    }

    if (selectedIndex === null) {
      if (clickedTile.color !== 'grey') {
        setSelectedIndex(index);
      } else {
        showToast('Tap a colored block first to select it.');
      }
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    if (clickedTile.color !== 'grey') {
      setSelectedIndex(index);
      showToast('Selection changed! Colored blocks can only swap into grey empty spaces.');
      return;
    }

    // Swapping selected colored square with clicked grey square
    const nextTiles = [...tiles];
    const temp = nextTiles[selectedIndex];
    nextTiles[selectedIndex] = nextTiles[index];
    nextTiles[index] = temp;

    setTiles(nextTiles);
    setSelectedIndex(null);
  };

  const handleReset = () => {
    setTiles(currentLevel.initialTiles);
    setSelectedIndex(null);
    setHintToast(null);
  };

  const getTileBgClasses = (tile: Tile, isSelected: boolean, isDisabled: boolean) => {
    const isColored = tile.color !== 'grey';
    const hasNumber = tile.number !== undefined;

    if (isLevelCompleted) {
      switch (tile.color) {
        case 'red':
          return 'bg-[#EB5872] cursor-default shadow-xs';
        case 'yellow':
          return 'bg-[#FFCE54] cursor-default shadow-xs';
        case 'green':
          return 'bg-[#48CFAD] cursor-default shadow-xs';
        case 'blue':
          return 'bg-[#4FC1E9] cursor-default shadow-xs';
        case 'purple':
          return 'bg-[#7B79DB] cursor-default shadow-xs';
        case 'orange':
          return 'bg-[#FC6E51] cursor-default shadow-xs';
        case 'pink':
          return 'bg-[#EC87C0] cursor-default shadow-xs';
        case 'cyan':
          return 'bg-[#3BC2A5] cursor-default shadow-xs';
        case 'lime':
          return 'bg-[#A0D468] cursor-default shadow-xs';
        default:
          return 'bg-[#ECEEF1] cursor-default';
      }
    }

    if (hasNumber) {
      switch (tile.color) {
        case 'red':
          return 'bg-[#EB5872] cursor-not-allowed shadow-xs';
        case 'yellow':
          return 'bg-[#FFCE54] cursor-not-allowed shadow-xs';
        case 'green':
          return 'bg-[#48CFAD] cursor-not-allowed shadow-xs';
        case 'blue':
          return 'bg-[#4FC1E9] cursor-not-allowed shadow-xs';
        case 'purple':
          return 'bg-[#7B79DB] cursor-not-allowed shadow-xs';
        case 'orange':
          return 'bg-[#FC6E51] cursor-not-allowed shadow-xs';
        case 'pink':
          return 'bg-[#EC87C0] cursor-not-allowed shadow-xs';
        case 'cyan':
          return 'bg-[#3BC2A5] cursor-not-allowed shadow-xs';
        case 'lime':
          return 'bg-[#A0D468] cursor-not-allowed shadow-xs';
        default:
          return 'bg-[#ECEEF1] cursor-not-allowed';
      }
    }

    if (isColored) {
      if (isSelected) {
        switch (tile.color) {
          case 'red':
            return 'bg-[#EB5872] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'yellow':
            return 'bg-[#FFCE54] brightness-110 ring-3 ring-inset ring-slate-900/30 shadow-md cursor-pointer z-10';
          case 'green':
            return 'bg-[#48CFAD] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'blue':
            return 'bg-[#4FC1E9] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'purple':
            return 'bg-[#7B79DB] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'orange':
            return 'bg-[#FC6E51] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'pink':
            return 'bg-[#EC87C0] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'cyan':
            return 'bg-[#3BC2A5] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'lime':
            return 'bg-[#A0D468] brightness-110 ring-3 ring-inset ring-slate-900/30 shadow-md cursor-pointer z-10';
          default:
            return 'bg-[#ECEEF1] cursor-pointer';
        }
      }
      switch (tile.color) {
        case 'red':
          return 'bg-[#EB5872] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'yellow':
          return 'bg-[#FFCE54] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'green':
          return 'bg-[#48CFAD] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'blue':
          return 'bg-[#4FC1E9] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'purple':
          return 'bg-[#7B79DB] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'orange':
          return 'bg-[#FC6E51] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'pink':
          return 'bg-[#EC87C0] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'cyan':
          return 'bg-[#3BC2A5] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'lime':
          return 'bg-[#A0D468] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        default:
          return 'bg-[#ECEEF1] cursor-pointer';
      }
    }

    // Grey empty tile in 1010! style
    if (selectedIndex !== null) {
      return 'bg-[#E4E7ED] hover:bg-[#D5D9E2] active:bg-[#CBD0DC] cursor-pointer transition-all duration-150';
    }
    return 'bg-[#ECEEF1] hover:bg-[#E4E7ED] cursor-pointer transition-all duration-150';
  };

  const getTileBorderClass = (color: TileColor, hasChangedBoundary: boolean) => {
    if (!hasChangedBoundary) {
      return 'border-transparent';
    }
    switch (color) {
      case 'red':
        return 'border-[#FF99AA] ring-2 ring-inset ring-white/80';
      case 'yellow':
        return 'border-[#FFE699] ring-2 ring-inset ring-white/80';
      case 'green':
        return 'border-[#8CEFD6] ring-2 ring-inset ring-white/80';
      case 'blue':
        return 'border-[#9CE4FD] ring-2 ring-inset ring-white/80';
      case 'purple':
        return 'border-[#BDBBF6] ring-2 ring-inset ring-white/80';
      case 'orange':
        return 'border-[#FFB09C] ring-2 ring-inset ring-white/80';
      case 'pink':
        return 'border-[#F8BADE] ring-2 ring-inset ring-white/80';
      case 'cyan':
        return 'border-[#7DE5D0] ring-2 ring-inset ring-white/80';
      case 'lime':
        return 'border-[#C8EAA4] ring-2 ring-inset ring-white/80';
      default:
        return 'border-white ring-2 ring-inset ring-white/80';
    }
  };

  const getTileNumberTextClass = (color: TileColor) => {
    switch (color) {
      case 'yellow':
      case 'lime':
        return 'text-slate-900 drop-shadow-xs font-black';
      case 'red':
      case 'green':
      case 'blue':
      case 'purple':
      case 'orange':
      case 'pink':
      case 'cyan':
        return 'text-white drop-shadow-sm font-black';
      default:
        return 'text-slate-700 font-bold';
    }
  };

  const getNumberSizeClass = (gridSize: number) => {
    if (gridSize === 2) return 'text-4xl sm:text-5xl font-black';
    if (gridSize === 3) return 'text-3xl sm:text-4xl font-black';
    if (gridSize === 4) return 'text-2xl sm:text-3xl font-black';
    if (gridSize === 5) return 'text-xl sm:text-2xl font-black';
    return 'text-lg sm:text-xl font-black';
  };

  const getTileCornerRadius = (gridSize: number) => {
    if (gridSize === 2) return 'rounded-2xl';
    if (gridSize === 3) return 'rounded-xl';
    if (gridSize === 4) return 'rounded-lg';
    if (gridSize === 5) return 'rounded-md';
    return 'rounded-md';
  };

  return (
    <div
      id="app-root"
      className="min-h-screen w-full bg-[#FFFFFF] flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 font-sans select-none overflow-x-hidden touch-manipulation"
    >
      {/* Centered App Container */}
      <div className="w-full max-w-[min(92vw,72vh,420px)] flex flex-col items-center justify-between flex-1 min-h-[92vh] py-2 sm:py-4">
        
        {/* Top Header Bar: Back Button (Left), Level Title (Middle), Reset Button (Right) */}
        <header id="app-top-bar" className="w-full flex items-center justify-between px-1 pt-1 pb-2">
          {/* Back button on top left */}
          <button
            type="button"
            id="prev-level-button"
            disabled={currentLevelIndex === 0}
            onClick={() => currentLevelIndex > 0 && switchLevel(currentLevelIndex - 1)}
            aria-label="Previous Level"
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all ${
              currentLevelIndex > 0
                ? 'bg-[#94A3B8] hover:bg-[#64748B] text-white shadow-xs cursor-pointer active:scale-95'
                : 'bg-[#CBD5E1]/50 text-white/40 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>

          {/* Level Number in middle */}
          <h1 id="level-title-display" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            {currentLevel.title}
          </h1>

          {/* Reset Button on top right */}
          <button
            type="button"
            id="reset-level-header-button"
            onClick={handleReset}
            aria-label="Reset Level"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#94A3B8] hover:bg-[#64748B] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>
        </header>

        {/* Middle Section: Floating Toast, Square Grid, and Middle-Bottom Instruction Text */}
        <main className="flex flex-col items-center justify-center gap-6 sm:gap-8 w-full my-auto">
          {/* Floating Toast Notification */}
          {hintToast && (
            <div
              id="tutorial-hint-toast"
              className="flex items-center gap-2 px-4 py-1.5 bg-slate-900/95 text-white text-xs font-medium rounded-full shadow-lg border border-slate-700/50 animate-in fade-in slide-in-from-top-2 w-fit mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFCE54] shrink-0" />
              <span>{hintToast}</span>
            </div>
          )}

          {/* 1010! Style Responsive Square Grid */}
          <div
            id="board-frame"
            className={`aspect-square flex items-center justify-center shrink-0 mx-auto ${
              currentLevel.gridSize === 2
                ? 'w-[62%] max-w-[220px] sm:max-w-[240px]'
                : currentLevel.gridSize === 3
                ? 'w-[85%] max-w-[310px] sm:max-w-[330px]'
                : 'w-full max-w-[360px] sm:max-w-[380px]'
            }`}
          >
            <div
              id="square-grid"
              className={`grid w-full h-full aspect-square relative ${
                currentLevel.gridSize === 2
                  ? 'grid-cols-2 gap-3 sm:gap-4'
                  : currentLevel.gridSize === 3
                  ? 'grid-cols-3 gap-2.5 sm:gap-3'
                  : currentLevel.gridSize === 4
                  ? 'grid-cols-4 gap-1.5 sm:gap-2.5'
                  : currentLevel.gridSize === 5
                  ? 'grid-cols-5 gap-1.5 sm:gap-2'
                  : 'grid-cols-6 gap-1 sm:gap-1.5'
              }`}
            >
              {tiles.map((tile, index) => {
                const isSelected = !isLevelCompleted && selectedIndex === index;
                const hasNumber = tile.number !== undefined;
                const hasChangedBoundary = changedBoundaryTileIds.has(tile.id);
                const isDisabled = isLevelCompleted || hasNumber;

                const showTutorialFinger =
                  tutorialGuidance !== null && tutorialGuidance.fingerIndex === index;

                return (
                  <button
                    type="button"
                    key={tile.id}
                    id={`grid-square-${tile.id}`}
                    disabled={isDisabled}
                    onClick={() => handleTileClick(index)}
                    aria-label={`${tile.color} square${
                      hasNumber ? ` with number ${tile.number}` : ''
                    } at position ${index + 1}${isSelected ? ', selected' : ''}${
                      hasChangedBoundary ? ', matching neighbor boundary active' : ''
                    }`}
                    className={`relative w-full h-full ${getTileCornerRadius(
                      currentLevel.gridSize
                    )} outline-none box-border ${
                      hasChangedBoundary ? 'border-2 sm:border-3' : 'border-0'
                    } ${getTileBorderClass(
                      tile.color,
                      hasChangedBoundary
                    )} ${getTileBgClasses(tile, isSelected, isDisabled)} ${
                      showTutorialFinger ? 'ring-3 ring-inset ring-[#FA8231] shadow-md' : ''
                    }`}
                  >
                    {tile.number !== undefined && (
                      <span
                        id={`tile-number-${tile.number}`}
                        className={`absolute inset-0 flex items-center justify-center select-none leading-none pointer-events-none ${getNumberSizeClass(
                          currentLevel.gridSize
                        )} ${getTileNumberTextClass(tile.color)}`}
                      >
                        {tile.number}
                      </span>
                    )}

                    {/* Animated Guiding Finger for Active Tutorial Step */}
                    {showTutorialFinger && <TutorialHand />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instruction Text in the middle bottom of the grid */}
          {tutorialGuidance ? (
            <div
              id="tutorial-bottom-instruction"
              className="w-full flex flex-col items-center justify-center text-center px-2 select-none gap-1"
            >
              <p className="text-base sm:text-xl font-normal tracking-[0.2em] text-[#1E293B] uppercase">
                {tutorialGuidance.mainText}
              </p>
              <p className="text-xs sm:text-sm font-light tracking-[0.14em] text-[#64748B] uppercase">
                {tutorialGuidance.subText}
              </p>
            </div>
          ) : isLevelCompleted ? (
            <div
              id="level-completed-status-text"
              className="w-full flex flex-col items-center justify-center text-center px-2 select-none gap-1 animate-in fade-in"
            >
              <p className="text-base sm:text-xl font-medium tracking-[0.2em] text-[#10B981] uppercase flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span>LEVEL COMPLETED!</span>
              </p>
              <p className="text-xs sm:text-sm font-light tracking-[0.14em] text-[#64748B] uppercase">
                TAP NEXT TO ADVANCE
              </p>
            </div>
          ) : null}
        </main>

        {/* Bottom Section: Replay & Next Buttons on Completion, or How to Play on Bottom Right */}
        <footer id="app-bottom-bar" className="w-full flex items-center justify-between px-1 pt-4 pb-2 min-h-[64px]">
          {isLevelCompleted ? (
            <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-bottom-2">
              <button
                type="button"
                id="replay-level-button"
                onClick={handleReset}
                className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#0F172A] text-base sm:text-lg font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                Replay
              </button>

              {currentLevelIndex < LEVELS.length - 1 ? (
                <button
                  type="button"
                  id="next-level-button"
                  onClick={() => switchLevel(currentLevelIndex + 1)}
                  className="px-9 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-[#475569] hover:bg-[#334155] text-white text-base sm:text-lg font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  id="restart-from-level-1-button"
                  onClick={() => switchLevel(0)}
                  className="px-9 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-[#FA8231] hover:bg-[#E67325] text-white text-base sm:text-lg font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Play L1
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-end w-full">
              <button
                type="button"
                id="how-to-play-toggle-button"
                onClick={() => setShowHowToPlayModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-[#ECEEF1] hover:bg-[#DFE2E8] active:scale-95 cursor-pointer transition-all shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>How to Play</span>
              </button>
            </div>
          )}
        </footer>
      </div>

      {/* How to Play Rules Modal in 1010! Aesthetic */}
      {showHowToPlayModal && (
        <div
          id="how-to-play-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FA8231] flex items-center justify-center text-white font-black text-xs shadow-xs">
                  10
                </div>
                <h2 className="text-base font-black text-slate-800">How to Play & Mechanics</h2>
              </div>
              <button
                type="button"
                id="close-how-to-play-modal-button"
                onClick={() => setShowHowToPlayModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-sm text-slate-600">
              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[#FA8231] text-white text-[10px] flex items-center justify-center font-black">1</span>
                  The Core Goal
                </span>
                <p className="text-xs text-slate-600">
                  Form continuous groups of matching colored blocks. The total connected count in each color group must exactly equal the number displayed on that color's stationary anchor block.
                </p>
              </div>

              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[#FA8231] text-white text-[10px] flex items-center justify-center font-black">2</span>
                  Stationary Anchor Blocks
                </span>
                <p className="text-xs text-slate-600">
                  Blocks with numbers (e.g. <strong>[2]</strong>, <strong>[4]</strong>, <strong>[6]</strong>) are fixed anchors. They <strong>cannot move or swap</strong>. All movable blocks of matching color must connect to them.
                </p>
              </div>

              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[#FA8231] text-white text-[10px] flex items-center justify-center font-black">3</span>
                  Swapping into Empty Blocks
                </span>
                <p className="text-xs text-slate-600">
                  Tap any colored block to select it, then tap any <strong>grey empty space</strong> to swap the two tiles. Colored blocks can only move into empty spaces.
                </p>
              </div>

              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[#FA8231] text-white text-[10px] flex items-center justify-center font-black">4</span>
                  Orthogonal Adjacency
                </span>
                <p className="text-xs text-slate-600">
                  Blocks only connect <strong>horizontally or vertically</strong>. When a group meets its target count, a vibrant border outline illuminates around the cluster!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHowToPlayModal(false)}
              className="w-full py-3 text-xs font-black text-white bg-[#FA8231] hover:bg-[#E67325] rounded-2xl cursor-pointer transition-all shadow-xs active:scale-98"
            >
              GOT IT, LET'S PLAY!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

