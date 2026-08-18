/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

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
      { id: 'l16-tile-7', color: 'grey' },
      { id: 'l16-tile-8', color: 'yellow' },
      { id: 'l16-tile-9', color: 'grey' },
      { id: 'l16-tile-10', color: 'grey' },
      { id: 'l16-tile-11', color: 'red' },
      { id: 'l16-tile-12', color: 'grey' },
      { id: 'l16-tile-13', color: 'yellow', number: 3 },
      { id: 'l16-tile-14', color: 'grey' },
      { id: 'l16-tile-15', color: 'blue' },
      { id: 'l16-tile-16', color: 'grey' },
      { id: 'l16-tile-17', color: 'grey' },
      { id: 'l16-tile-18', color: 'yellow' },
      { id: 'l16-tile-19', color: 'grey' },
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
      { id: 'l17-tile-8', color: 'grey' },
      { id: 'l17-tile-9', color: 'purple' },
      { id: 'l17-tile-10', color: 'grey' },
      { id: 'l17-tile-11', color: 'lime', number: 4 },
      { id: 'l17-tile-12', color: 'grey' },
      { id: 'l17-tile-13', color: 'cyan' },
      { id: 'l17-tile-14', color: 'grey' },
      { id: 'l17-tile-15', color: 'cyan' },
      { id: 'l17-tile-16', color: 'grey' },
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

export default function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const currentLevel = LEVELS[currentLevelIndex];

  const [tiles, setTiles] = useState<Tile[]>(currentLevel.initialTiles);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const switchLevel = (levelIndex: number) => {
    setCurrentLevelIndex(levelIndex);
    setTiles(LEVELS[levelIndex].initialTiles);
    setSelectedIndex(null);
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

  const handleTileClick = (index: number) => {
    // When level is completed or tile has a number, prevent selection and swapping
    if (isLevelCompleted) {
      return;
    }

    const clickedTile = tiles[index];

    // Tiles with a number cannot be selected and cannot be swapped
    if (clickedTile.number !== undefined) {
      return;
    }

    if (selectedIndex === null) {
      if (clickedTile.color !== 'grey') {
        setSelectedIndex(index);
      }
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    if (clickedTile.color !== 'grey') {
      setSelectedIndex(index);
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
  };

  const getTileBgClasses = (tile: Tile, isSelected: boolean, isDisabled: boolean) => {
    const isColored = tile.color !== 'grey';
    const hasNumber = tile.number !== undefined;

    if (isLevelCompleted) {
      switch (tile.color) {
        case 'red':
          return 'bg-red-500 cursor-default';
        case 'yellow':
          return 'bg-amber-400 cursor-default';
        case 'green':
          return 'bg-emerald-500 cursor-default';
        case 'blue':
          return 'bg-sky-500 cursor-default';
        case 'purple':
          return 'bg-purple-500 cursor-default';
        case 'orange':
          return 'bg-orange-500 cursor-default';
        case 'pink':
          return 'bg-pink-500 cursor-default';
        case 'cyan':
          return 'bg-cyan-400 cursor-default';
        case 'lime':
          return 'bg-lime-500 cursor-default';
        default:
          return 'bg-neutral-200 cursor-default';
      }
    }

    if (hasNumber) {
      switch (tile.color) {
        case 'red':
          return 'bg-red-500 cursor-not-allowed';
        case 'yellow':
          return 'bg-amber-400 cursor-not-allowed';
        case 'green':
          return 'bg-emerald-500 cursor-not-allowed';
        case 'blue':
          return 'bg-sky-500 cursor-not-allowed';
        case 'purple':
          return 'bg-purple-500 cursor-not-allowed';
        case 'orange':
          return 'bg-orange-500 cursor-not-allowed';
        case 'pink':
          return 'bg-pink-500 cursor-not-allowed';
        case 'cyan':
          return 'bg-cyan-400 cursor-not-allowed';
        case 'lime':
          return 'bg-lime-500 cursor-not-allowed';
        default:
          return 'bg-neutral-200 cursor-not-allowed';
      }
    }

    if (isColored) {
      if (isSelected) {
        switch (tile.color) {
          case 'red':
            return 'bg-red-500 ring-4 ring-red-300 ring-offset-2 cursor-pointer';
          case 'yellow':
            return 'bg-amber-400 ring-4 ring-amber-200 ring-offset-2 cursor-pointer';
          case 'green':
            return 'bg-emerald-500 ring-4 ring-emerald-300 ring-offset-2 cursor-pointer';
          case 'blue':
            return 'bg-sky-500 ring-4 ring-sky-300 ring-offset-2 cursor-pointer';
          case 'purple':
            return 'bg-purple-500 ring-4 ring-purple-300 ring-offset-2 cursor-pointer';
          case 'orange':
            return 'bg-orange-500 ring-4 ring-orange-300 ring-offset-2 cursor-pointer';
          case 'pink':
            return 'bg-pink-500 ring-4 ring-pink-300 ring-offset-2 cursor-pointer';
          case 'cyan':
            return 'bg-cyan-400 ring-4 ring-cyan-200 ring-offset-2 cursor-pointer';
          case 'lime':
            return 'bg-lime-500 ring-4 ring-lime-300 ring-offset-2 cursor-pointer';
          default:
            return 'bg-neutral-200 cursor-pointer';
        }
      }
      switch (tile.color) {
        case 'red':
          return 'bg-red-500 hover:brightness-95 cursor-pointer';
        case 'yellow':
          return 'bg-amber-400 hover:brightness-95 cursor-pointer';
        case 'green':
          return 'bg-emerald-500 hover:brightness-95 cursor-pointer';
        case 'blue':
          return 'bg-sky-500 hover:brightness-95 cursor-pointer';
        case 'purple':
          return 'bg-purple-500 hover:brightness-95 cursor-pointer';
        case 'orange':
          return 'bg-orange-500 hover:brightness-95 cursor-pointer';
        case 'pink':
          return 'bg-pink-500 hover:brightness-95 cursor-pointer';
        case 'cyan':
          return 'bg-cyan-400 hover:brightness-95 cursor-pointer';
        case 'lime':
          return 'bg-lime-500 hover:brightness-95 cursor-pointer';
        default:
          return 'bg-neutral-200 cursor-pointer';
      }
    }

    // Grey tile
    if (selectedIndex !== null) {
      return 'bg-neutral-200 hover:bg-neutral-300 cursor-pointer';
    }
    return 'bg-neutral-200 cursor-pointer';
  };

  const getTileBorderClass = (color: TileColor, hasChangedBoundary: boolean) => {
    if (!hasChangedBoundary) {
      return 'border-transparent';
    }
    switch (color) {
      case 'red':
        return 'border-red-300';
      case 'yellow':
        return 'border-amber-200';
      case 'green':
        return 'border-emerald-300';
      case 'blue':
        return 'border-sky-300';
      case 'purple':
        return 'border-purple-300';
      case 'orange':
        return 'border-orange-300';
      case 'pink':
        return 'border-pink-300';
      case 'cyan':
        return 'border-cyan-200';
      case 'lime':
        return 'border-lime-300';
      default:
        return 'border-neutral-300';
    }
  };

  const getTileNumberTextClass = (color: TileColor) => {
    switch (color) {
      case 'yellow':
      case 'cyan':
      case 'lime':
        return 'text-neutral-900';
      case 'red':
      case 'green':
      case 'blue':
      case 'purple':
      case 'orange':
      case 'pink':
        return 'text-white';
      default:
        return 'text-neutral-700';
    }
  };

  return (
    <div
      id="app-root"
      className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 gap-6"
    >
      <div id="level-header" className="flex flex-col items-center gap-3">
        <div id="level-selector-nav" className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl">
          {LEVELS.map((level, idx) => {
            const isActive = currentLevelIndex === idx;
            return (
              <button
                key={level.id}
                type="button"
                id={`select-level-${level.id}-button`}
                onClick={() => switchLevel(idx)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Level {level.id}
              </button>
            );
          })}
        </div>
        <h1
          id="level-title"
          className="text-xl font-bold text-neutral-900 tracking-tight"
        >
          {currentLevel.title}
        </h1>
      </div>

      <div
        id="square-grid"
        className={`grid w-full aspect-square ${
          currentLevel.gridSize === 2
            ? 'grid-cols-2 max-w-xs gap-3.5'
            : currentLevel.gridSize === 3
            ? 'grid-cols-3 max-w-sm gap-3'
            : currentLevel.gridSize === 4
            ? 'grid-cols-4 max-w-md gap-2.5'
            : 'grid-cols-5 max-w-lg gap-2'
        }`}
      >
        {tiles.map((tile, index) => {
          const isSelected = !isLevelCompleted && selectedIndex === index;
          const hasNumber = tile.number !== undefined;
          const hasChangedBoundary = changedBoundaryTileIds.has(tile.id);
          const isDisabled = isLevelCompleted || hasNumber;

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
              className={`relative w-full h-full rounded-lg outline-none box-border border-4 transition-colors ${getTileBorderClass(
                tile.color,
                hasChangedBoundary
              )} ${getTileBgClasses(tile, isSelected, isDisabled)}`}
            >
              {tile.number !== undefined && (
                <span
                  id={`tile-number-${tile.number}`}
                  className={`absolute top-2 right-2.5 text-xs font-semibold select-none leading-none pointer-events-none ${getTileNumberTextClass(
                    tile.color
                  )}`}
                >
                  {tile.number}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLevelCompleted && (
        <div
          id="level-completed-banner"
          className="flex flex-col items-center gap-3 p-4 bg-neutral-100 rounded-xl border border-neutral-200 w-full max-w-xs text-center"
        >
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{currentLevel.title} Completed!</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="reset-level-button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg border border-neutral-300 shadow-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Level</span>
            </button>

            {currentLevelIndex < LEVELS.length - 1 ? (
              <button
                type="button"
                id="next-level-button"
                onClick={() => switchLevel(currentLevelIndex + 1)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <span>Next Level</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                id="restart-from-level-1-button"
                onClick={() => switchLevel(0)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <span>Play Level 1</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

