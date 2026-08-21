/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type CSSProperties } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  X,
  Sparkles,
  Undo2,
  Lock,
  Play,
  Grid,
  Film,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

type TileColor = 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan' | 'lime' | 'indigo' | 'amber' | 'charcoal' | 'joker' | 'grey';

interface Tile {
  id: string;
  color: TileColor;
  number?: number;
  isJoker?: boolean;
  allowedColors?: TileColor[];
}

interface LevelConfig {
  id: number;
  title: string;
  gridSize: number;
  initialTiles: Tile[];
  maxMoves?: number;
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
      { id: 'l15-tile-1', color: 'indigo', number: 4 },
      { id: 'l15-tile-2', color: 'grey' },
      { id: 'l15-tile-3', color: 'orange' },
      { id: 'l15-tile-4', color: 'grey' },
      { id: 'l15-tile-5', color: 'green', number: 4 },
      { id: 'l15-tile-6', color: 'grey' },
      { id: 'l15-tile-7', color: 'indigo' },
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
      { id: 'l15-tile-19', color: 'indigo' },
      { id: 'l15-tile-20', color: 'grey' },
      { id: 'l15-tile-21', color: 'orange' },
      { id: 'l15-tile-22', color: 'grey' },
      { id: 'l15-tile-23', color: 'green' },
      { id: 'l15-tile-24', color: 'grey' },
      { id: 'l15-tile-25', color: 'indigo' },
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
      { id: 'l20-tile-1', color: 'indigo', number: 5 },
      { id: 'l20-tile-2', color: 'green' },
      { id: 'l20-tile-3', color: 'orange' },
      { id: 'l20-tile-4', color: 'blue' },
      { id: 'l20-tile-5', color: 'green', number: 5 },
      { id: 'l20-tile-6', color: 'indigo' },
      { id: 'l20-tile-7', color: 'grey' },
      { id: 'l20-tile-8', color: 'indigo' },
      { id: 'l20-tile-9', color: 'grey' },
      { id: 'l20-tile-10', color: 'orange' },
      { id: 'l20-tile-11', color: 'blue' },
      { id: 'l20-tile-12', color: 'orange' },
      { id: 'l20-tile-13', color: 'grey' },
      { id: 'l20-tile-14', color: 'green' },
      { id: 'l20-tile-15', color: 'blue' },
      { id: 'l20-tile-16', color: 'indigo' },
      { id: 'l20-tile-17', color: 'grey' },
      { id: 'l20-tile-18', color: 'blue' },
      { id: 'l20-tile-19', color: 'grey' },
      { id: 'l20-tile-20', color: 'green' },
      { id: 'l20-tile-21', color: 'orange', number: 5 },
      { id: 'l20-tile-22', color: 'green' },
      { id: 'l20-tile-23', color: 'indigo' },
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
      { id: 'l25-tile-4', color: 'amber' },
      { id: 'l25-tile-5', color: 'yellow' },
      { id: 'l25-tile-6', color: 'indigo', number: 6 },
      { id: 'l25-tile-7', color: 'indigo' },
      { id: 'l25-tile-8', color: 'grey' },
      { id: 'l25-tile-9', color: 'red' },
      { id: 'l25-tile-10', color: 'green' },
      { id: 'l25-tile-11', color: 'grey' },
      { id: 'l25-tile-12', color: 'orange' },
      { id: 'l25-tile-13', color: 'yellow' },
      { id: 'l25-tile-14', color: 'amber' },
      { id: 'l25-tile-15', color: 'amber', number: 5 },
      { id: 'l25-tile-16', color: 'indigo' },
      { id: 'l25-tile-17', color: 'red' },
      { id: 'l25-tile-18', color: 'green' },
      { id: 'l25-tile-19', color: 'orange' },
      { id: 'l25-tile-20', color: 'red' },
      { id: 'l25-tile-21', color: 'indigo' },
      { id: 'l25-tile-22', color: 'yellow', number: 4 },
      { id: 'l25-tile-23', color: 'grey' },
      { id: 'l25-tile-24', color: 'amber' },
      { id: 'l25-tile-25', color: 'green' },
      { id: 'l25-tile-26', color: 'grey' },
      { id: 'l25-tile-27', color: 'orange' },
      { id: 'l25-tile-28', color: 'indigo' },
      { id: 'l25-tile-29', color: 'amber' },
      { id: 'l25-tile-30', color: 'yellow' },
      { id: 'l25-tile-31', color: 'green', number: 6 },
      { id: 'l25-tile-32', color: 'red' },
      { id: 'l25-tile-33', color: 'indigo' },
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
      { id: 'l28-tile-2', color: 'amber', number: 6 },
      { id: 'l28-tile-3', color: 'orange' },
      { id: 'l28-tile-4', color: 'green' },
      { id: 'l28-tile-5', color: 'indigo' },
      { id: 'l28-tile-6', color: 'pink' },
      { id: 'l28-tile-7', color: 'orange', number: 5 },
      { id: 'l28-tile-8', color: 'lime' },
      { id: 'l28-tile-9', color: 'amber' },
      { id: 'l28-tile-10', color: 'orange' },
      { id: 'l28-tile-11', color: 'green' },
      { id: 'l28-tile-12', color: 'green', number: 6 },
      { id: 'l28-tile-13', color: 'indigo' },
      { id: 'l28-tile-14', color: 'pink' },
      { id: 'l28-tile-15', color: 'lime' },
      { id: 'l28-tile-16', color: 'amber' },
      { id: 'l28-tile-17', color: 'grey' },
      { id: 'l28-tile-18', color: 'indigo' },
      { id: 'l28-tile-19', color: 'indigo', number: 6 },
      { id: 'l28-tile-20', color: 'green' },
      { id: 'l28-tile-21', color: 'pink' },
      { id: 'l28-tile-22', color: 'lime' },
      { id: 'l28-tile-23', color: 'amber' },
      { id: 'l28-tile-24', color: 'orange' },
      { id: 'l28-tile-25', color: 'green' },
      { id: 'l28-tile-26', color: 'indigo' },
      { id: 'l28-tile-27', color: 'amber' },
      { id: 'l28-tile-28', color: 'lime' },
      { id: 'l28-tile-29', color: 'pink' },
      { id: 'l28-tile-30', color: 'pink', number: 6 },
      { id: 'l28-tile-31', color: 'lime', number: 5 },
      { id: 'l28-tile-32', color: 'orange' },
      { id: 'l28-tile-33', color: 'green' },
      { id: 'l28-tile-34', color: 'indigo' },
      { id: 'l28-tile-35', color: 'pink' },
      { id: 'l28-tile-36', color: 'amber' },
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
      { id: 'l29-tile-7', color: 'indigo' },
      { id: 'l29-tile-8', color: 'amber' },
      { id: 'l29-tile-9', color: 'red' },
      { id: 'l29-tile-10', color: 'blue' },
      { id: 'l29-tile-11', color: 'green' },
      { id: 'l29-tile-12', color: 'yellow' },
      { id: 'l29-tile-13', color: 'amber' },
      { id: 'l29-tile-14', color: 'indigo' },
      { id: 'l29-tile-15', color: 'red' },
      { id: 'l29-tile-16', color: 'blue' },
      { id: 'l29-tile-17', color: 'green' },
      { id: 'l29-tile-18', color: 'grey' },
      { id: 'l29-tile-19', color: 'yellow' },
      { id: 'l29-tile-20', color: 'amber' },
      { id: 'l29-tile-21', color: 'grey' },
      { id: 'l29-tile-22', color: 'indigo' },
      { id: 'l29-tile-23', color: 'red' },
      { id: 'l29-tile-24', color: 'blue' },
      { id: 'l29-tile-25', color: 'green' },
      { id: 'l29-tile-26', color: 'yellow' },
      { id: 'l29-tile-27', color: 'amber' },
      { id: 'l29-tile-28', color: 'indigo' },
      { id: 'l29-tile-29', color: 'red' },
      { id: 'l29-tile-30', color: 'amber' },
      { id: 'l29-tile-31', color: 'green', number: 6 },
      { id: 'l29-tile-32', color: 'green' },
      { id: 'l29-tile-33', color: 'amber', number: 6 },
      { id: 'l29-tile-34', color: 'blue' },
      { id: 'l29-tile-35', color: 'red' },
      { id: 'l29-tile-36', color: 'indigo', number: 5 },
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
  {
    id: 31,
    title: 'Level 31',
    gridSize: 4,
    initialTiles: [
      { id: 'l31-tile-1', color: 'red', number: 3 },
      { id: 'l31-tile-2', color: 'red' },
      { id: 'l31-tile-3', color: 'grey' },
      { id: 'l31-tile-4', color: 'grey' },
      { id: 'l31-tile-5', color: 'grey' },
      { id: 'l31-tile-6', color: 'grey' },
      { id: 'l31-tile-7', color: 'grey' },
      { id: 'l31-tile-8', color: 'grey' },
      { id: 'l31-tile-9', color: 'green' },
      { id: 'l31-tile-10', color: 'grey' },
      { id: 'l31-tile-11', color: 'grey' },
      { id: 'l31-tile-12', color: 'joker', isJoker: true },
      { id: 'l31-tile-13', color: 'green', number: 3 },
      { id: 'l31-tile-14', color: 'grey' },
      { id: 'l31-tile-15', color: 'grey' },
      { id: 'l31-tile-16', color: 'joker', isJoker: true },
    ],
  },
  {
    id: 32,
    title: 'Level 32',
    gridSize: 4,
    initialTiles: [
      { id: 'l32-tile-1', color: 'blue', number: 3 },
      { id: 'l32-tile-2', color: 'blue' },
      { id: 'l32-tile-3', color: 'grey' },
      { id: 'l32-tile-4', color: 'joker', isJoker: true },
      { id: 'l32-tile-5', color: 'grey' },
      { id: 'l32-tile-6', color: 'grey' },
      { id: 'l32-tile-7', color: 'grey' },
      { id: 'l32-tile-8', color: 'joker', isJoker: true },
      { id: 'l32-tile-9', color: 'grey' },
      { id: 'l32-tile-10', color: 'grey' },
      { id: 'l32-tile-11', color: 'grey' },
      { id: 'l32-tile-12', color: 'grey' },
      { id: 'l32-tile-13', color: 'grey' },
      { id: 'l32-tile-14', color: 'grey' },
      { id: 'l32-tile-15', color: 'yellow' },
      { id: 'l32-tile-16', color: 'yellow', number: 3 },
    ],
  },
  {
    id: 33,
    title: 'Level 33',
    gridSize: 4,
    initialTiles: [
      { id: 'l33-tile-1', color: 'red', number: 2 },
      { id: 'l33-tile-2', color: 'grey' },
      { id: 'l33-tile-3', color: 'grey' },
      { id: 'l33-tile-4', color: 'green', number: 3 },
      { id: 'l33-tile-5', color: 'grey' },
      { id: 'l33-tile-6', color: 'joker', isJoker: true },
      { id: 'l33-tile-7', color: 'joker', isJoker: true },
      { id: 'l33-tile-8', color: 'green' },
      { id: 'l33-tile-9', color: 'purple', number: 3 },
      { id: 'l33-tile-10', color: 'grey' },
      { id: 'l33-tile-11', color: 'grey' },
      { id: 'l33-tile-12', color: 'grey' },
      { id: 'l33-tile-13', color: 'purple' },
      { id: 'l33-tile-14', color: 'grey' },
      { id: 'l33-tile-15', color: 'grey' },
      { id: 'l33-tile-16', color: 'red' },
    ],
  },
  {
    id: 34,
    title: 'Level 34',
    gridSize: 4,
    initialTiles: [
      { id: 'l34-tile-1', color: 'orange', number: 3 },
      { id: 'l34-tile-2', color: 'orange' },
      { id: 'l34-tile-3', color: 'grey' },
      { id: 'l34-tile-4', color: 'cyan', number: 3 },
      { id: 'l34-tile-5', color: 'grey' },
      { id: 'l34-tile-6', color: 'grey' },
      { id: 'l34-tile-7', color: 'grey' },
      { id: 'l34-tile-8', color: 'cyan' },
      { id: 'l34-tile-9', color: 'grey' },
      { id: 'l34-tile-10', color: 'joker', isJoker: true },
      { id: 'l34-tile-11', color: 'joker', isJoker: true },
      { id: 'l34-tile-12', color: 'grey' },
      { id: 'l34-tile-13', color: 'grey' },
      { id: 'l34-tile-14', color: 'pink', number: 2 },
      { id: 'l34-tile-15', color: 'grey' },
      { id: 'l34-tile-16', color: 'joker', isJoker: true },
    ],
  },
  {
    id: 35,
    title: 'Level 35',
    gridSize: 4,
    initialTiles: [
      { id: 'l35-tile-1', color: 'red', number: 2 },
      { id: 'l35-tile-2', color: 'grey' },
      { id: 'l35-tile-3', color: 'grey' },
      { id: 'l35-tile-4', color: 'blue', number: 2 },
      { id: 'l35-tile-5', color: 'grey' },
      { id: 'l35-tile-6', color: 'joker', isJoker: true },
      { id: 'l35-tile-7', color: 'joker', isJoker: true },
      { id: 'l35-tile-8', color: 'grey' },
      { id: 'l35-tile-9', color: 'yellow', number: 2 },
      { id: 'l35-tile-10', color: 'grey' },
      { id: 'l35-tile-11', color: 'grey' },
      { id: 'l35-tile-12', color: 'green', number: 2 },
      { id: 'l35-tile-13', color: 'grey' },
      { id: 'l35-tile-14', color: 'grey' },
      { id: 'l35-tile-15', color: 'grey' },
      { id: 'l35-tile-16', color: 'grey' },
    ],
  },
  {
    id: 36,
    title: 'Level 36',
    gridSize: 4,
    initialTiles: [
      { id: 'l36-tile-1', color: 'red', number: 3 },
      { id: 'l36-tile-2', color: 'red' },
      { id: 'l36-tile-3', color: 'grey' },
      { id: 'l36-tile-4', color: 'blue', number: 3 },
      { id: 'l36-tile-5', color: 'grey' },
      { id: 'l36-tile-6', color: 'grey' },
      { id: 'l36-tile-7', color: 'grey' },
      { id: 'l36-tile-8', color: 'blue' },
      { id: 'l36-tile-9', color: 'grey' },
      { id: 'l36-tile-10', color: 'joker', isJoker: true },
      { id: 'l36-tile-11', color: 'joker', isJoker: true },
      { id: 'l36-tile-12', color: 'grey' },
      { id: 'l36-tile-13', color: 'yellow', number: 3 },
      { id: 'l36-tile-14', color: 'yellow' },
      { id: 'l36-tile-15', color: 'grey' },
      { id: 'l36-tile-16', color: 'grey' },
    ],
  },
  {
    id: 37,
    title: 'Level 37',
    gridSize: 5,
    initialTiles: [
      { id: 'l37-tile-1', color: 'red', number: 4 },
      { id: 'l37-tile-2', color: 'red' },
      { id: 'l37-tile-3', color: 'red' },
      { id: 'l37-tile-4', color: 'grey' },
      { id: 'l37-tile-5', color: 'green', number: 4 },
      { id: 'l37-tile-6', color: 'red' },
      { id: 'l37-tile-7', color: 'grey' },
      { id: 'l37-tile-8', color: 'grey' },
      { id: 'l37-tile-9', color: 'grey' },
      { id: 'l37-tile-10', color: 'green' },
      { id: 'l37-tile-11', color: 'blue' },
      { id: 'l37-tile-12', color: 'grey' },
      { id: 'l37-tile-13', color: 'joker', isJoker: true },
      { id: 'l37-tile-14', color: 'green' },
      { id: 'l37-tile-15', color: 'green' },
      { id: 'l37-tile-16', color: 'blue' },
      { id: 'l37-tile-17', color: 'grey' },
      { id: 'l37-tile-18', color: 'grey' },
      { id: 'l37-tile-19', color: 'grey' },
      { id: 'l37-tile-20', color: 'grey' },
      { id: 'l37-tile-21', color: 'blue', number: 4 },
      { id: 'l37-tile-22', color: 'grey' },
      { id: 'l37-tile-23', color: 'purple' },
      { id: 'l37-tile-24', color: 'purple' },
      { id: 'l37-tile-25', color: 'purple', number: 4 },
    ],
  },
  {
    id: 38,
    title: 'Level 38',
    gridSize: 5,
    initialTiles: [
      { id: 'l38-tile-1', color: 'joker', isJoker: true },
      { id: 'l38-tile-2', color: 'grey' },
      { id: 'l38-tile-3', color: 'cyan', number: 3 },
      { id: 'l38-tile-4', color: 'grey' },
      { id: 'l38-tile-5', color: 'grey' },
      { id: 'l38-tile-6', color: 'grey' },
      { id: 'l38-tile-7', color: 'grey' },
      { id: 'l38-tile-8', color: 'cyan' },
      { id: 'l38-tile-9', color: 'grey' },
      { id: 'l38-tile-10', color: 'lime' },
      { id: 'l38-tile-11', color: 'orange', number: 3 },
      { id: 'l38-tile-12', color: 'orange' },
      { id: 'l38-tile-13', color: 'grey' },
      { id: 'l38-tile-14', color: 'grey' },
      { id: 'l38-tile-15', color: 'lime', number: 3 },
      { id: 'l38-tile-16', color: 'grey' },
      { id: 'l38-tile-17', color: 'grey' },
      { id: 'l38-tile-18', color: 'pink' },
      { id: 'l38-tile-19', color: 'grey' },
      { id: 'l38-tile-20', color: 'grey' },
      { id: 'l38-tile-21', color: 'joker', isJoker: true },
      { id: 'l38-tile-22', color: 'grey' },
      { id: 'l38-tile-23', color: 'pink', number: 4 },
      { id: 'l38-tile-24', color: 'pink' },
      { id: 'l38-tile-25', color: 'grey' },
    ],
  },
  {
    id: 39,
    title: 'Level 39',
    gridSize: 5,
    initialTiles: [
      { id: 'l39-tile-1', color: 'purple' },
      { id: 'l39-tile-2', color: 'indigo', number: 3 },
      { id: 'l39-tile-3', color: 'indigo' },
      { id: 'l39-tile-4', color: 'grey' },
      { id: 'l39-tile-5', color: 'joker', isJoker: true },
      { id: 'l39-tile-6', color: 'grey' },
      { id: 'l39-tile-7', color: 'grey' },
      { id: 'l39-tile-8', color: 'purple' },
      { id: 'l39-tile-9', color: 'grey' },
      { id: 'l39-tile-10', color: 'amber', number: 3 },
      { id: 'l39-tile-11', color: 'green' },
      { id: 'l39-tile-12', color: 'grey' },
      { id: 'l39-tile-13', color: 'purple', number: 3 },
      { id: 'l39-tile-14', color: 'grey' },
      { id: 'l39-tile-15', color: 'amber' },
      { id: 'l39-tile-16', color: 'green', number: 3 },
      { id: 'l39-tile-17', color: 'grey' },
      { id: 'l39-tile-18', color: 'grey' },
      { id: 'l39-tile-19', color: 'grey' },
      { id: 'l39-tile-20', color: 'grey' },
      { id: 'l39-tile-21', color: 'joker', isJoker: true },
      { id: 'l39-tile-22', color: 'red' },
      { id: 'l39-tile-23', color: 'red', number: 3 },
      { id: 'l39-tile-24', color: 'grey' },
      { id: 'l39-tile-25', color: 'grey' },
    ],
  },
  {
    id: 40,
    title: 'Level 40',
    gridSize: 6,
    initialTiles: [
      { id: 'l40-tile-1', color: 'red', number: 4 },
      { id: 'l40-tile-2', color: 'red' },
      { id: 'l40-tile-3', color: 'red' },
      { id: 'l40-tile-4', color: 'grey' },
      { id: 'l40-tile-5', color: 'blue' },
      { id: 'l40-tile-6', color: 'blue', number: 4 },
      { id: 'l40-tile-7', color: 'grey' },
      { id: 'l40-tile-8', color: 'orange' },
      { id: 'l40-tile-9', color: 'orange' },
      { id: 'l40-tile-10', color: 'orange', number: 3 },
      { id: 'l40-tile-11', color: 'grey' },
      { id: 'l40-tile-12', color: 'blue' },
      { id: 'l40-tile-13', color: 'green' },
      { id: 'l40-tile-14', color: 'purple', number: 4 },
      { id: 'l40-tile-15', color: 'purple' },
      { id: 'l40-tile-16', color: 'purple' },
      { id: 'l40-tile-17', color: 'grey' },
      { id: 'l40-tile-18', color: 'blue' },
      { id: 'l40-tile-19', color: 'green' },
      { id: 'l40-tile-20', color: 'grey' },
      { id: 'l40-tile-21', color: 'grey' },
      { id: 'l40-tile-22', color: 'grey' },
      { id: 'l40-tile-23', color: 'joker', isJoker: true },
      { id: 'l40-tile-24', color: 'grey' },
      { id: 'l40-tile-25', color: 'grey' },
      { id: 'l40-tile-26', color: 'red' },
      { id: 'l40-tile-27', color: 'grey' },
      { id: 'l40-tile-28', color: 'grey' },
      { id: 'l40-tile-29', color: 'joker', isJoker: true },
      { id: 'l40-tile-30', color: 'yellow' },
      { id: 'l40-tile-31', color: 'green', number: 4 },
      { id: 'l40-tile-32', color: 'grey' },
      { id: 'l40-tile-33', color: 'grey' },
      { id: 'l40-tile-34', color: 'yellow' },
      { id: 'l40-tile-35', color: 'yellow' },
      { id: 'l40-tile-36', color: 'yellow', number: 4 },
    ],
  },
  {
    id: 41,
    title: 'Level 41',
    gridSize: 5,
    initialTiles: [
      { id: 'l41-tile-1', color: 'cyan', number: 3 },
      { id: 'l41-tile-2', color: 'cyan' },
      { id: 'l41-tile-3', color: 'grey' },
      { id: 'l41-tile-4', color: 'orange' },
      { id: 'l41-tile-5', color: 'orange', number: 4 },
      { id: 'l41-tile-6', color: 'grey' },
      { id: 'l41-tile-7', color: 'grey' },
      { id: 'l41-tile-8', color: 'joker', isJoker: true },
      { id: 'l41-tile-9', color: 'orange' },
      { id: 'l41-tile-10', color: 'grey' },
      { id: 'l41-tile-11', color: 'lime', number: 3 },
      { id: 'l41-tile-12', color: 'lime' },
      { id: 'l41-tile-13', color: 'grey' },
      { id: 'l41-tile-14', color: 'grey' },
      { id: 'l41-tile-15', color: 'pink' },
      { id: 'l41-tile-16', color: 'grey' },
      { id: 'l41-tile-17', color: 'joker', isJoker: true },
      { id: 'l41-tile-18', color: 'grey' },
      { id: 'l41-tile-19', color: 'pink' },
      { id: 'l41-tile-20', color: 'pink' },
      { id: 'l41-tile-21', color: 'grey' },
      { id: 'l41-tile-22', color: 'grey' },
      { id: 'l41-tile-23', color: 'grey' },
      { id: 'l41-tile-24', color: 'grey' },
      { id: 'l41-tile-25', color: 'pink', number: 4 },
    ],
  },
  {
    id: 42,
    title: 'Level 42',
    gridSize: 6,
    initialTiles: [
      { id: 'l42-tile-1', color: 'red', number: 4 },
      { id: 'l42-tile-2', color: 'red' },
      { id: 'l42-tile-3', color: 'red' },
      { id: 'l42-tile-4', color: 'grey' },
      { id: 'l42-tile-5', color: 'indigo' },
      { id: 'l42-tile-6', color: 'indigo', number: 3 },
      { id: 'l42-tile-7', color: 'grey' },
      { id: 'l42-tile-8', color: 'grey' },
      { id: 'l42-tile-9', color: 'joker', isJoker: true },
      { id: 'l42-tile-10', color: 'grey' },
      { id: 'l42-tile-11', color: 'indigo' },
      { id: 'l42-tile-12', color: 'grey' },
      { id: 'l42-tile-13', color: 'green', number: 4 },
      { id: 'l42-tile-14', color: 'green' },
      { id: 'l42-tile-15', color: 'grey' },
      { id: 'l42-tile-16', color: 'amber' },
      { id: 'l42-tile-17', color: 'amber' },
      { id: 'l42-tile-18', color: 'amber', number: 4 },
      { id: 'l42-tile-19', color: 'green' },
      { id: 'l42-tile-20', color: 'grey' },
      { id: 'l42-tile-21', color: 'joker', isJoker: true },
      { id: 'l42-tile-22', color: 'amber' },
      { id: 'l42-tile-23', color: 'grey' },
      { id: 'l42-tile-24', color: 'grey' },
      { id: 'l42-tile-25', color: 'green' },
      { id: 'l42-tile-26', color: 'grey' },
      { id: 'l42-tile-27', color: 'purple' },
      { id: 'l42-tile-28', color: 'purple' },
      { id: 'l42-tile-29', color: 'purple', number: 3 },
      { id: 'l42-tile-30', color: 'grey' },
      { id: 'l42-tile-31', color: 'grey' },
      { id: 'l42-tile-32', color: 'grey' },
      { id: 'l42-tile-33', color: 'grey' },
      { id: 'l42-tile-34', color: 'grey' },
      { id: 'l42-tile-35', color: 'grey' },
      { id: 'l42-tile-36', color: 'grey' },
    ],
  },
  {
    id: 43,
    title: 'Level 43',
    gridSize: 6,
    initialTiles: [
      { id: 'l43-tile-1', color: 'cyan', number: 4 },
      { id: 'l43-tile-2', color: 'cyan' },
      { id: 'l43-tile-3', color: 'cyan' },
      { id: 'l43-tile-4', color: 'grey' },
      { id: 'l43-tile-5', color: 'orange' },
      { id: 'l43-tile-6', color: 'orange', number: 4 },
      { id: 'l43-tile-7', color: 'grey' },
      { id: 'l43-tile-8', color: 'grey' },
      { id: 'l43-tile-9', color: 'grey' },
      { id: 'l43-tile-10', color: 'joker', isJoker: true },
      { id: 'l43-tile-11', color: 'orange' },
      { id: 'l43-tile-12', color: 'orange' },
      { id: 'l43-tile-13', color: 'blue', number: 4 },
      { id: 'l43-tile-14', color: 'blue' },
      { id: 'l43-tile-15', color: 'joker', isJoker: true },
      { id: 'l43-tile-16', color: 'grey' },
      { id: 'l43-tile-17', color: 'grey' },
      { id: 'l43-tile-18', color: 'grey' },
      { id: 'l43-tile-19', color: 'blue' },
      { id: 'l43-tile-20', color: 'blue' },
      { id: 'l43-tile-21', color: 'grey' },
      { id: 'l43-tile-22', color: 'yellow' },
      { id: 'l43-tile-23', color: 'yellow' },
      { id: 'l43-tile-24', color: 'yellow', number: 4 },
      { id: 'l43-tile-25', color: 'grey' },
      { id: 'l43-tile-26', color: 'grey' },
      { id: 'l43-tile-27', color: 'joker', isJoker: true },
      { id: 'l43-tile-28', color: 'yellow' },
      { id: 'l43-tile-29', color: 'grey' },
      { id: 'l43-tile-30', color: 'grey' },
      { id: 'l43-tile-31', color: 'grey' },
      { id: 'l43-tile-32', color: 'grey' },
      { id: 'l43-tile-33', color: 'grey' },
      { id: 'l43-tile-34', color: 'grey' },
      { id: 'l43-tile-35', color: 'grey' },
      { id: 'l43-tile-36', color: 'grey' },
    ],
  },
  {
    id: 44,
    title: 'Level 44',
    gridSize: 6,
    initialTiles: [
      { id: 'l44-tile-1', color: 'red', number: 3 },
      { id: 'l44-tile-2', color: 'red' },
      { id: 'l44-tile-3', color: 'grey' },
      { id: 'l44-tile-4', color: 'green' },
      { id: 'l44-tile-5', color: 'green', number: 3 },
      { id: 'l44-tile-6', color: 'grey' },
      { id: 'l44-tile-7', color: 'grey' },
      { id: 'l44-tile-8', color: 'joker', isJoker: true },
      { id: 'l44-tile-9', color: 'grey' },
      { id: 'l44-tile-10', color: 'grey' },
      { id: 'l44-tile-11', color: 'grey' },
      { id: 'l44-tile-12', color: 'blue', number: 3 },
      { id: 'l44-tile-13', color: 'yellow', number: 3 },
      { id: 'l44-tile-14', color: 'yellow' },
      { id: 'l44-tile-15', color: 'grey' },
      { id: 'l44-tile-16', color: 'blue' },
      { id: 'l44-tile-17', color: 'blue' },
      { id: 'l44-tile-18', color: 'grey' },
      { id: 'l44-tile-19', color: 'grey' },
      { id: 'l44-tile-20', color: 'grey' },
      { id: 'l44-tile-21', color: 'joker', isJoker: true },
      { id: 'l44-tile-22', color: 'grey' },
      { id: 'l44-tile-23', color: 'grey' },
      { id: 'l44-tile-24', color: 'purple', number: 3 },
      { id: 'l44-tile-25', color: 'pink', number: 3 },
      { id: 'l44-tile-26', color: 'pink' },
      { id: 'l44-tile-27', color: 'grey' },
      { id: 'l44-tile-28', color: 'purple' },
      { id: 'l44-tile-29', color: 'purple' },
      { id: 'l44-tile-30', color: 'grey' },
      { id: 'l44-tile-31', color: 'grey' },
      { id: 'l44-tile-32', color: 'grey' },
      { id: 'l44-tile-33', color: 'pink' },
      { id: 'l44-tile-34', color: 'grey' },
      { id: 'l44-tile-35', color: 'grey' },
      { id: 'l44-tile-36', color: 'grey' },
    ],
  },
  {
    id: 45,
    title: 'Level 45',
    gridSize: 6,
    initialTiles: [
      { id: 'l45-tile-1', color: 'indigo', number: 4 },
      { id: 'l45-tile-2', color: 'indigo' },
      { id: 'l45-tile-3', color: 'indigo' },
      { id: 'l45-tile-4', color: 'grey' },
      { id: 'l45-tile-5', color: 'lime' },
      { id: 'l45-tile-6', color: 'lime', number: 4 },
      { id: 'l45-tile-7', color: 'grey' },
      { id: 'l45-tile-8', color: 'joker', isJoker: true },
      { id: 'l45-tile-9', color: 'grey' },
      { id: 'l45-tile-10', color: 'lime' },
      { id: 'l45-tile-11', color: 'lime' },
      { id: 'l45-tile-12', color: 'grey' },
      { id: 'l45-tile-13', color: 'cyan', number: 4 },
      { id: 'l45-tile-14', color: 'cyan' },
      { id: 'l45-tile-15', color: 'cyan' },
      { id: 'l45-tile-16', color: 'grey' },
      { id: 'l45-tile-17', color: 'joker', isJoker: true },
      { id: 'l45-tile-18', color: 'grey' },
      { id: 'l45-tile-19', color: 'orange' },
      { id: 'l45-tile-20', color: 'orange' },
      { id: 'l45-tile-21', color: 'orange', number: 4 },
      { id: 'l45-tile-22', color: 'grey' },
      { id: 'l45-tile-23', color: 'amber' },
      { id: 'l45-tile-24', color: 'amber', number: 4 },
      { id: 'l45-tile-25', color: 'grey' },
      { id: 'l45-tile-26', color: 'joker', isJoker: true },
      { id: 'l45-tile-27', color: 'grey' },
      { id: 'l45-tile-28', color: 'amber' },
      { id: 'l45-tile-29', color: 'amber' },
      { id: 'l45-tile-30', color: 'grey' },
      { id: 'l45-tile-31', color: 'red', number: 4 },
      { id: 'l45-tile-32', color: 'red' },
      { id: 'l45-tile-33', color: 'red' },
      { id: 'l45-tile-34', color: 'red' },
      { id: 'l45-tile-35', color: 'grey' },
      { id: 'l45-tile-36', color: 'grey' },
    ],
  },
  {
    id: 46,
    title: 'Level 46',
    gridSize: 4,
    initialTiles: [
      { id: 'l46-tile-1', color: 'red' },
      { id: 'l46-tile-2', color: 'red' },
      { id: 'l46-tile-3', color: 'yellow' },
      { id: 'l46-tile-4', color: 'blue', number: 3 },
      { id: 'l46-tile-5', color: 'red' },
      { id: 'l46-tile-6', color: 'red', number: 4 },
      { id: 'l46-tile-7', color: 'grey' },
      { id: 'l46-tile-8', color: 'yellow' },
      { id: 'l46-tile-9', color: 'blue' },
      { id: 'l46-tile-10', color: 'red' },
      { id: 'l46-tile-11', color: 'grey' },
      { id: 'l46-tile-12', color: 'grey' },
      { id: 'l46-tile-13', color: 'yellow', number: 3 },
      { id: 'l46-tile-14', color: 'grey' },
      { id: 'l46-tile-15', color: 'blue' },
      { id: 'l46-tile-16', color: 'grey' },
    ],
  },
  {
    id: 47,
    title: 'Level 47',
    gridSize: 4,
    initialTiles: [
      { id: 'l47-tile-1', color: 'purple', number: 4 },
      { id: 'l47-tile-2', color: 'purple' },
      { id: 'l47-tile-3', color: 'purple' },
      { id: 'l47-tile-4', color: 'yellow', number: 3 },
      { id: 'l47-tile-5', color: 'purple' },
      { id: 'l47-tile-6', color: 'purple' },
      { id: 'l47-tile-7', color: 'grey' },
      { id: 'l47-tile-8', color: 'yellow' },
      { id: 'l47-tile-9', color: 'grey' },
      { id: 'l47-tile-10', color: 'green' },
      { id: 'l47-tile-11', color: 'grey' },
      { id: 'l47-tile-12', color: 'green' },
      { id: 'l47-tile-13', color: 'green', number: 3 },
      { id: 'l47-tile-14', color: 'yellow' },
      { id: 'l47-tile-15', color: 'grey' },
      { id: 'l47-tile-16', color: 'grey' },
    ],
  },
  {
    id: 48,
    title: 'Level 48',
    gridSize: 4,
    initialTiles: [
      { id: 'l48-tile-1', color: 'cyan', number: 4 },
      { id: 'l48-tile-2', color: 'cyan' },
      { id: 'l48-tile-3', color: 'cyan' },
      { id: 'l48-tile-4', color: 'grey' },
      { id: 'l48-tile-5', color: 'cyan' },
      { id: 'l48-tile-6', color: 'cyan' },
      { id: 'l48-tile-7', color: 'orange' },
      { id: 'l48-tile-8', color: 'pink' },
      { id: 'l48-tile-9', color: 'grey' },
      { id: 'l48-tile-10', color: 'orange' },
      { id: 'l48-tile-11', color: 'grey' },
      { id: 'l48-tile-12', color: 'pink', number: 3 },
      { id: 'l48-tile-13', color: 'orange', number: 3 },
      { id: 'l48-tile-14', color: 'orange' },
      { id: 'l48-tile-15', color: 'joker', isJoker: true },
      { id: 'l48-tile-16', color: 'grey' },
    ],
  },
  {
    id: 49,
    title: 'Level 49',
    gridSize: 5,
    initialTiles: [
      { id: 'l49-tile-1', color: 'blue', number: 4 },
      { id: 'l49-tile-2', color: 'blue' },
      { id: 'l49-tile-3', color: 'blue' },
      { id: 'l49-tile-4', color: 'amber' },
      { id: 'l49-tile-5', color: 'amber', number: 4 },
      { id: 'l49-tile-6', color: 'blue' },
      { id: 'l49-tile-7', color: 'blue' },
      { id: 'l49-tile-8', color: 'grey' },
      { id: 'l49-tile-9', color: 'amber' },
      { id: 'l49-tile-10', color: 'amber' },
      { id: 'l49-tile-11', color: 'grey' },
      { id: 'l49-tile-12', color: 'amber' },
      { id: 'l49-tile-13', color: 'red', number: 3 },
      { id: 'l49-tile-14', color: 'grey' },
      { id: 'l49-tile-15', color: 'red' },
      { id: 'l49-tile-16', color: 'grey' },
      { id: 'l49-tile-17', color: 'lime' },
      { id: 'l49-tile-18', color: 'lime' },
      { id: 'l49-tile-19', color: 'grey' },
      { id: 'l49-tile-20', color: 'lime' },
      { id: 'l49-tile-21', color: 'grey' },
      { id: 'l49-tile-22', color: 'red' },
      { id: 'l49-tile-23', color: 'lime', number: 4 },
      { id: 'l49-tile-24', color: 'grey' },
      { id: 'l49-tile-25', color: 'grey' },
    ],
  },
  {
    id: 50,
    title: 'Level 50',
    gridSize: 5,
    initialTiles: [
      { id: 'l50-tile-1', color: 'red', number: 5 },
      { id: 'l50-tile-2', color: 'red' },
      { id: 'l50-tile-3', color: 'red' },
      { id: 'l50-tile-4', color: 'red' },
      { id: 'l50-tile-5', color: 'yellow', number: 4 },
      { id: 'l50-tile-6', color: 'red' },
      { id: 'l50-tile-7', color: 'red' },
      { id: 'l50-tile-8', color: 'grey' },
      { id: 'l50-tile-9', color: 'grey' },
      { id: 'l50-tile-10', color: 'yellow' },
      { id: 'l50-tile-11', color: 'cyan', number: 3 },
      { id: 'l50-tile-12', color: 'grey' },
      { id: 'l50-tile-13', color: 'joker', isJoker: true },
      { id: 'l50-tile-14', color: 'yellow' },
      { id: 'l50-tile-15', color: 'yellow' },
      { id: 'l50-tile-16', color: 'cyan' },
      { id: 'l50-tile-17', color: 'indigo' },
      { id: 'l50-tile-18', color: 'indigo' },
      { id: 'l50-tile-19', color: 'grey' },
      { id: 'l50-tile-20', color: 'yellow' },
      { id: 'l50-tile-21', color: 'grey' },
      { id: 'l50-tile-22', color: 'grey' },
      { id: 'l50-tile-23', color: 'indigo', number: 3 },
      { id: 'l50-tile-24', color: 'joker', isJoker: true },
      { id: 'l50-tile-25', color: 'grey' },
    ],
  },
  {
    id: 51,
    title: 'Level 51',
    gridSize: 5,
    initialTiles: [
      { id: 'l51-tile-1', color: 'red', number: 4 },
      { id: 'l51-tile-2', color: 'red' },
      { id: 'l51-tile-3', color: 'red' },
      { id: 'l51-tile-4', color: 'blue' },
      { id: 'l51-tile-5', color: 'blue', number: 4 },
      { id: 'l51-tile-6', color: 'red' },
      { id: 'l51-tile-7', color: 'red' },
      { id: 'l51-tile-8', color: 'grey' },
      { id: 'l51-tile-9', color: 'grey' },
      { id: 'l51-tile-10', color: 'blue' },
      { id: 'l51-tile-11', color: 'yellow' },
      { id: 'l51-tile-12', color: 'grey' },
      { id: 'l51-tile-13', color: 'joker', isJoker: true },
      { id: 'l51-tile-14', color: 'blue' },
      { id: 'l51-tile-15', color: 'blue' },
      { id: 'l51-tile-16', color: 'yellow' },
      { id: 'l51-tile-17', color: 'grey' },
      { id: 'l51-tile-18', color: 'green' },
      { id: 'l51-tile-19', color: 'green', number: 4 },
      { id: 'l51-tile-20', color: 'green' },
      { id: 'l51-tile-21', color: 'yellow', number: 4 },
      { id: 'l51-tile-22', color: 'green' },
      { id: 'l51-tile-23', color: 'grey' },
      { id: 'l51-tile-24', color: 'grey' },
      { id: 'l51-tile-25', color: 'grey' },
    ],
  },
  {
    id: 52,
    title: 'Level 52',
    gridSize: 5,
    initialTiles: [
      { id: 'l52-tile-1', color: 'purple', number: 4 },
      { id: 'l52-tile-2', color: 'purple' },
      { id: 'l52-tile-3', color: 'purple' },
      { id: 'l52-tile-4', color: 'purple' },
      { id: 'l52-tile-5', color: 'orange', number: 4 },
      { id: 'l52-tile-6', color: 'purple' },
      { id: 'l52-tile-7', color: 'purple' },
      { id: 'l52-tile-8', color: 'grey' },
      { id: 'l52-tile-9', color: 'orange' },
      { id: 'l52-tile-10', color: 'orange' },
      { id: 'l52-tile-11', color: 'cyan', number: 3 },
      { id: 'l52-tile-12', color: 'cyan' },
      { id: 'l52-tile-13', color: 'grey' },
      { id: 'l52-tile-14', color: 'joker', isJoker: true },
      { id: 'l52-tile-15', color: 'orange' },
      { id: 'l52-tile-16', color: 'grey' },
      { id: 'l52-tile-17', color: 'lime' },
      { id: 'l52-tile-18', color: 'joker', isJoker: true },
      { id: 'l52-tile-19', color: 'amber' },
      { id: 'l52-tile-20', color: 'amber' },
      { id: 'l52-tile-21', color: 'lime', number: 3 },
      { id: 'l52-tile-22', color: 'grey' },
      { id: 'l52-tile-23', color: 'grey' },
      { id: 'l52-tile-24', color: 'grey' },
      { id: 'l52-tile-25', color: 'amber', number: 3 },
    ],
  },
  {
    id: 53,
    title: 'Level 53',
    gridSize: 5,
    initialTiles: [
      { id: 'l53-tile-1', color: 'indigo', number: 4 },
      { id: 'l53-tile-2', color: 'indigo' },
      { id: 'l53-tile-3', color: 'indigo' },
      { id: 'l53-tile-4', color: 'pink' },
      { id: 'l53-tile-5', color: 'pink', number: 4 },
      { id: 'l53-tile-6', color: 'indigo' },
      { id: 'l53-tile-7', color: 'indigo' },
      { id: 'l53-tile-8', color: 'grey' },
      { id: 'l53-tile-9', color: 'pink' },
      { id: 'l53-tile-10', color: 'pink' },
      { id: 'l53-tile-11', color: 'yellow', number: 3 },
      { id: 'l53-tile-12', color: 'grey' },
      { id: 'l53-tile-13', color: 'pink' },
      { id: 'l53-tile-14', color: 'red' },
      { id: 'l53-tile-15', color: 'red', number: 3 },
      { id: 'l53-tile-16', color: 'yellow' },
      { id: 'l53-tile-17', color: 'joker', isJoker: true },
      { id: 'l53-tile-18', color: 'green' },
      { id: 'l53-tile-19', color: 'grey' },
      { id: 'l53-tile-20', color: 'red' },
      { id: 'l53-tile-21', color: 'grey' },
      { id: 'l53-tile-22', color: 'green', number: 3 },
      { id: 'l53-tile-23', color: 'green' },
      { id: 'l53-tile-24', color: 'grey' },
      { id: 'l53-tile-25', color: 'grey' },
    ],
  },
  {
    id: 54,
    title: 'Level 54',
    gridSize: 5,
    initialTiles: [
      { id: 'l54-tile-1', color: 'blue', number: 4 },
      { id: 'l54-tile-2', color: 'blue' },
      { id: 'l54-tile-3', color: 'blue' },
      { id: 'l54-tile-4', color: 'blue' },
      { id: 'l54-tile-5', color: 'amber', number: 4 },
      { id: 'l54-tile-6', color: 'blue' },
      { id: 'l54-tile-7', color: 'blue' },
      { id: 'l54-tile-8', color: 'grey' },
      { id: 'l54-tile-9', color: 'amber' },
      { id: 'l54-tile-10', color: 'amber' },
      { id: 'l54-tile-11', color: 'purple', number: 3 },
      { id: 'l54-tile-12', color: 'amber' },
      { id: 'l54-tile-13', color: 'grey' },
      { id: 'l54-tile-14', color: 'lime' },
      { id: 'l54-tile-15', color: 'amber' },
      { id: 'l54-tile-16', color: 'purple' },
      { id: 'l54-tile-17', color: 'lime' },
      { id: 'l54-tile-18', color: 'lime' },
      { id: 'l54-tile-19', color: 'grey' },
      { id: 'l54-tile-20', color: 'grey' },
      { id: 'l54-tile-21', color: 'purple' },
      { id: 'l54-tile-22', color: 'lime', number: 4 },
      { id: 'l54-tile-23', color: 'lime' },
      { id: 'l54-tile-24', color: 'grey' },
      { id: 'l54-tile-25', color: 'grey' },
    ],
  },
  {
    id: 55,
    title: 'Level 55',
    gridSize: 6,
    initialTiles: [
      { id: 'l55-tile-1', color: 'red', number: 5 },
      { id: 'l55-tile-2', color: 'red' },
      { id: 'l55-tile-3', color: 'red' },
      { id: 'l55-tile-4', color: 'red' },
      { id: 'l55-tile-5', color: 'cyan', number: 4 },
      { id: 'l55-tile-6', color: 'cyan' },
      { id: 'l55-tile-7', color: 'red' },
      { id: 'l55-tile-8', color: 'red' },
      { id: 'l55-tile-9', color: 'red' },
      { id: 'l55-tile-10', color: 'grey' },
      { id: 'l55-tile-11', color: 'cyan' },
      { id: 'l55-tile-12', color: 'cyan' },
      { id: 'l55-tile-13', color: 'yellow', number: 4 },
      { id: 'l55-tile-14', color: 'yellow' },
      { id: 'l55-tile-15', color: 'grey' },
      { id: 'l55-tile-16', color: 'joker', isJoker: true },
      { id: 'l55-tile-17', color: 'grey' },
      { id: 'l55-tile-18', color: 'grey' },
      { id: 'l55-tile-19', color: 'yellow' },
      { id: 'l55-tile-20', color: 'grey' },
      { id: 'l55-tile-21', color: 'joker', isJoker: true },
      { id: 'l55-tile-22', color: 'purple' },
      { id: 'l55-tile-23', color: 'purple', number: 4 },
      { id: 'l55-tile-24', color: 'grey' },
      { id: 'l55-tile-25', color: 'grey' },
      { id: 'l55-tile-26', color: 'pink' },
      { id: 'l55-tile-27', color: 'pink' },
      { id: 'l55-tile-28', color: 'purple' },
      { id: 'l55-tile-29', color: 'grey' },
      { id: 'l55-tile-30', color: 'grey' },
      { id: 'l55-tile-31', color: 'pink', number: 5 },
      { id: 'l55-tile-32', color: 'pink' },
      { id: 'l55-tile-33', color: 'pink' },
      { id: 'l55-tile-34', color: 'grey' },
      { id: 'l55-tile-35', color: 'grey' },
      { id: 'l55-tile-36', color: 'grey' },
    ],
  },
  {
    id: 56,
    title: 'Level 56',
    gridSize: 6,
    initialTiles: [
      { id: 'l56-tile-1', color: 'indigo', number: 5 },
      { id: 'l56-tile-2', color: 'indigo' },
      { id: 'l56-tile-3', color: 'indigo' },
      { id: 'l56-tile-4', color: 'indigo' },
      { id: 'l56-tile-5', color: 'orange', number: 4 },
      { id: 'l56-tile-6', color: 'orange' },
      { id: 'l56-tile-7', color: 'indigo' },
      { id: 'l56-tile-8', color: 'indigo' },
      { id: 'l56-tile-9', color: 'indigo' },
      { id: 'l56-tile-10', color: 'grey' },
      { id: 'l56-tile-11', color: 'orange' },
      { id: 'l56-tile-12', color: 'orange' },
      { id: 'l56-tile-13', color: 'lime', number: 4 },
      { id: 'l56-tile-14', color: 'lime' },
      { id: 'l56-tile-15', color: 'grey' },
      { id: 'l56-tile-16', color: 'orange' },
      { id: 'l56-tile-17', color: 'pink' },
      { id: 'l56-tile-18', color: 'pink', number: 4 },
      { id: 'l56-tile-19', color: 'lime' },
      { id: 'l56-tile-20', color: 'grey' },
      { id: 'l56-tile-21', color: 'joker', isJoker: true },
      { id: 'l56-tile-22', color: 'joker', isJoker: true },
      { id: 'l56-tile-23', color: 'pink' },
      { id: 'l56-tile-24', color: 'grey' },
      { id: 'l56-tile-25', color: 'amber', number: 3 },
      { id: 'l56-tile-26', color: 'amber' },
      { id: 'l56-tile-27', color: 'grey' },
      { id: 'l56-tile-28', color: 'grey' },
      { id: 'l56-tile-29', color: 'blue' },
      { id: 'l56-tile-30', color: 'blue', number: 3 },
      { id: 'l56-tile-31', color: 'amber' },
      { id: 'l56-tile-32', color: 'grey' },
      { id: 'l56-tile-33', color: 'grey' },
      { id: 'l56-tile-34', color: 'blue' },
      { id: 'l56-tile-35', color: 'grey' },
      { id: 'l56-tile-36', color: 'grey' },
    ],
  },
  {
    id: 57,
    title: 'Level 57',
    gridSize: 6,
    initialTiles: [
      { id: 'l57-tile-1', color: 'red', number: 5 },
      { id: 'l57-tile-2', color: 'red' },
      { id: 'l57-tile-3', color: 'red' },
      { id: 'l57-tile-4', color: 'red' },
      { id: 'l57-tile-5', color: 'yellow', number: 5 },
      { id: 'l57-tile-6', color: 'yellow' },
      { id: 'l57-tile-7', color: 'red' },
      { id: 'l57-tile-8', color: 'red' },
      { id: 'l57-tile-9', color: 'red' },
      { id: 'l57-tile-10', color: 'grey' },
      { id: 'l57-tile-11', color: 'yellow' },
      { id: 'l57-tile-12', color: 'yellow' },
      { id: 'l57-tile-13', color: 'cyan', number: 4 },
      { id: 'l57-tile-14', color: 'cyan' },
      { id: 'l57-tile-15', color: 'grey' },
      { id: 'l57-tile-16', color: 'yellow' },
      { id: 'l57-tile-17', color: 'yellow' },
      { id: 'l57-tile-18', color: 'grey' },
      { id: 'l57-tile-19', color: 'cyan' },
      { id: 'l57-tile-20', color: 'cyan' },
      { id: 'l57-tile-21', color: 'grey' },
      { id: 'l57-tile-22', color: 'purple' },
      { id: 'l57-tile-23', color: 'purple', number: 4 },
      { id: 'l57-tile-24', color: 'purple' },
      { id: 'l57-tile-25', color: 'blue', number: 4 },
      { id: 'l57-tile-26', color: 'blue' },
      { id: 'l57-tile-27', color: 'joker', isJoker: true },
      { id: 'l57-tile-28', color: 'grey' },
      { id: 'l57-tile-29', color: 'amber' },
      { id: 'l57-tile-30', color: 'amber', number: 3 },
      { id: 'l57-tile-31', color: 'blue' },
      { id: 'l57-tile-32', color: 'blue' },
      { id: 'l57-tile-33', color: 'grey' },
      { id: 'l57-tile-34', color: 'amber' },
      { id: 'l57-tile-35', color: 'grey' },
      { id: 'l57-tile-36', color: 'grey' },
    ],
  },
  {
    id: 58,
    title: 'Level 58',
    gridSize: 6,
    initialTiles: [
      { id: 'l58-tile-1', color: 'indigo', number: 5 },
      { id: 'l58-tile-2', color: 'indigo' },
      { id: 'l58-tile-3', color: 'indigo' },
      { id: 'l58-tile-4', color: 'indigo' },
      { id: 'l58-tile-5', color: 'orange', number: 4 },
      { id: 'l58-tile-6', color: 'orange' },
      { id: 'l58-tile-7', color: 'indigo' },
      { id: 'l58-tile-8', color: 'indigo' },
      { id: 'l58-tile-9', color: 'indigo' },
      { id: 'l58-tile-10', color: 'grey' },
      { id: 'l58-tile-11', color: 'orange' },
      { id: 'l58-tile-12', color: 'orange' },
      { id: 'l58-tile-13', color: 'lime', number: 4 },
      { id: 'l58-tile-14', color: 'lime' },
      { id: 'l58-tile-15', color: 'grey' },
      { id: 'l58-tile-16', color: 'joker', isJoker: true },
      { id: 'l58-tile-17', color: 'pink' },
      { id: 'l58-tile-18', color: 'pink', number: 4 },
      { id: 'l58-tile-19', color: 'lime' },
      { id: 'l58-tile-20', color: 'grey' },
      { id: 'l58-tile-21', color: 'joker', isJoker: true },
      { id: 'l58-tile-22', color: 'joker', isJoker: true },
      { id: 'l58-tile-23', color: 'pink' },
      { id: 'l58-tile-24', color: 'grey' },
      { id: 'l58-tile-25', color: 'blue', number: 4 },
      { id: 'l58-tile-26', color: 'blue' },
      { id: 'l58-tile-27', color: 'grey' },
      { id: 'l58-tile-28', color: 'grey' },
      { id: 'l58-tile-29', color: 'amber' },
      { id: 'l58-tile-30', color: 'amber', number: 4 },
      { id: 'l58-tile-31', color: 'blue' },
      { id: 'l58-tile-32', color: 'grey' },
      { id: 'l58-tile-33', color: 'grey' },
      { id: 'l58-tile-34', color: 'amber' },
      { id: 'l58-tile-35', color: 'amber' },
      { id: 'l58-tile-36', color: 'grey' },
    ],
  },
  {
    id: 59,
    title: 'Level 59',
    gridSize: 6,
    initialTiles: [
      { id: 'l59-tile-1', color: 'red', number: 5 },
      { id: 'l59-tile-2', color: 'red' },
      { id: 'l59-tile-3', color: 'red' },
      { id: 'l59-tile-4', color: 'red' },
      { id: 'l59-tile-5', color: 'yellow', number: 5 },
      { id: 'l59-tile-6', color: 'yellow' },
      { id: 'l59-tile-7', color: 'red' },
      { id: 'l59-tile-8', color: 'red' },
      { id: 'l59-tile-9', color: 'red' },
      { id: 'l59-tile-10', color: 'grey' },
      { id: 'l59-tile-11', color: 'yellow' },
      { id: 'l59-tile-12', color: 'yellow' },
      { id: 'l59-tile-13', color: 'cyan', number: 5 },
      { id: 'l59-tile-14', color: 'cyan' },
      { id: 'l59-tile-15', color: 'cyan' },
      { id: 'l59-tile-16', color: 'yellow' },
      { id: 'l59-tile-17', color: 'yellow' },
      { id: 'l59-tile-18', color: 'yellow' },
      { id: 'l59-tile-19', color: 'cyan' },
      { id: 'l59-tile-20', color: 'cyan' },
      { id: 'l59-tile-21', color: 'cyan' },
      { id: 'l59-tile-22', color: 'purple' },
      { id: 'l59-tile-23', color: 'purple', number: 4 },
      { id: 'l59-tile-24', color: 'purple' },
      { id: 'l59-tile-25', color: 'blue', number: 4 },
      { id: 'l59-tile-26', color: 'blue' },
      { id: 'l59-tile-27', color: 'joker', isJoker: true },
      { id: 'l59-tile-28', color: 'joker', isJoker: true },
      { id: 'l59-tile-29', color: 'orange' },
      { id: 'l59-tile-30', color: 'orange', number: 3 },
      { id: 'l59-tile-31', color: 'blue' },
      { id: 'l59-tile-32', color: 'grey' },
      { id: 'l59-tile-33', color: 'grey' },
      { id: 'l59-tile-34', color: 'orange' },
      { id: 'l59-tile-35', color: 'grey' },
      { id: 'l59-tile-36', color: 'grey' },
    ],
  },
  {
    id: 60,
    title: 'Level 60',
    gridSize: 6,
    initialTiles: [
      { id: 'l60-tile-1', color: 'indigo', number: 5 },
      { id: 'l60-tile-2', color: 'indigo' },
      { id: 'l60-tile-3', color: 'indigo' },
      { id: 'l60-tile-4', color: 'indigo' },
      { id: 'l60-tile-5', color: 'amber', number: 5 },
      { id: 'l60-tile-6', color: 'amber' },
      { id: 'l60-tile-7', color: 'indigo' },
      { id: 'l60-tile-8', color: 'indigo' },
      { id: 'l60-tile-9', color: 'indigo' },
      { id: 'l60-tile-10', color: 'grey' },
      { id: 'l60-tile-11', color: 'amber' },
      { id: 'l60-tile-12', color: 'amber' },
      { id: 'l60-tile-13', color: 'lime', number: 5 },
      { id: 'l60-tile-14', color: 'lime' },
      { id: 'l60-tile-15', color: 'lime' },
      { id: 'l60-tile-16', color: 'amber' },
      { id: 'l60-tile-17', color: 'amber' },
      { id: 'l60-tile-18', color: 'amber' },
      { id: 'l60-tile-19', color: 'lime' },
      { id: 'l60-tile-20', color: 'lime' },
      { id: 'l60-tile-21', color: 'lime' },
      { id: 'l60-tile-22', color: 'pink' },
      { id: 'l60-tile-23', color: 'pink', number: 4 },
      { id: 'l60-tile-24', color: 'pink' },
      { id: 'l60-tile-25', color: 'blue', number: 4 },
      { id: 'l60-tile-26', color: 'blue' },
      { id: 'l60-tile-27', color: 'joker', isJoker: true },
      { id: 'l60-tile-28', color: 'joker', isJoker: true },
      { id: 'l60-tile-29', color: 'red' },
      { id: 'l60-tile-30', color: 'red', number: 3 },
      { id: 'l60-tile-31', color: 'cyan', number: 3 },
      { id: 'l60-tile-32', color: 'cyan' },
      { id: 'l60-tile-33', color: 'joker', isJoker: true },
      { id: 'l60-tile-34', color: 'blue' },
      { id: 'l60-tile-35', color: 'red' },
      { id: 'l60-tile-36', color: 'grey' },
    ],
  },
  {
    id: 61,
    title: 'Level 61',
    gridSize: 3,
    initialTiles: [
      { id: 'l61-tile-1', color: 'red', number: 3, allowedColors: ['red', 'blue'] },
      { id: 'l61-tile-2', color: 'grey' },
      { id: 'l61-tile-3', color: 'blue' },
      { id: 'l61-tile-4', color: 'grey' },
      { id: 'l61-tile-5', color: 'yellow' },
      { id: 'l61-tile-6', color: 'red' },
      { id: 'l61-tile-7', color: 'green' },
      { id: 'l61-tile-8', color: 'grey' },
      { id: 'l61-tile-9', color: 'green', number: 3, allowedColors: ['yellow', 'green'] },
    ],
  },
  {
    id: 62,
    title: 'Level 62',
    gridSize: 3,
    initialTiles: [
      { id: 'l62-tile-1', color: 'red', number: 4, allowedColors: ['red', 'yellow', 'blue'] },
      { id: 'l62-tile-2', color: 'grey' },
      { id: 'l62-tile-3', color: 'green' },
      { id: 'l62-tile-4', color: 'blue' },
      { id: 'l62-tile-5', color: 'grey' },
      { id: 'l62-tile-6', color: 'yellow' },
      { id: 'l62-tile-7', color: 'purple' },
      { id: 'l62-tile-8', color: 'red' },
      { id: 'l62-tile-9', color: 'purple', number: 3, allowedColors: ['green', 'purple'] },
    ],
  },
  {
    id: 63,
    title: 'Level 63',
    gridSize: 4,
    initialTiles: [
      { id: 'l63-tile-1', color: 'purple', number: 4, allowedColors: ['purple', 'orange'] },
      { id: 'l63-tile-2', color: 'grey' },
      { id: 'l63-tile-3', color: 'cyan' },
      { id: 'l63-tile-4', color: 'grey' },
      { id: 'l63-tile-5', color: 'orange' },
      { id: 'l63-tile-6', color: 'grey' },
      { id: 'l63-tile-7', color: 'purple' },
      { id: 'l63-tile-8', color: 'grey' },
      { id: 'l63-tile-9', color: 'grey' },
      { id: 'l63-tile-10', color: 'cyan' },
      { id: 'l63-tile-11', color: 'grey' },
      { id: 'l63-tile-12', color: 'orange' },
      { id: 'l63-tile-13', color: 'grey' },
      { id: 'l63-tile-14', color: 'purple' },
      { id: 'l63-tile-15', color: 'grey' },
      { id: 'l63-tile-16', color: 'cyan', number: 4, allowedColors: ['orange', 'cyan'] },
    ],
  },
  {
    id: 64,
    title: 'Level 64',
    gridSize: 4,
    initialTiles: [
      { id: 'l64-tile-1', color: 'blue' },
      { id: 'l64-tile-2', color: 'grey' },
      { id: 'l64-tile-3', color: 'pink' },
      { id: 'l64-tile-4', color: 'pink', number: 3 },
      { id: 'l64-tile-5', color: 'grey' },
      { id: 'l64-tile-6', color: 'yellow', number: 3, allowedColors: ['blue', 'yellow'] },
      { id: 'l64-tile-7', color: 'grey' },
      { id: 'l64-tile-8', color: 'green' },
      { id: 'l64-tile-9', color: 'yellow' },
      { id: 'l64-tile-10', color: 'grey' },
      { id: 'l64-tile-11', color: 'pink' },
      { id: 'l64-tile-12', color: 'grey' },
      { id: 'l64-tile-13', color: 'blue', number: 5, allowedColors: ['blue', 'pink', 'green'] },
      { id: 'l64-tile-14', color: 'blue' },
      { id: 'l64-tile-15', color: 'green' },
      { id: 'l64-tile-16', color: 'grey' },
    ],
  },
  {
    id: 65,
    title: 'Level 65',
    gridSize: 4,
    initialTiles: [
      { id: 'l65-tile-1', color: 'red', number: 4, allowedColors: ['red', 'green'] },
      { id: 'l65-tile-2', color: 'grey' },
      { id: 'l65-tile-3', color: 'purple' },
      { id: 'l65-tile-4', color: 'grey' },
      { id: 'l65-tile-5', color: 'green' },
      { id: 'l65-tile-6', color: 'grey' },
      { id: 'l65-tile-7', color: 'red' },
      { id: 'l65-tile-8', color: 'grey' },
      { id: 'l65-tile-9', color: 'yellow' },
      { id: 'l65-tile-10', color: 'joker', isJoker: true },
      { id: 'l65-tile-11', color: 'grey' },
      { id: 'l65-tile-12', color: 'red' },
      { id: 'l65-tile-13', color: 'grey' },
      { id: 'l65-tile-14', color: 'purple' },
      { id: 'l65-tile-15', color: 'grey' },
      { id: 'l65-tile-16', color: 'purple', number: 4, allowedColors: ['purple', 'yellow'] },
    ],
  },
  {
    id: 66,
    title: 'Level 66',
    gridSize: 5,
    initialTiles: [
      { id: 'l66-tile-1', color: 'cyan', number: 4, allowedColors: ['cyan', 'lime'] },
      { id: 'l66-tile-2', color: 'grey' },
      { id: 'l66-tile-3', color: 'cyan' },
      { id: 'l66-tile-4', color: 'grey' },
      { id: 'l66-tile-5', color: 'lime' },
      { id: 'l66-tile-6', color: 'grey' },
      { id: 'l66-tile-7', color: 'red' },
      { id: 'l66-tile-8', color: 'grey' },
      { id: 'l66-tile-9', color: 'purple' },
      { id: 'l66-tile-10', color: 'grey' },
      { id: 'l66-tile-11', color: 'lime' },
      { id: 'l66-tile-12', color: 'grey' },
      { id: 'l66-tile-13', color: 'red', number: 5, allowedColors: ['red', 'purple', 'amber'] },
      { id: 'l66-tile-14', color: 'grey' },
      { id: 'l66-tile-15', color: 'amber' },
      { id: 'l66-tile-16', color: 'grey' },
      { id: 'l66-tile-17', color: 'red' },
      { id: 'l66-tile-18', color: 'grey' },
      { id: 'l66-tile-19', color: 'cyan' },
      { id: 'l66-tile-20', color: 'grey' },
      { id: 'l66-tile-21', color: 'amber' },
      { id: 'l66-tile-22', color: 'grey' },
      { id: 'l66-tile-23', color: 'grey' },
      { id: 'l66-tile-24', color: 'grey' },
      { id: 'l66-tile-25', color: 'amber', number: 4, allowedColors: ['cyan', 'amber'] },
    ],
  },
  {
    id: 67,
    title: 'Level 67',
    gridSize: 5,
    initialTiles: [
      { id: 'l67-tile-1', color: 'grey' },
      { id: 'l67-tile-2', color: 'blue', number: 3, allowedColors: ['blue', 'orange'] },
      { id: 'l67-tile-3', color: 'pink' },
      { id: 'l67-tile-4', color: 'grey' },
      { id: 'l67-tile-5', color: 'orange' },
      { id: 'l67-tile-6', color: 'pink' },
      { id: 'l67-tile-7', color: 'grey' },
      { id: 'l67-tile-8', color: 'green' },
      { id: 'l67-tile-9', color: 'grey' },
      { id: 'l67-tile-10', color: 'orange', number: 3, allowedColors: ['orange', 'green'] },
      { id: 'l67-tile-11', color: 'grey' },
      { id: 'l67-tile-12', color: 'blue' },
      { id: 'l67-tile-13', color: 'grey' },
      { id: 'l67-tile-14', color: 'green' },
      { id: 'l67-tile-15', color: 'grey' },
      { id: 'l67-tile-16', color: 'pink', number: 3, allowedColors: ['pink', 'blue'] },
      { id: 'l67-tile-17', color: 'grey' },
      { id: 'l67-tile-18', color: 'orange' },
      { id: 'l67-tile-19', color: 'grey' },
      { id: 'l67-tile-20', color: 'blue' },
      { id: 'l67-tile-21', color: 'green' },
      { id: 'l67-tile-22', color: 'grey' },
      { id: 'l67-tile-23', color: 'grey' },
      { id: 'l67-tile-24', color: 'green', number: 3, allowedColors: ['green', 'pink'] },
      { id: 'l67-tile-25', color: 'grey' },
    ],
  },
  {
    id: 68,
    title: 'Level 68',
    gridSize: 5,
    initialTiles: [
      { id: 'l68-tile-1', color: 'grey' },
      { id: 'l68-tile-2', color: 'blue' },
      { id: 'l68-tile-3', color: 'red', number: 6, allowedColors: ['red', 'blue', 'yellow'] },
      { id: 'l68-tile-4', color: 'grey' },
      { id: 'l68-tile-5', color: 'green' },
      { id: 'l68-tile-6', color: 'yellow' },
      { id: 'l68-tile-7', color: 'grey' },
      { id: 'l68-tile-8', color: 'joker', isJoker: true },
      { id: 'l68-tile-9', color: 'grey' },
      { id: 'l68-tile-10', color: 'red' },
      { id: 'l68-tile-11', color: 'grey' },
      { id: 'l68-tile-12', color: 'purple' },
      { id: 'l68-tile-13', color: 'grey' },
      { id: 'l68-tile-14', color: 'red' },
      { id: 'l68-tile-15', color: 'grey' },
      { id: 'l68-tile-16', color: 'green' },
      { id: 'l68-tile-17', color: 'grey' },
      { id: 'l68-tile-18', color: 'joker', isJoker: true },
      { id: 'l68-tile-19', color: 'grey' },
      { id: 'l68-tile-20', color: 'grey' },
      { id: 'l68-tile-21', color: 'grey' },
      { id: 'l68-tile-22', color: 'grey' },
      { id: 'l68-tile-23', color: 'green', number: 4, allowedColors: ['green', 'purple'] },
      { id: 'l68-tile-24', color: 'grey' },
      { id: 'l68-tile-25', color: 'grey' },
    ],
  },
  {
    id: 69,
    title: 'Level 69',
    gridSize: 6,
    initialTiles: [
      { id: 'l69-tile-1', color: 'red', number: 4, allowedColors: ['red', 'yellow'] },
      { id: 'l69-tile-2', color: 'grey' },
      { id: 'l69-tile-3', color: 'yellow' },
      { id: 'l69-tile-4', color: 'grey' },
      { id: 'l69-tile-5', color: 'cyan' },
      { id: 'l69-tile-6', color: 'blue', number: 4, allowedColors: ['blue', 'cyan'] },
      { id: 'l69-tile-7', color: 'grey' },
      { id: 'l69-tile-8', color: 'red' },
      { id: 'l69-tile-9', color: 'grey' },
      { id: 'l69-tile-10', color: 'blue' },
      { id: 'l69-tile-11', color: 'grey' },
      { id: 'l69-tile-12', color: 'cyan' },
      { id: 'l69-tile-13', color: 'yellow' },
      { id: 'l69-tile-14', color: 'grey' },
      { id: 'l69-tile-15', color: 'grey' },
      { id: 'l69-tile-16', color: 'red', number: 5, allowedColors: ['red', 'blue', 'purple', 'amber'] },
      { id: 'l69-tile-17', color: 'grey' },
      { id: 'l69-tile-18', color: 'blue' },
      { id: 'l69-tile-19', color: 'purple' },
      { id: 'l69-tile-20', color: 'grey' },
      { id: 'l69-tile-21', color: 'red' },
      { id: 'l69-tile-22', color: 'grey' },
      { id: 'l69-tile-23', color: 'amber' },
      { id: 'l69-tile-24', color: 'grey' },
      { id: 'l69-tile-25', color: 'pink' },
      { id: 'l69-tile-26', color: 'grey' },
      { id: 'l69-tile-27', color: 'purple' },
      { id: 'l69-tile-28', color: 'grey' },
      { id: 'l69-tile-29', color: 'orange' },
      { id: 'l69-tile-30', color: 'grey' },
      { id: 'l69-tile-31', color: 'purple', number: 4, allowedColors: ['purple', 'pink'] },
      { id: 'l69-tile-32', color: 'grey' },
      { id: 'l69-tile-33', color: 'pink' },
      { id: 'l69-tile-34', color: 'grey' },
      { id: 'l69-tile-35', color: 'orange' },
      { id: 'l69-tile-36', color: 'amber', number: 4, allowedColors: ['amber', 'orange'] },
    ],
  },
  {
    id: 70,
    title: 'Level 70',
    gridSize: 6,
    initialTiles: [
      { id: 'l70-tile-1', color: 'grey' },
      { id: 'l70-tile-2', color: 'orange' },
      { id: 'l70-tile-3', color: 'grey' },
      { id: 'l70-tile-4', color: 'grey' },
      { id: 'l70-tile-5', color: 'cyan' },
      { id: 'l70-tile-6', color: 'grey' },
      { id: 'l70-tile-7', color: 'yellow' },
      { id: 'l70-tile-8', color: 'red', number: 6, allowedColors: ['red', 'orange', 'yellow'] },
      { id: 'l70-tile-9', color: 'red' },
      { id: 'l70-tile-10', color: 'blue' },
      { id: 'l70-tile-11', color: 'charcoal', number: 6, allowedColors: ['charcoal', 'cyan', 'blue'] },
      { id: 'l70-tile-12', color: 'charcoal' },
      { id: 'l70-tile-13', color: 'grey' },
      { id: 'l70-tile-14', color: 'orange' },
      { id: 'l70-tile-15', color: 'joker', isJoker: true },
      { id: 'l70-tile-16', color: 'grey' },
      { id: 'l70-tile-17', color: 'cyan' },
      { id: 'l70-tile-18', color: 'grey' },
      { id: 'l70-tile-19', color: 'grey' },
      { id: 'l70-tile-20', color: 'pink' },
      { id: 'l70-tile-21', color: 'grey' },
      { id: 'l70-tile-22', color: 'joker', isJoker: true },
      { id: 'l70-tile-23', color: 'blue' },
      { id: 'l70-tile-24', color: 'grey' },
      { id: 'l70-tile-25', color: 'purple' },
      { id: 'l70-tile-26', color: 'purple', number: 6, allowedColors: ['purple', 'pink', 'red'] },
      { id: 'l70-tile-27', color: 'pink' },
      { id: 'l70-tile-28', color: 'purple' },
      { id: 'l70-tile-29', color: 'blue', number: 6, allowedColors: ['blue', 'purple', 'cyan'] },
      { id: 'l70-tile-30', color: 'cyan' },
      { id: 'l70-tile-31', color: 'grey' },
      { id: 'l70-tile-32', color: 'red' },
      { id: 'l70-tile-33', color: 'grey' },
      { id: 'l70-tile-34', color: 'grey' },
      { id: 'l70-tile-35', color: 'blue' },
      { id: 'l70-tile-36', color: 'grey' },
    ],
  },
  {
    id: 71,
    title: 'Level 71',
    gridSize: 5,
    initialTiles: [
      { id: 'l71-tile-1', color: 'grey' },
      { id: 'l71-tile-2', color: 'yellow', number: 4, allowedColors: ['yellow', 'orange'] },
      { id: 'l71-tile-3', color: 'indigo' },
      { id: 'l71-tile-4', color: 'grey' },
      { id: 'l71-tile-5', color: 'lime' },
      { id: 'l71-tile-6', color: 'orange' },
      { id: 'l71-tile-7', color: 'grey' },
      { id: 'l71-tile-8', color: 'cyan' },
      { id: 'l71-tile-9', color: 'purple' },
      { id: 'l71-tile-10', color: 'grey' },
      { id: 'l71-tile-11', color: 'yellow' },
      { id: 'l71-tile-12', color: 'grey' },
      { id: 'l71-tile-13', color: 'lime' },
      { id: 'l71-tile-14', color: 'grey' },
      { id: 'l71-tile-15', color: 'cyan', number: 5, allowedColors: ['cyan', 'lime'] },
      { id: 'l71-tile-16', color: 'orange' },
      { id: 'l71-tile-17', color: 'indigo' },
      { id: 'l71-tile-18', color: 'grey' },
      { id: 'l71-tile-19', color: 'cyan' },
      { id: 'l71-tile-20', color: 'grey' },
      { id: 'l71-tile-21', color: 'grey' },
      { id: 'l71-tile-22', color: 'purple' },
      { id: 'l71-tile-23', color: 'indigo', number: 4, allowedColors: ['indigo', 'purple'] },
      { id: 'l71-tile-24', color: 'grey' },
      { id: 'l71-tile-25', color: 'lime' },
    ],
  },
  {
    id: 72,
    title: 'Level 72',
    gridSize: 5,
    initialTiles: [
      { id: 'l72-tile-1', color: 'red' },
      { id: 'l72-tile-2', color: 'grey' },
      { id: 'l72-tile-3', color: 'lime' },
      { id: 'l72-tile-4', color: 'grey' },
      { id: 'l72-tile-5', color: 'pink' },
      { id: 'l72-tile-6', color: 'grey' },
      { id: 'l72-tile-7', color: 'amber', number: 5, allowedColors: ['amber', 'red', 'charcoal'] },
      { id: 'l72-tile-8', color: 'charcoal' },
      { id: 'l72-tile-9', color: 'grey' },
      { id: 'l72-tile-10', color: 'blue' },
      { id: 'l72-tile-11', color: 'joker', isJoker: true },
      { id: 'l72-tile-12', color: 'amber' },
      { id: 'l72-tile-13', color: 'grey' },
      { id: 'l72-tile-14', color: 'pink' },
      { id: 'l72-tile-15', color: 'grey' },
      { id: 'l72-tile-16', color: 'grey' },
      { id: 'l72-tile-17', color: 'charcoal' },
      { id: 'l72-tile-18', color: 'grey' },
      { id: 'l72-tile-19', color: 'blue', number: 5, allowedColors: ['blue', 'pink', 'lime'] },
      { id: 'l72-tile-20', color: 'grey' },
      { id: 'l72-tile-21', color: 'red' },
      { id: 'l72-tile-22', color: 'grey' },
      { id: 'l72-tile-23', color: 'lime' },
      { id: 'l72-tile-24', color: 'grey' },
      { id: 'l72-tile-25', color: 'blue' },
    ],
  },
  {
    id: 73,
    title: 'Level 73',
    gridSize: 5,
    initialTiles: [
      { id: 'l73-tile-1', color: 'indigo' },
      { id: 'l73-tile-2', color: 'grey' },
      { id: 'l73-tile-3', color: 'yellow' },
      { id: 'l73-tile-4', color: 'pink', number: 4, allowedColors: ['pink', 'indigo'] },
      { id: 'l73-tile-5', color: 'grey' },
      { id: 'l73-tile-6', color: 'grey' },
      { id: 'l73-tile-7', color: 'pink' },
      { id: 'l73-tile-8', color: 'grey' },
      { id: 'l73-tile-9', color: 'amber' },
      { id: 'l73-tile-10', color: 'grey' },
      { id: 'l73-tile-11', color: 'green' },
      { id: 'l73-tile-12', color: 'grey' },
      { id: 'l73-tile-13', color: 'red' },
      { id: 'l73-tile-14', color: 'grey' },
      { id: 'l73-tile-15', color: 'orange' },
      { id: 'l73-tile-16', color: 'grey' },
      { id: 'l73-tile-17', color: 'green', number: 4, allowedColors: ['green', 'yellow'] },
      { id: 'l73-tile-18', color: 'grey' },
      { id: 'l73-tile-19', color: 'indigo' },
      { id: 'l73-tile-20', color: 'grey' },
      { id: 'l73-tile-21', color: 'yellow' },
      { id: 'l73-tile-22', color: 'grey' },
      { id: 'l73-tile-23', color: 'amber' },
      { id: 'l73-tile-24', color: 'grey' },
      { id: 'l73-tile-25', color: 'orange', number: 5, allowedColors: ['orange', 'amber', 'red'] },
    ],
  },
  {
    id: 74,
    title: 'Level 74',
    gridSize: 5,
    initialTiles: [
      { id: 'l74-tile-1', color: 'grey' },
      { id: 'l74-tile-2', color: 'cyan' },
      { id: 'l74-tile-3', color: 'grey' },
      { id: 'l74-tile-4', color: 'lime', number: 5, allowedColors: ['lime', 'cyan', 'blue'] },
      { id: 'l74-tile-5', color: 'grey' },
      { id: 'l74-tile-6', color: 'purple' },
      { id: 'l74-tile-7', color: 'grey' },
      { id: 'l74-tile-8', color: 'blue' },
      { id: 'l74-tile-9', color: 'grey' },
      { id: 'l74-tile-10', color: 'lime' },
      { id: 'l74-tile-11', color: 'grey' },
      { id: 'l74-tile-12', color: 'charcoal', number: 5, allowedColors: ['charcoal', 'purple', 'indigo'] },
      { id: 'l74-tile-13', color: 'grey' },
      { id: 'l74-tile-14', color: 'indigo' },
      { id: 'l74-tile-15', color: 'grey' },
      { id: 'l74-tile-16', color: 'charcoal' },
      { id: 'l74-tile-17', color: 'grey' },
      { id: 'l74-tile-18', color: 'blue' },
      { id: 'l74-tile-19', color: 'grey' },
      { id: 'l74-tile-20', color: 'purple' },
      { id: 'l74-tile-21', color: 'grey' },
      { id: 'l74-tile-22', color: 'cyan' },
      { id: 'l74-tile-23', color: 'grey' },
      { id: 'l74-tile-24', color: 'joker', isJoker: true },
      { id: 'l74-tile-25', color: 'grey' },
    ],
  },
  {
    id: 75,
    title: 'Level 75',
    gridSize: 5,
    initialTiles: [
      { id: 'l75-tile-1', color: 'amber' },
      { id: 'l75-tile-2', color: 'grey' },
      { id: 'l75-tile-3', color: 'green' },
      { id: 'l75-tile-4', color: 'grey' },
      { id: 'l75-tile-5', color: 'orange' },
      { id: 'l75-tile-6', color: 'red', number: 6, allowedColors: ['red', 'amber', 'orange'] },
      { id: 'l75-tile-7', color: 'grey' },
      { id: 'l75-tile-8', color: 'lime' },
      { id: 'l75-tile-9', color: 'grey' },
      { id: 'l75-tile-10', color: 'red' },
      { id: 'l75-tile-11', color: 'grey' },
      { id: 'l75-tile-12', color: 'orange' },
      { id: 'l75-tile-13', color: 'joker', isJoker: true },
      { id: 'l75-tile-14', color: 'cyan' },
      { id: 'l75-tile-15', color: 'grey' },
      { id: 'l75-tile-16', color: 'red' },
      { id: 'l75-tile-17', color: 'grey' },
      { id: 'l75-tile-18', color: 'green' },
      { id: 'l75-tile-19', color: 'grey' },
      { id: 'l75-tile-20', color: 'cyan', number: 6, allowedColors: ['cyan', 'green', 'lime'] },
      { id: 'l75-tile-21', color: 'grey' },
      { id: 'l75-tile-22', color: 'amber' },
      { id: 'l75-tile-23', color: 'grey' },
      { id: 'l75-tile-24', color: 'lime' },
      { id: 'l75-tile-25', color: 'grey' },
    ],
  },
  {
    id: 76,
    title: 'Level 76',
    gridSize: 6,
    initialTiles: [
      { id: 'l76-tile-1', color: 'grey' },
      { id: 'l76-tile-2', color: 'orange' },
      { id: 'l76-tile-3', color: 'grey' },
      { id: 'l76-tile-4', color: 'indigo' },
      { id: 'l76-tile-5', color: 'grey' },
      { id: 'l76-tile-6', color: 'purple' },
      { id: 'l76-tile-7', color: 'lime' },
      { id: 'l76-tile-8', color: 'grey' },
      { id: 'l76-tile-9', color: 'yellow', number: 5, allowedColors: ['yellow', 'orange', 'lime'] },
      { id: 'l76-tile-10', color: 'grey' },
      { id: 'l76-tile-11', color: 'cyan' },
      { id: 'l76-tile-12', color: 'grey' },
      { id: 'l76-tile-13', color: 'grey' },
      { id: 'l76-tile-14', color: 'yellow' },
      { id: 'l76-tile-15', color: 'grey' },
      { id: 'l76-tile-16', color: 'blue' },
      { id: 'l76-tile-17', color: 'grey' },
      { id: 'l76-tile-18', color: 'red' },
      { id: 'l76-tile-19', color: 'orange' },
      { id: 'l76-tile-20', color: 'grey' },
      { id: 'l76-tile-21', color: 'indigo' },
      { id: 'l76-tile-22', color: 'grey' },
      { id: 'l76-tile-23', color: 'pink', number: 5, allowedColors: ['pink', 'purple', 'red'] },
      { id: 'l76-tile-24', color: 'grey' },
      { id: 'l76-tile-25', color: 'grey' },
      { id: 'l76-tile-26', color: 'blue', number: 6, allowedColors: ['blue', 'indigo', 'cyan'] },
      { id: 'l76-tile-27', color: 'grey' },
      { id: 'l76-tile-28', color: 'purple' },
      { id: 'l76-tile-29', color: 'grey' },
      { id: 'l76-tile-30', color: 'pink' },
      { id: 'l76-tile-31', color: 'cyan' },
      { id: 'l76-tile-32', color: 'grey' },
      { id: 'l76-tile-33', color: 'blue' },
      { id: 'l76-tile-34', color: 'grey' },
      { id: 'l76-tile-35', color: 'red' },
      { id: 'l76-tile-36', color: 'grey' },
    ],
  },
  {
    id: 77,
    title: 'Level 77',
    gridSize: 6,
    initialTiles: [
      { id: 'l77-tile-1', color: 'charcoal' },
      { id: 'l77-tile-2', color: 'grey' },
      { id: 'l77-tile-3', color: 'lime' },
      { id: 'l77-tile-4', color: 'grey' },
      { id: 'l77-tile-5', color: 'amber', number: 6, allowedColors: ['amber', 'charcoal', 'yellow'] },
      { id: 'l77-tile-6', color: 'grey' },
      { id: 'l77-tile-7', color: 'grey' },
      { id: 'l77-tile-8', color: 'yellow' },
      { id: 'l77-tile-9', color: 'grey' },
      { id: 'l77-tile-10', color: 'blue' },
      { id: 'l77-tile-11', color: 'grey' },
      { id: 'l77-tile-12', color: 'amber' },
      { id: 'l77-tile-13', color: 'cyan' },
      { id: 'l77-tile-14', color: 'green', number: 5, allowedColors: ['green', 'lime', 'cyan'] },
      { id: 'l77-tile-15', color: 'grey' },
      { id: 'l77-tile-16', color: 'purple' },
      { id: 'l77-tile-17', color: 'grey' },
      { id: 'l77-tile-18', color: 'charcoal' },
      { id: 'l77-tile-19', color: 'grey' },
      { id: 'l77-tile-20', color: 'green' },
      { id: 'l77-tile-21', color: 'grey' },
      { id: 'l77-tile-22', color: 'indigo' },
      { id: 'l77-tile-23', color: 'grey' },
      { id: 'l77-tile-24', color: 'blue' },
      { id: 'l77-tile-25', color: 'lime' },
      { id: 'l77-tile-26', color: 'grey' },
      { id: 'l77-tile-27', color: 'yellow' },
      { id: 'l77-tile-28', color: 'grey' },
      { id: 'l77-tile-29', color: 'purple' },
      { id: 'l77-tile-30', color: 'grey' },
      { id: 'l77-tile-31', color: 'grey' },
      { id: 'l77-tile-32', color: 'cyan' },
      { id: 'l77-tile-33', color: 'grey' },
      { id: 'l77-tile-34', color: 'indigo', number: 6, allowedColors: ['indigo', 'blue', 'purple'] },
      { id: 'l77-tile-35', color: 'grey' },
      { id: 'l77-tile-36', color: 'indigo' },
    ],
  },
  {
    id: 78,
    title: 'Level 78',
    gridSize: 6,
    initialTiles: [
      { id: 'l78-tile-1', color: 'grey' },
      { id: 'l78-tile-2', color: 'red' },
      { id: 'l78-tile-3', color: 'grey' },
      { id: 'l78-tile-4', color: 'cyan' },
      { id: 'l78-tile-5', color: 'orange', number: 6, allowedColors: ['orange', 'red', 'pink'] },
      { id: 'l78-tile-6', color: 'grey' },
      { id: 'l78-tile-7', color: 'pink' },
      { id: 'l78-tile-8', color: 'grey' },
      { id: 'l78-tile-9', color: 'indigo' },
      { id: 'l78-tile-10', color: 'grey' },
      { id: 'l78-tile-11', color: 'red' },
      { id: 'l78-tile-12', color: 'grey' },
      { id: 'l78-tile-13', color: 'grey' },
      { id: 'l78-tile-14', color: 'orange' },
      { id: 'l78-tile-15', color: 'grey' },
      { id: 'l78-tile-16', color: 'blue' },
      { id: 'l78-tile-17', color: 'grey' },
      { id: 'l78-tile-18', color: 'joker', isJoker: true },
      { id: 'l78-tile-19', color: 'pink' },
      { id: 'l78-tile-20', color: 'grey' },
      { id: 'l78-tile-21', color: 'charcoal' },
      { id: 'l78-tile-22', color: 'grey' },
      { id: 'l78-tile-23', color: 'indigo' },
      { id: 'l78-tile-24', color: 'grey' },
      { id: 'l78-tile-25', color: 'grey' },
      { id: 'l78-tile-26', color: 'charcoal', number: 7, allowedColors: ['charcoal', 'cyan', 'indigo', 'blue'] },
      { id: 'l78-tile-27', color: 'grey' },
      { id: 'l78-tile-28', color: 'cyan' },
      { id: 'l78-tile-29', color: 'grey' },
      { id: 'l78-tile-30', color: 'blue' },
      { id: 'l78-tile-31', color: 'charcoal' },
      { id: 'l78-tile-32', color: 'grey' },
      { id: 'l78-tile-33', color: 'red' },
      { id: 'l78-tile-34', color: 'grey' },
      { id: 'l78-tile-35', color: 'charcoal' },
      { id: 'l78-tile-36', color: 'grey' },
    ],
  },
  {
    id: 79,
    title: 'Level 79',
    gridSize: 6,
    initialTiles: [
      { id: 'l79-tile-1', color: 'green' },
      { id: 'l79-tile-2', color: 'grey' },
      { id: 'l79-tile-3', color: 'amber' },
      { id: 'l79-tile-4', color: 'joker', isJoker: true },
      { id: 'l79-tile-5', color: 'grey' },
      { id: 'l79-tile-6', color: 'pink' },
      { id: 'l79-tile-7', color: 'grey' },
      { id: 'l79-tile-8', color: 'lime', number: 5, allowedColors: ['lime', 'green'] },
      { id: 'l79-tile-9', color: 'grey' },
      { id: 'l79-tile-10', color: 'orange' },
      { id: 'l79-tile-11', color: 'grey' },
      { id: 'l79-tile-12', color: 'indigo' },
      { id: 'l79-tile-13', color: 'lime' },
      { id: 'l79-tile-14', color: 'grey' },
      { id: 'l79-tile-15', color: 'green' },
      { id: 'l79-tile-16', color: 'grey' },
      { id: 'l79-tile-17', color: 'yellow', number: 6, allowedColors: ['yellow', 'amber', 'orange'] },
      { id: 'l79-tile-18', color: 'grey' },
      { id: 'l79-tile-19', color: 'grey' },
      { id: 'l79-tile-20', color: 'lime' },
      { id: 'l79-tile-21', color: 'grey' },
      { id: 'l79-tile-22', color: 'yellow' },
      { id: 'l79-tile-23', color: 'grey' },
      { id: 'l79-tile-24', color: 'purple' },
      { id: 'l79-tile-25', color: 'amber' },
      { id: 'l79-tile-26', color: 'grey' },
      { id: 'l79-tile-27', color: 'orange' },
      { id: 'l79-tile-28', color: 'purple', number: 6, allowedColors: ['purple', 'pink', 'indigo'] },
      { id: 'l79-tile-29', color: 'grey' },
      { id: 'l79-tile-30', color: 'pink' },
      { id: 'l79-tile-31', color: 'grey' },
      { id: 'l79-tile-32', color: 'yellow' },
      { id: 'l79-tile-33', color: 'grey' },
      { id: 'l79-tile-34', color: 'indigo' },
      { id: 'l79-tile-35', color: 'grey' },
      { id: 'l79-tile-36', color: 'purple' },
    ],
  },
  {
    id: 80,
    title: 'Level 80',
    gridSize: 6,
    initialTiles: [
      { id: 'l80-tile-1', color: 'blue' },
      { id: 'l80-tile-2', color: 'grey' },
      { id: 'l80-tile-3', color: 'cyan', number: 7, allowedColors: ['cyan', 'blue', 'charcoal'] },
      { id: 'l80-tile-4', color: 'grey' },
      { id: 'l80-tile-5', color: 'orange' },
      { id: 'l80-tile-6', color: 'joker', isJoker: true },
      { id: 'l80-tile-7', color: 'grey' },
      { id: 'l80-tile-8', color: 'charcoal' },
      { id: 'l80-tile-9', color: 'grey' },
      { id: 'l80-tile-10', color: 'amber' },
      { id: 'l80-tile-11', color: 'grey' },
      { id: 'l80-tile-12', color: 'lime' },
      { id: 'l80-tile-13', color: 'cyan' },
      { id: 'l80-tile-14', color: 'grey' },
      { id: 'l80-tile-15', color: 'blue' },
      { id: 'l80-tile-16', color: 'grey' },
      { id: 'l80-tile-17', color: 'yellow' },
      { id: 'l80-tile-18', color: 'grey' },
      { id: 'l80-tile-19', color: 'grey' },
      { id: 'l80-tile-20', color: 'red', number: 7, allowedColors: ['red', 'orange', 'amber'] },
      { id: 'l80-tile-21', color: 'grey' },
      { id: 'l80-tile-22', color: 'red' },
      { id: 'l80-tile-23', color: 'grey' },
      { id: 'l80-tile-24', color: 'green' },
      { id: 'l80-tile-25', color: 'charcoal' },
      { id: 'l80-tile-26', color: 'grey' },
      { id: 'l80-tile-27', color: 'orange' },
      { id: 'l80-tile-28', color: 'grey' },
      { id: 'l80-tile-29', color: 'green', number: 6, allowedColors: ['green', 'lime', 'yellow'] },
      { id: 'l80-tile-30', color: 'grey' },
      { id: 'l80-tile-31', color: 'grey' },
      { id: 'l80-tile-32', color: 'joker', isJoker: true },
      { id: 'l80-tile-33', color: 'amber' },
      { id: 'l80-tile-34', color: 'grey' },
      { id: 'l80-tile-35', color: 'lime' },
      { id: 'l80-tile-36', color: 'green' },
    ],
  },
  {
    id: 81,
    title: 'Level 81',
    gridSize: 6,
    initialTiles: [
      { id: 'l81-tile-1', color: 'purple' },
      { id: 'l81-tile-2', color: 'grey' },
      { id: 'l81-tile-3', color: 'red' },
      { id: 'l81-tile-4', color: 'grey' },
      { id: 'l81-tile-5', color: 'green' },
      { id: 'l81-tile-6', color: 'grey' },
      { id: 'l81-tile-7', color: 'grey' },
      { id: 'l81-tile-8', color: 'blue' },
      { id: 'l81-tile-9', color: 'grey' },
      { id: 'l81-tile-10', color: 'indigo', number: 6, allowedColors: ['indigo', 'purple', 'blue'] },
      { id: 'l81-tile-11', color: 'grey' },
      { id: 'l81-tile-12', color: 'cyan' },
      { id: 'l81-tile-13', color: 'indigo' },
      { id: 'l81-tile-14', color: 'grey' },
      { id: 'l81-tile-15', color: 'amber' },
      { id: 'l81-tile-16', color: 'grey' },
      { id: 'l81-tile-17', color: 'yellow' },
      { id: 'l81-tile-18', color: 'grey' },
      { id: 'l81-tile-19', color: 'grey' },
      { id: 'l81-tile-20', color: 'purple' },
      { id: 'l81-tile-21', color: 'grey' },
      { id: 'l81-tile-22', color: 'red' },
      { id: 'l81-tile-23', color: 'grey' },
      { id: 'l81-tile-24', color: 'pink', number: 6, allowedColors: ['pink', 'red', 'amber'] },
      { id: 'l81-tile-25', color: 'lime' },
      { id: 'l81-tile-26', color: 'lime', number: 7, allowedColors: ['lime', 'green', 'cyan', 'yellow'] },
      { id: 'l81-tile-27', color: 'grey' },
      { id: 'l81-tile-28', color: 'blue' },
      { id: 'l81-tile-29', color: 'grey' },
      { id: 'l81-tile-30', color: 'pink' },
      { id: 'l81-tile-31', color: 'grey' },
      { id: 'l81-tile-32', color: 'green' },
      { id: 'l81-tile-33', color: 'grey' },
      { id: 'l81-tile-34', color: 'cyan' },
      { id: 'l81-tile-35', color: 'grey' },
      { id: 'l81-tile-36', color: 'yellow' },
    ],
  },
  {
    id: 82,
    title: 'Level 82',
    gridSize: 6,
    initialTiles: [
      { id: 'l82-tile-1', color: 'amber' },
      { id: 'l82-tile-2', color: 'grey' },
      { id: 'l82-tile-3', color: 'cyan' },
      { id: 'l82-tile-4', color: 'charcoal', number: 6, allowedColors: ['charcoal', 'amber', 'orange'] },
      { id: 'l82-tile-5', color: 'grey' },
      { id: 'l82-tile-6', color: 'pink' },
      { id: 'l82-tile-7', color: 'grey' },
      { id: 'l82-tile-8', color: 'orange' },
      { id: 'l82-tile-9', color: 'grey' },
      { id: 'l82-tile-10', color: 'indigo' },
      { id: 'l82-tile-11', color: 'grey' },
      { id: 'l82-tile-12', color: 'red' },
      { id: 'l82-tile-13', color: 'charcoal' },
      { id: 'l82-tile-14', color: 'grey' },
      { id: 'l82-tile-15', color: 'blue', number: 7, allowedColors: ['blue', 'cyan', 'indigo'] },
      { id: 'l82-tile-16', color: 'grey' },
      { id: 'l82-tile-17', color: 'blue' },
      { id: 'l82-tile-18', color: 'grey' },
      { id: 'l82-tile-19', color: 'grey' },
      { id: 'l82-tile-20', color: 'amber' },
      { id: 'l82-tile-21', color: 'grey' },
      { id: 'l82-tile-22', color: 'joker', isJoker: true },
      { id: 'l82-tile-23', color: 'grey' },
      { id: 'l82-tile-24', color: 'purple' },
      { id: 'l82-tile-25', color: 'orange' },
      { id: 'l82-tile-26', color: 'grey' },
      { id: 'l82-tile-27', color: 'cyan' },
      { id: 'l82-tile-28', color: 'grey' },
      { id: 'l82-tile-29', color: 'pink' },
      { id: 'l82-tile-30', color: 'grey' },
      { id: 'l82-tile-31', color: 'grey' },
      { id: 'l82-tile-32', color: 'charcoal' },
      { id: 'l82-tile-33', color: 'purple', number: 6, allowedColors: ['purple', 'pink', 'red'] },
      { id: 'l82-tile-34', color: 'grey' },
      { id: 'l82-tile-35', color: 'indigo' },
      { id: 'l82-tile-36', color: 'red' },
    ],
  },
  {
    id: 83,
    title: 'Level 83',
    gridSize: 6,
    initialTiles: [
      { id: 'l83-tile-1', color: 'yellow' },
      { id: 'l83-tile-2', color: 'grey' },
      { id: 'l83-tile-3', color: 'cyan' },
      { id: 'l83-tile-4', color: 'grey' },
      { id: 'l83-tile-5', color: 'pink' },
      { id: 'l83-tile-6', color: 'orange', number: 7, allowedColors: ['orange', 'yellow', 'lime'] },
      { id: 'l83-tile-7', color: 'grey' },
      { id: 'l83-tile-8', color: 'lime' },
      { id: 'l83-tile-9', color: 'grey' },
      { id: 'l83-tile-10', color: 'charcoal' },
      { id: 'l83-tile-11', color: 'grey' },
      { id: 'l83-tile-12', color: 'indigo' },
      { id: 'l83-tile-13', color: 'orange' },
      { id: 'l83-tile-14', color: 'grey' },
      { id: 'l83-tile-15', color: 'green' },
      { id: 'l83-tile-16', color: 'grey' },
      { id: 'l83-tile-17', color: 'red' },
      { id: 'l83-tile-18', color: 'grey' },
      { id: 'l83-tile-19', color: 'grey' },
      { id: 'l83-tile-20', color: 'yellow' },
      { id: 'l83-tile-21', color: 'green', number: 7, allowedColors: ['green', 'cyan', 'charcoal'] },
      { id: 'l83-tile-22', color: 'grey' },
      { id: 'l83-tile-23', color: 'pink' },
      { id: 'l83-tile-24', color: 'grey' },
      { id: 'l83-tile-25', color: 'lime' },
      { id: 'l83-tile-26', color: 'grey' },
      { id: 'l83-tile-27', color: 'cyan' },
      { id: 'l83-tile-28', color: 'red', number: 6, allowedColors: ['red', 'pink', 'indigo'] },
      { id: 'l83-tile-29', color: 'grey' },
      { id: 'l83-tile-30', color: 'indigo' },
      { id: 'l83-tile-31', color: 'grey' },
      { id: 'l83-tile-32', color: 'orange' },
      { id: 'l83-tile-33', color: 'grey' },
      { id: 'l83-tile-34', color: 'charcoal' },
      { id: 'l83-tile-35', color: 'grey' },
      { id: 'l83-tile-36', color: 'green' },
    ],
  },
  {
    id: 84,
    title: 'Level 84',
    gridSize: 6,
    initialTiles: [
      { id: 'l84-tile-1', color: 'orange' },
      { id: 'l84-tile-2', color: 'joker', isJoker: true },
      { id: 'l84-tile-3', color: 'grey' },
      { id: 'l84-tile-4', color: 'lime' },
      { id: 'l84-tile-5', color: 'grey' },
      { id: 'l84-tile-6', color: 'purple' },
      { id: 'l84-tile-7', color: 'grey' },
      { id: 'l84-tile-8', color: 'red' },
      { id: 'l84-tile-9', color: 'grey' },
      { id: 'l84-tile-10', color: 'green' },
      { id: 'l84-tile-11', color: 'grey' },
      { id: 'l84-tile-12', color: 'pink' },
      { id: 'l84-tile-13', color: 'amber', number: 7, allowedColors: ['amber', 'orange', 'red', 'charcoal'] },
      { id: 'l84-tile-14', color: 'grey' },
      { id: 'l84-tile-15', color: 'charcoal' },
      { id: 'l84-tile-16', color: 'grey' },
      { id: 'l84-tile-17', color: 'cyan', number: 7, allowedColors: ['cyan', 'lime', 'green', 'blue'] },
      { id: 'l84-tile-18', color: 'grey' },
      { id: 'l84-tile-19', color: 'grey' },
      { id: 'l84-tile-20', color: 'amber' },
      { id: 'l84-tile-21', color: 'grey' },
      { id: 'l84-tile-22', color: 'blue' },
      { id: 'l84-tile-23', color: 'grey' },
      { id: 'l84-tile-24', color: 'indigo' },
      { id: 'l84-tile-25', color: 'orange' },
      { id: 'l84-tile-26', color: 'grey' },
      { id: 'l84-tile-27', color: 'lime' },
      { id: 'l84-tile-28', color: 'joker', isJoker: true },
      { id: 'l84-tile-29', color: 'grey' },
      { id: 'l84-tile-30', color: 'purple' },
      { id: 'l84-tile-31', color: 'grey' },
      { id: 'l84-tile-32', color: 'indigo', number: 7, allowedColors: ['indigo', 'purple', 'pink'] },
      { id: 'l84-tile-33', color: 'grey' },
      { id: 'l84-tile-34', color: 'cyan' },
      { id: 'l84-tile-35', color: 'grey' },
      { id: 'l84-tile-36', color: 'pink' },
    ],
  },
  {
    id: 85,
    title: 'Level 85',
    gridSize: 6,
    initialTiles: [
      { id: 'l85-tile-1', color: 'indigo' },
      { id: 'l85-tile-2', color: 'grey' },
      { id: 'l85-tile-3', color: 'orange' },
      { id: 'l85-tile-4', color: 'grey' },
      { id: 'l85-tile-5', color: 'amber' },
      { id: 'l85-tile-6', color: 'grey' },
      { id: 'l85-tile-7', color: 'grey' },
      { id: 'l85-tile-8', color: 'cyan' },
      { id: 'l85-tile-9', color: 'blue', number: 8, allowedColors: ['blue', 'indigo', 'cyan', 'charcoal'] },
      { id: 'l85-tile-10', color: 'grey' },
      { id: 'l85-tile-11', color: 'pink' },
      { id: 'l85-tile-12', color: 'grey' },
      { id: 'l85-tile-13', color: 'charcoal' },
      { id: 'l85-tile-14', color: 'grey' },
      { id: 'l85-tile-15', color: 'blue' },
      { id: 'l85-tile-16', color: 'grey' },
      { id: 'l85-tile-17', color: 'red' },
      { id: 'l85-tile-18', color: 'joker', isJoker: true },
      { id: 'l85-tile-19', color: 'joker', isJoker: true },
      { id: 'l85-tile-20', color: 'grey' },
      { id: 'l85-tile-21', color: 'indigo' },
      { id: 'l85-tile-22', color: 'grey' },
      { id: 'l85-tile-23', color: 'orange' },
      { id: 'l85-tile-24', color: 'grey' },
      { id: 'l85-tile-25', color: 'grey' },
      { id: 'l85-tile-26', color: 'cyan' },
      { id: 'l85-tile-27', color: 'grey' },
      { id: 'l85-tile-28', color: 'red', number: 8, allowedColors: ['red', 'orange', 'amber', 'pink'] },
      { id: 'l85-tile-29', color: 'grey' },
      { id: 'l85-tile-30', color: 'amber' },
      { id: 'l85-tile-31', color: 'charcoal' },
      { id: 'l85-tile-32', color: 'grey' },
      { id: 'l85-tile-33', color: 'blue' },
      { id: 'l85-tile-34', color: 'grey' },
      { id: 'l85-tile-35', color: 'pink' },
      { id: 'l85-tile-36', color: 'grey' },
    ],
  },
  {
    id: 86,
    title: 'Level 86',
    gridSize: 7,
    initialTiles: [
      { id: 'l86-tile-1', color: 'lime' },
      { id: 'l86-tile-2', color: 'grey' },
      { id: 'l86-tile-3', color: 'purple' },
      { id: 'l86-tile-4', color: 'grey' },
      { id: 'l86-tile-5', color: 'green' },
      { id: 'l86-tile-6', color: 'grey' },
      { id: 'l86-tile-7', color: 'amber' },
      { id: 'l86-tile-8', color: 'grey' },
      { id: 'l86-tile-9', color: 'amber' },
      { id: 'l86-tile-10', color: 'grey' },
      { id: 'l86-tile-11', color: 'yellow', number: 6, allowedColors: ['yellow', 'lime', 'amber'] },
      { id: 'l86-tile-12', color: 'grey' },
      { id: 'l86-tile-13', color: 'indigo' },
      { id: 'l86-tile-14', color: 'grey' },
      { id: 'l86-tile-15', color: 'yellow' },
      { id: 'l86-tile-16', color: 'grey' },
      { id: 'l86-tile-17', color: 'pink' },
      { id: 'l86-tile-18', color: 'grey' },
      { id: 'l86-tile-19', color: 'blue' },
      { id: 'l86-tile-20', color: 'grey' },
      { id: 'l86-tile-21', color: 'lime' },
      { id: 'l86-tile-22', color: 'grey' },
      { id: 'l86-tile-23', color: 'pink', number: 6, allowedColors: ['pink', 'purple', 'indigo'] },
      { id: 'l86-tile-24', color: 'grey' },
      { id: 'l86-tile-25', color: 'purple' },
      { id: 'l86-tile-26', color: 'grey' },
      { id: 'l86-tile-27', color: 'cyan' },
      { id: 'l86-tile-28', color: 'grey' },
      { id: 'l86-tile-29', color: 'yellow' },
      { id: 'l86-tile-30', color: 'grey' },
      { id: 'l86-tile-31', color: 'indigo' },
      { id: 'l86-tile-32', color: 'grey' },
      { id: 'l86-tile-33', color: 'green' },
      { id: 'l86-tile-34', color: 'grey' },
      { id: 'l86-tile-35', color: 'cyan' },
      { id: 'l86-tile-36', color: 'grey' },
      { id: 'l86-tile-37', color: 'lime' },
      { id: 'l86-tile-38', color: 'grey' },
      { id: 'l86-tile-39', color: 'pink' },
      { id: 'l86-tile-40', color: 'cyan', number: 7, allowedColors: ['cyan', 'green', 'blue'] },
      { id: 'l86-tile-41', color: 'grey' },
      { id: 'l86-tile-42', color: 'blue' },
      { id: 'l86-tile-43', color: 'grey' },
      { id: 'l86-tile-44', color: 'grey' },
      { id: 'l86-tile-45', color: 'purple' },
      { id: 'l86-tile-46', color: 'grey' },
      { id: 'l86-tile-47', color: 'green' },
      { id: 'l86-tile-48', color: 'grey' },
      { id: 'l86-tile-49', color: 'cyan' },
    ],
  },
  {
    id: 87,
    title: 'Level 87',
    gridSize: 7,
    initialTiles: [
      { id: 'l87-tile-1', color: 'amber' },
      { id: 'l87-tile-2', color: 'grey' },
      { id: 'l87-tile-3', color: 'green' },
      { id: 'l87-tile-4', color: 'grey' },
      { id: 'l87-tile-5', color: 'orange', number: 6, allowedColors: ['orange', 'amber', 'red'] },
      { id: 'l87-tile-6', color: 'grey' },
      { id: 'l87-tile-7', color: 'indigo' },
      { id: 'l87-tile-8', color: 'grey' },
      { id: 'l87-tile-9', color: 'joker', isJoker: true },
      { id: 'l87-tile-10', color: 'grey' },
      { id: 'l87-tile-11', color: 'red' },
      { id: 'l87-tile-12', color: 'grey' },
      { id: 'l87-tile-13', color: 'blue' },
      { id: 'l87-tile-14', color: 'grey' },
      { id: 'l87-tile-15', color: 'orange' },
      { id: 'l87-tile-16', color: 'grey' },
      { id: 'l87-tile-17', color: 'cyan' },
      { id: 'l87-tile-18', color: 'grey' },
      { id: 'l87-tile-19', color: 'charcoal' },
      { id: 'l87-tile-20', color: 'grey' },
      { id: 'l87-tile-21', color: 'amber' },
      { id: 'l87-tile-22', color: 'grey' },
      { id: 'l87-tile-23', color: 'yellow' },
      { id: 'l87-tile-24', color: 'grey' },
      { id: 'l87-tile-25', color: 'lime' },
      { id: 'l87-tile-26', color: 'grey' },
      { id: 'l87-tile-27', color: 'lime', number: 7, allowedColors: ['lime', 'green', 'cyan', 'yellow'] },
      { id: 'l87-tile-28', color: 'grey' },
      { id: 'l87-tile-29', color: 'red' },
      { id: 'l87-tile-30', color: 'grey' },
      { id: 'l87-tile-31', color: 'charcoal', number: 7, allowedColors: ['charcoal', 'indigo', 'blue'] },
      { id: 'l87-tile-32', color: 'grey' },
      { id: 'l87-tile-33', color: 'indigo' },
      { id: 'l87-tile-34', color: 'grey' },
      { id: 'l87-tile-35', color: 'orange' },
      { id: 'l87-tile-36', color: 'grey' },
      { id: 'l87-tile-37', color: 'green' },
      { id: 'l87-tile-38', color: 'grey' },
      { id: 'l87-tile-39', color: 'blue' },
      { id: 'l87-tile-40', color: 'grey' },
      { id: 'l87-tile-41', color: 'yellow' },
      { id: 'l87-tile-42', color: 'grey' },
      { id: 'l87-tile-43', color: 'cyan' },
      { id: 'l87-tile-44', color: 'grey' },
      { id: 'l87-tile-45', color: 'charcoal' },
      { id: 'l87-tile-46', color: 'grey' },
      { id: 'l87-tile-47', color: 'grey' },
      { id: 'l87-tile-48', color: 'grey' },
      { id: 'l87-tile-49', color: 'grey' },
    ],
  },
  {
    id: 88,
    title: 'Level 88',
    gridSize: 7,
    initialTiles: [
      { id: 'l88-tile-1', color: 'pink' },
      { id: 'l88-tile-2', color: 'grey' },
      { id: 'l88-tile-3', color: 'lime' },
      { id: 'l88-tile-4', color: 'grey' },
      { id: 'l88-tile-5', color: 'orange' },
      { id: 'l88-tile-6', color: 'grey' },
      { id: 'l88-tile-7', color: 'purple' },
      { id: 'l88-tile-8', color: 'grey' },
      { id: 'l88-tile-9', color: 'red' },
      { id: 'l88-tile-10', color: 'grey' },
      { id: 'l88-tile-11', color: 'cyan' },
      { id: 'l88-tile-12', color: 'grey' },
      { id: 'l88-tile-13', color: 'purple', number: 7, allowedColors: ['purple', 'pink', 'red', 'indigo'] },
      { id: 'l88-tile-14', color: 'grey' },
      { id: 'l88-tile-15', color: 'indigo' },
      { id: 'l88-tile-16', color: 'grey' },
      { id: 'l88-tile-17', color: 'yellow' },
      { id: 'l88-tile-18', color: 'grey' },
      { id: 'l88-tile-19', color: 'joker', isJoker: true },
      { id: 'l88-tile-20', color: 'grey' },
      { id: 'l88-tile-21', color: 'amber' },
      { id: 'l88-tile-22', color: 'grey' },
      { id: 'l88-tile-23', color: 'green' },
      { id: 'l88-tile-24', color: 'green', number: 7, allowedColors: ['green', 'lime', 'cyan'] },
      { id: 'l88-tile-25', color: 'grey' },
      { id: 'l88-tile-26', color: 'pink' },
      { id: 'l88-tile-27', color: 'grey' },
      { id: 'l88-tile-28', color: 'orange' },
      { id: 'l88-tile-29', color: 'red' },
      { id: 'l88-tile-30', color: 'grey' },
      { id: 'l88-tile-31', color: 'lime' },
      { id: 'l88-tile-32', color: 'grey' },
      { id: 'l88-tile-33', color: 'purple' },
      { id: 'l88-tile-34', color: 'grey' },
      { id: 'l88-tile-35', color: 'yellow' },
      { id: 'l88-tile-36', color: 'grey' },
      { id: 'l88-tile-37', color: 'amber', number: 7, allowedColors: ['amber', 'orange', 'yellow'] },
      { id: 'l88-tile-38', color: 'grey' },
      { id: 'l88-tile-39', color: 'cyan' },
      { id: 'l88-tile-40', color: 'grey' },
      { id: 'l88-tile-41', color: 'indigo' },
      { id: 'l88-tile-42', color: 'grey' },
      { id: 'l88-tile-43', color: 'amber' },
      { id: 'l88-tile-44', color: 'grey' },
      { id: 'l88-tile-45', color: 'green' },
      { id: 'l88-tile-46', color: 'grey' },
      { id: 'l88-tile-47', color: 'grey' },
      { id: 'l88-tile-48', color: 'grey' },
      { id: 'l88-tile-49', color: 'grey' },
    ],
  },
  {
    id: 89,
    title: 'Level 89',
    gridSize: 7,
    initialTiles: [
      { id: 'l89-tile-1', color: 'indigo' },
      { id: 'l89-tile-2', color: 'grey' },
      { id: 'l89-tile-3', color: 'orange' },
      { id: 'l89-tile-4', color: 'grey' },
      { id: 'l89-tile-5', color: 'lime' },
      { id: 'l89-tile-6', color: 'grey' },
      { id: 'l89-tile-7', color: 'amber' },
      { id: 'l89-tile-8', color: 'blue', number: 7, allowedColors: ['blue', 'indigo', 'cyan', 'charcoal'] },
      { id: 'l89-tile-9', color: 'grey' },
      { id: 'l89-tile-10', color: 'pink' },
      { id: 'l89-tile-11', color: 'grey' },
      { id: 'l89-tile-12', color: 'green' },
      { id: 'l89-tile-13', color: 'grey' },
      { id: 'l89-tile-14', color: 'cyan' },
      { id: 'l89-tile-15', color: 'grey' },
      { id: 'l89-tile-16', color: 'charcoal' },
      { id: 'l89-tile-17', color: 'grey' },
      { id: 'l89-tile-18', color: 'red' },
      { id: 'l89-tile-19', color: 'red', number: 7, allowedColors: ['red', 'orange', 'pink'] },
      { id: 'l89-tile-20', color: 'grey' },
      { id: 'l89-tile-21', color: 'yellow' },
      { id: 'l89-tile-22', color: 'grey' },
      { id: 'l89-tile-23', color: 'blue' },
      { id: 'l89-tile-24', color: 'grey' },
      { id: 'l89-tile-25', color: 'joker', isJoker: true },
      { id: 'l89-tile-26', color: 'grey' },
      { id: 'l89-tile-27', color: 'orange' },
      { id: 'l89-tile-28', color: 'grey' },
      { id: 'l89-tile-29', color: 'lime' },
      { id: 'l89-tile-30', color: 'grey' },
      { id: 'l89-tile-31', color: 'charcoal' },
      { id: 'l89-tile-32', color: 'grey' },
      { id: 'l89-tile-33', color: 'pink' },
      { id: 'l89-tile-34', color: 'grey' },
      { id: 'l89-tile-35', color: 'green' },
      { id: 'l89-tile-36', color: 'grey' },
      { id: 'l89-tile-37', color: 'indigo' },
      { id: 'l89-tile-38', color: 'yellow', number: 7, allowedColors: ['yellow', 'lime', 'green', 'amber'] },
      { id: 'l89-tile-39', color: 'grey' },
      { id: 'l89-tile-40', color: 'cyan' },
      { id: 'l89-tile-41', color: 'grey' },
      { id: 'l89-tile-42', color: 'blue' },
      { id: 'l89-tile-43', color: 'joker', isJoker: true },
      { id: 'l89-tile-44', color: 'grey' },
      { id: 'l89-tile-45', color: 'amber' },
      { id: 'l89-tile-46', color: 'grey' },
      { id: 'l89-tile-47', color: 'grey' },
      { id: 'l89-tile-48', color: 'grey' },
      { id: 'l89-tile-49', color: 'grey' },
    ],
  },
  {
    id: 90,
    title: 'Level 90',
    gridSize: 7,
    initialTiles: [
      { id: 'l90-tile-1', color: 'green' },
      { id: 'l90-tile-2', color: 'grey' },
      { id: 'l90-tile-3', color: 'cyan', number: 8, allowedColors: ['cyan', 'green', 'lime', 'blue'] },
      { id: 'l90-tile-4', color: 'grey' },
      { id: 'l90-tile-5', color: 'amber' },
      { id: 'l90-tile-6', color: 'grey' },
      { id: 'l90-tile-7', color: 'purple' },
      { id: 'l90-tile-8', color: 'grey' },
      { id: 'l90-tile-9', color: 'lime' },
      { id: 'l90-tile-10', color: 'grey' },
      { id: 'l90-tile-11', color: 'orange' },
      { id: 'l90-tile-12', color: 'grey' },
      { id: 'l90-tile-13', color: 'pink' },
      { id: 'l90-tile-14', color: 'grey' },
      { id: 'l90-tile-15', color: 'blue' },
      { id: 'l90-tile-16', color: 'grey' },
      { id: 'l90-tile-17', color: 'joker', isJoker: true },
      { id: 'l90-tile-18', color: 'grey' },
      { id: 'l90-tile-19', color: 'red' },
      { id: 'l90-tile-20', color: 'grey' },
      { id: 'l90-tile-21', color: 'cyan' },
      { id: 'l90-tile-22', color: 'grey' },
      { id: 'l90-tile-23', color: 'charcoal' },
      { id: 'l90-tile-24', color: 'grey' },
      { id: 'l90-tile-25', color: 'green' },
      { id: 'l90-tile-26', color: 'grey' },
      { id: 'l90-tile-27', color: 'amber' },
      { id: 'l90-tile-28', color: 'grey' },
      { id: 'l90-tile-29', color: 'charcoal', number: 7, allowedColors: ['charcoal', 'amber', 'orange'] },
      { id: 'l90-tile-30', color: 'grey' },
      { id: 'l90-tile-31', color: 'indigo' },
      { id: 'l90-tile-32', color: 'grey' },
      { id: 'l90-tile-33', color: 'indigo', number: 8, allowedColors: ['indigo', 'purple', 'pink', 'red'] },
      { id: 'l90-tile-34', color: 'grey' },
      { id: 'l90-tile-35', color: 'orange' },
      { id: 'l90-tile-36', color: 'grey' },
      { id: 'l90-tile-37', color: 'lime' },
      { id: 'l90-tile-38', color: 'grey' },
      { id: 'l90-tile-39', color: 'purple' },
      { id: 'l90-tile-40', color: 'grey' },
      { id: 'l90-tile-41', color: 'blue' },
      { id: 'l90-tile-42', color: 'grey' },
      { id: 'l90-tile-43', color: 'pink' },
      { id: 'l90-tile-44', color: 'grey' },
      { id: 'l90-tile-45', color: 'red' },
      { id: 'l90-tile-46', color: 'grey' },
      { id: 'l90-tile-47', color: 'grey' },
      { id: 'l90-tile-48', color: 'grey' },
      { id: 'l90-tile-49', color: 'grey' },
    ],
  },
  {
    id: 91,
    title: 'Level 91',
    gridSize: 7,
    initialTiles: [
      { id: 'l91-tile-1', color: 'yellow' },
      { id: 'l91-tile-2', color: 'grey' },
      { id: 'l91-tile-3', color: 'orange' },
      { id: 'l91-tile-4', color: 'grey' },
      { id: 'l91-tile-5', color: 'lime', number: 7, allowedColors: ['lime', 'yellow', 'cyan'] },
      { id: 'l91-tile-6', color: 'grey' },
      { id: 'l91-tile-7', color: 'purple' },
      { id: 'l91-tile-8', color: 'grey' },
      { id: 'l91-tile-9', color: 'cyan' },
      { id: 'l91-tile-10', color: 'grey' },
      { id: 'l91-tile-11', color: 'red' },
      { id: 'l91-tile-12', color: 'grey' },
      { id: 'l91-tile-13', color: 'charcoal' },
      { id: 'l91-tile-14', color: 'grey' },
      { id: 'l91-tile-15', color: 'lime' },
      { id: 'l91-tile-16', color: 'grey' },
      { id: 'l91-tile-17', color: 'amber' },
      { id: 'l91-tile-18', color: 'grey' },
      { id: 'l91-tile-19', color: 'pink' },
      { id: 'l91-tile-20', color: 'grey' },
      { id: 'l91-tile-21', color: 'indigo' },
      { id: 'l91-tile-22', color: 'amber', number: 7, allowedColors: ['amber', 'orange', 'red'] },
      { id: 'l91-tile-23', color: 'grey' },
      { id: 'l91-tile-24', color: 'yellow' },
      { id: 'l91-tile-25', color: 'grey' },
      { id: 'l91-tile-26', color: 'pink', number: 7, allowedColors: ['pink', 'purple', 'charcoal'] },
      { id: 'l91-tile-27', color: 'grey' },
      { id: 'l91-tile-28', color: 'green' },
      { id: 'l91-tile-29', color: 'grey' },
      { id: 'l91-tile-30', color: 'orange' },
      { id: 'l91-tile-31', color: 'grey' },
      { id: 'l91-tile-32', color: 'purple' },
      { id: 'l91-tile-33', color: 'grey' },
      { id: 'l91-tile-34', color: 'blue' },
      { id: 'l91-tile-35', color: 'grey' },
      { id: 'l91-tile-36', color: 'cyan' },
      { id: 'l91-tile-37', color: 'grey' },
      { id: 'l91-tile-38', color: 'red' },
      { id: 'l91-tile-39', color: 'grey' },
      { id: 'l91-tile-40', color: 'charcoal' },
      { id: 'l91-tile-41', color: 'grey' },
      { id: 'l91-tile-42', color: 'indigo' },
      { id: 'l91-tile-43', color: 'grey' },
      { id: 'l91-tile-44', color: 'blue', number: 7, allowedColors: ['blue', 'indigo', 'green'] },
      { id: 'l91-tile-45', color: 'grey' },
      { id: 'l91-tile-46', color: 'green' },
      { id: 'l91-tile-47', color: 'grey' },
      { id: 'l91-tile-48', color: 'grey' },
      { id: 'l91-tile-49', color: 'grey' },
    ],
  },
  {
    id: 92,
    title: 'Level 92',
    gridSize: 7,
    initialTiles: [
      { id: 'l92-tile-1', color: 'amber' },
      { id: 'l92-tile-2', color: 'grey' },
      { id: 'l92-tile-3', color: 'lime' },
      { id: 'l92-tile-4', color: 'grey' },
      { id: 'l92-tile-5', color: 'pink' },
      { id: 'l92-tile-6', color: 'joker', isJoker: true },
      { id: 'l92-tile-7', color: 'grey' },
      { id: 'l92-tile-8', color: 'grey' },
      { id: 'l92-tile-9', color: 'orange', number: 7, allowedColors: ['orange', 'amber', 'yellow', 'red'] },
      { id: 'l92-tile-10', color: 'grey' },
      { id: 'l92-tile-11', color: 'cyan' },
      { id: 'l92-tile-12', color: 'grey' },
      { id: 'l92-tile-13', color: 'indigo' },
      { id: 'l92-tile-14', color: 'grey' },
      { id: 'l92-tile-15', color: 'yellow' },
      { id: 'l92-tile-16', color: 'grey' },
      { id: 'l92-tile-17', color: 'charcoal' },
      { id: 'l92-tile-18', color: 'grey' },
      { id: 'l92-tile-19', color: 'blue' },
      { id: 'l92-tile-20', color: 'green', number: 8, allowedColors: ['green', 'lime', 'cyan', 'charcoal'] },
      { id: 'l92-tile-21', color: 'grey' },
      { id: 'l92-tile-22', color: 'red' },
      { id: 'l92-tile-23', color: 'grey' },
      { id: 'l92-tile-24', color: 'green' },
      { id: 'l92-tile-25', color: 'joker', isJoker: true },
      { id: 'l92-tile-26', color: 'grey' },
      { id: 'l92-tile-27', color: 'purple' },
      { id: 'l92-tile-28', color: 'grey' },
      { id: 'l92-tile-29', color: 'orange' },
      { id: 'l92-tile-30', color: 'grey' },
      { id: 'l92-tile-31', color: 'lime' },
      { id: 'l92-tile-32', color: 'grey' },
      { id: 'l92-tile-33', color: 'pink' },
      { id: 'l92-tile-34', color: 'grey' },
      { id: 'l92-tile-35', color: 'amber' },
      { id: 'l92-tile-36', color: 'purple', number: 8, allowedColors: ['purple', 'pink', 'indigo', 'blue'] },
      { id: 'l92-tile-37', color: 'grey' },
      { id: 'l92-tile-38', color: 'cyan' },
      { id: 'l92-tile-39', color: 'grey' },
      { id: 'l92-tile-40', color: 'indigo' },
      { id: 'l92-tile-41', color: 'grey' },
      { id: 'l92-tile-42', color: 'blue' },
      { id: 'l92-tile-43', color: 'charcoal' },
      { id: 'l92-tile-44', color: 'grey' },
      { id: 'l92-tile-45', color: 'grey' },
      { id: 'l92-tile-46', color: 'grey' },
      { id: 'l92-tile-47', color: 'grey' },
      { id: 'l92-tile-48', color: 'grey' },
      { id: 'l92-tile-49', color: 'grey' },
    ],
  },
  {
    id: 93,
    title: 'Level 93',
    gridSize: 7,
    initialTiles: [
      { id: 'l93-tile-1', color: 'pink' },
      { id: 'l93-tile-2', color: 'grey' },
      { id: 'l93-tile-3', color: 'blue' },
      { id: 'l93-tile-4', color: 'grey' },
      { id: 'l93-tile-5', color: 'green' },
      { id: 'l93-tile-6', color: 'red', number: 7, allowedColors: ['red', 'pink', 'orange'] },
      { id: 'l93-tile-7', color: 'grey' },
      { id: 'l93-tile-8', color: 'orange' },
      { id: 'l93-tile-9', color: 'grey' },
      { id: 'l93-tile-10', color: 'indigo' },
      { id: 'l93-tile-11', color: 'grey' },
      { id: 'l93-tile-12', color: 'yellow' },
      { id: 'l93-tile-13', color: 'grey' },
      { id: 'l93-tile-14', color: 'indigo' },
      { id: 'l93-tile-15', color: 'grey' },
      { id: 'l93-tile-16', color: 'charcoal', number: 8, allowedColors: ['charcoal', 'blue', 'indigo', 'cyan'] },
      { id: 'l93-tile-17', color: 'grey' },
      { id: 'l93-tile-18', color: 'cyan' },
      { id: 'l93-tile-19', color: 'grey' },
      { id: 'l93-tile-20', color: 'amber' },
      { id: 'l93-tile-21', color: 'grey' },
      { id: 'l93-tile-22', color: 'red' },
      { id: 'l93-tile-23', color: 'grey' },
      { id: 'l93-tile-24', color: 'charcoal' },
      { id: 'l93-tile-25', color: 'joker', isJoker: true },
      { id: 'l93-tile-26', color: 'grey' },
      { id: 'l93-tile-27', color: 'pink' },
      { id: 'l93-tile-28', color: 'grey' },
      { id: 'l93-tile-29', color: 'blue' },
      { id: 'l93-tile-30', color: 'grey' },
      { id: 'l93-tile-31', color: 'green' },
      { id: 'l93-tile-32', color: 'grey' },
      { id: 'l93-tile-33', color: 'lime', number: 8, allowedColors: ['lime', 'green', 'yellow', 'amber'] },
      { id: 'l93-tile-34', color: 'grey' },
      { id: 'l93-tile-35', color: 'purple' },
      { id: 'l93-tile-36', color: 'grey' },
      { id: 'l93-tile-37', color: 'orange' },
      { id: 'l93-tile-38', color: 'grey' },
      { id: 'l93-tile-39', color: 'cyan' },
      { id: 'l93-tile-40', color: 'grey' },
      { id: 'l93-tile-41', color: 'yellow' },
      { id: 'l93-tile-42', color: 'grey' },
      { id: 'l93-tile-43', color: 'charcoal' },
      { id: 'l93-tile-44', color: 'grey' },
      { id: 'l93-tile-45', color: 'purple', number: 7, allowedColors: ['purple', 'indigo', 'pink'] },
      { id: 'l93-tile-46', color: 'grey' },
      { id: 'l93-tile-47', color: 'amber' },
      { id: 'l93-tile-48', color: 'grey' },
      { id: 'l93-tile-49', color: 'grey' },
    ],
  },
  {
    id: 94,
    title: 'Level 94',
    gridSize: 7,
    initialTiles: [
      { id: 'l94-tile-1', color: 'amber' },
      { id: 'l94-tile-2', color: 'grey' },
      { id: 'l94-tile-3', color: 'blue' },
      { id: 'l94-tile-4', color: 'grey' },
      { id: 'l94-tile-5', color: 'red' },
      { id: 'l94-tile-6', color: 'grey' },
      { id: 'l94-tile-7', color: 'orange' },
      { id: 'l94-tile-8', color: 'yellow', number: 8, allowedColors: ['yellow', 'amber', 'orange', 'lime'] },
      { id: 'l94-tile-9', color: 'grey' },
      { id: 'l94-tile-10', color: 'charcoal' },
      { id: 'l94-tile-11', color: 'grey' },
      { id: 'l94-tile-12', color: 'purple' },
      { id: 'l94-tile-13', color: 'grey' },
      { id: 'l94-tile-14', color: 'lime' },
      { id: 'l94-tile-15', color: 'grey' },
      { id: 'l94-tile-16', color: 'green' },
      { id: 'l94-tile-17', color: 'grey' },
      { id: 'l94-tile-18', color: 'cyan', number: 8, allowedColors: ['cyan', 'blue', 'charcoal', 'green'] },
      { id: 'l94-tile-19', color: 'grey' },
      { id: 'l94-tile-20', color: 'indigo' },
      { id: 'l94-tile-21', color: 'grey' },
      { id: 'l94-tile-22', color: 'joker', isJoker: true },
      { id: 'l94-tile-23', color: 'grey' },
      { id: 'l94-tile-24', color: 'cyan' },
      { id: 'l94-tile-25', color: 'grey' },
      { id: 'l94-tile-26', color: 'pink' },
      { id: 'l94-tile-27', color: 'grey' },
      { id: 'l94-tile-28', color: 'amber' },
      { id: 'l94-tile-29', color: 'grey' },
      { id: 'l94-tile-30', color: 'blue' },
      { id: 'l94-tile-31', color: 'grey' },
      { id: 'l94-tile-32', color: 'red' },
      { id: 'l94-tile-33', color: 'joker', isJoker: true },
      { id: 'l94-tile-34', color: 'grey' },
      { id: 'l94-tile-35', color: 'orange' },
      { id: 'l94-tile-36', color: 'grey' },
      { id: 'l94-tile-37', color: 'pink', number: 8, allowedColors: ['pink', 'red', 'purple', 'indigo'] },
      { id: 'l94-tile-38', color: 'grey' },
      { id: 'l94-tile-39', color: 'charcoal' },
      { id: 'l94-tile-40', color: 'grey' },
      { id: 'l94-tile-41', color: 'lime' },
      { id: 'l94-tile-42', color: 'grey' },
      { id: 'l94-tile-43', color: 'green' },
      { id: 'l94-tile-44', color: 'grey' },
      { id: 'l94-tile-45', color: 'purple' },
      { id: 'l94-tile-46', color: 'grey' },
      { id: 'l94-tile-47', color: 'grey' },
      { id: 'l94-tile-48', color: 'grey' },
      { id: 'l94-tile-49', color: 'grey' },
    ],
  },
  {
    id: 95,
    title: 'Level 95',
    gridSize: 7,
    initialTiles: [
      { id: 'l95-tile-1', color: 'orange' },
      { id: 'l95-tile-2', color: 'grey' },
      { id: 'l95-tile-3', color: 'lime' },
      { id: 'l95-tile-4', color: 'amber', number: 8, allowedColors: ['amber', 'orange', 'red', 'charcoal'] },
      { id: 'l95-tile-5', color: 'grey' },
      { id: 'l95-tile-6', color: 'blue' },
      { id: 'l95-tile-7', color: 'grey' },
      { id: 'l95-tile-8', color: 'red' },
      { id: 'l95-tile-9', color: 'grey' },
      { id: 'l95-tile-10', color: 'cyan' },
      { id: 'l95-tile-11', color: 'grey' },
      { id: 'l95-tile-12', color: 'purple' },
      { id: 'l95-tile-13', color: 'joker', isJoker: true },
      { id: 'l95-tile-14', color: 'grey' },
      { id: 'l95-tile-15', color: 'charcoal' },
      { id: 'l95-tile-16', color: 'grey' },
      { id: 'l95-tile-17', color: 'yellow' },
      { id: 'l95-tile-18', color: 'grey' },
      { id: 'l95-tile-19', color: 'pink' },
      { id: 'l95-tile-20', color: 'grey' },
      { id: 'l95-tile-21', color: 'indigo' },
      { id: 'l95-tile-22', color: 'grey' },
      { id: 'l95-tile-23', color: 'green', number: 8, allowedColors: ['green', 'lime', 'cyan', 'yellow'] },
      { id: 'l95-tile-24', color: 'grey' },
      { id: 'l95-tile-25', color: 'amber' },
      { id: 'l95-tile-26', color: 'grey' },
      { id: 'l95-tile-27', color: 'indigo', number: 8, allowedColors: ['indigo', 'blue', 'purple', 'pink'] },
      { id: 'l95-tile-28', color: 'grey' },
      { id: 'l95-tile-29', color: 'orange' },
      { id: 'l95-tile-30', color: 'grey' },
      { id: 'l95-tile-31', color: 'lime' },
      { id: 'l95-tile-32', color: 'grey' },
      { id: 'l95-tile-33', color: 'blue' },
      { id: 'l95-tile-34', color: 'grey' },
      { id: 'l95-tile-35', color: 'red' },
      { id: 'l95-tile-36', color: 'grey' },
      { id: 'l95-tile-37', color: 'cyan' },
      { id: 'l95-tile-38', color: 'grey' },
      { id: 'l95-tile-39', color: 'joker', isJoker: true },
      { id: 'l95-tile-40', color: 'grey' },
      { id: 'l95-tile-41', color: 'charcoal' },
      { id: 'l95-tile-42', color: 'grey' },
      { id: 'l95-tile-43', color: 'orange', number: 7, allowedColors: ['orange', 'red', 'amber'] },
      { id: 'l95-tile-44', color: 'grey' },
      { id: 'l95-tile-45', color: 'purple' },
      { id: 'l95-tile-46', color: 'grey' },
      { id: 'l95-tile-47', color: 'grey' },
      { id: 'l95-tile-48', color: 'grey' },
      { id: 'l95-tile-49', color: 'grey' },
    ],
  },
  {
    id: 96,
    title: 'Level 96',
    gridSize: 7,
    initialTiles: [
      { id: 'l96-tile-1', color: 'cyan' },
      { id: 'l96-tile-2', color: 'grey' },
      { id: 'l96-tile-3', color: 'yellow' },
      { id: 'l96-tile-4', color: 'grey' },
      { id: 'l96-tile-5', color: 'purple' },
      { id: 'l96-tile-6', color: 'grey' },
      { id: 'l96-tile-7', color: 'blue' },
      { id: 'l96-tile-8', color: 'grey' },
      { id: 'l96-tile-9', color: 'indigo' },
      { id: 'l96-tile-10', color: 'grey' },
      { id: 'l96-tile-11', color: 'charcoal', number: 8, allowedColors: ['charcoal', 'cyan', 'blue', 'indigo'] },
      { id: 'l96-tile-12', color: 'grey' },
      { id: 'l96-tile-13', color: 'red' },
      { id: 'l96-tile-14', color: 'grey' },
      { id: 'l96-tile-15', color: 'lime', number: 8, allowedColors: ['lime', 'yellow', 'green', 'amber'] },
      { id: 'l96-tile-16', color: 'grey' },
      { id: 'l96-tile-17', color: 'green' },
      { id: 'l96-tile-18', color: 'grey' },
      { id: 'l96-tile-19', color: 'joker', isJoker: true },
      { id: 'l96-tile-20', color: 'grey' },
      { id: 'l96-tile-21', color: 'pink' },
      { id: 'l96-tile-22', color: 'grey' },
      { id: 'l96-tile-23', color: 'amber' },
      { id: 'l96-tile-24', color: 'grey' },
      { id: 'l96-tile-25', color: 'orange' },
      { id: 'l96-tile-26', color: 'grey' },
      { id: 'l96-tile-27', color: 'cyan' },
      { id: 'l96-tile-28', color: 'grey' },
      { id: 'l96-tile-29', color: 'charcoal' },
      { id: 'l96-tile-30', color: 'grey' },
      { id: 'l96-tile-31', color: 'purple' },
      { id: 'l96-tile-32', color: 'grey' },
      { id: 'l96-tile-33', color: 'lime' },
      { id: 'l96-tile-34', color: 'pink', number: 8, allowedColors: ['pink', 'purple', 'red', 'orange'] },
      { id: 'l96-tile-35', color: 'grey' },
      { id: 'l96-tile-36', color: 'blue', number: 7, allowedColors: ['blue', 'cyan', 'charcoal'] },
      { id: 'l96-tile-37', color: 'grey' },
      { id: 'l96-tile-38', color: 'joker', isJoker: true },
      { id: 'l96-tile-39', color: 'grey' },
      { id: 'l96-tile-40', color: 'yellow' },
      { id: 'l96-tile-41', color: 'grey' },
      { id: 'l96-tile-42', color: 'indigo' },
      { id: 'l96-tile-43', color: 'grey' },
      { id: 'l96-tile-44', color: 'red' },
      { id: 'l96-tile-45', color: 'grey' },
      { id: 'l96-tile-46', color: 'green' },
      { id: 'l96-tile-47', color: 'grey' },
      { id: 'l96-tile-48', color: 'grey' },
      { id: 'l96-tile-49', color: 'grey' },
    ],
  },
  {
    id: 97,
    title: 'Level 97',
    gridSize: 7,
    initialTiles: [
      { id: 'l97-tile-1', color: 'orange' },
      { id: 'l97-tile-2', color: 'grey' },
      { id: 'l97-tile-3', color: 'joker', isJoker: true },
      { id: 'l97-tile-4', color: 'grey' },
      { id: 'l97-tile-5', color: 'green' },
      { id: 'l97-tile-6', color: 'grey' },
      { id: 'l97-tile-7', color: 'indigo' },
      { id: 'l97-tile-8', color: 'grey' },
      { id: 'l97-tile-9', color: 'amber' },
      { id: 'l97-tile-10', color: 'grey' },
      { id: 'l97-tile-11', color: 'lime' },
      { id: 'l97-tile-12', color: 'grey' },
      { id: 'l97-tile-13', color: 'red', number: 8, allowedColors: ['red', 'orange', 'amber', 'pink'] },
      { id: 'l97-tile-14', color: 'grey' },
      { id: 'l97-tile-15', color: 'pink' },
      { id: 'l97-tile-16', color: 'grey' },
      { id: 'l97-tile-17', color: 'cyan', number: 8, allowedColors: ['cyan', 'green', 'lime', 'blue'] },
      { id: 'l97-tile-18', color: 'grey' },
      { id: 'l97-tile-19', color: 'charcoal' },
      { id: 'l97-tile-20', color: 'grey' },
      { id: 'l97-tile-21', color: 'yellow' },
      { id: 'l97-tile-22', color: 'grey' },
      { id: 'l97-tile-23', color: 'blue' },
      { id: 'l97-tile-24', color: 'grey' },
      { id: 'l97-tile-25', color: 'red' },
      { id: 'l97-tile-26', color: 'grey' },
      { id: 'l97-tile-27', color: 'joker', isJoker: true },
      { id: 'l97-tile-28', color: 'grey' },
      { id: 'l97-tile-29', color: 'purple', number: 8, allowedColors: ['purple', 'indigo', 'charcoal', 'pink'] },
      { id: 'l97-tile-30', color: 'grey' },
      { id: 'l97-tile-31', color: 'cyan' },
      { id: 'l97-tile-32', color: 'grey' },
      { id: 'l97-tile-33', color: 'lime' },
      { id: 'l97-tile-34', color: 'grey' },
      { id: 'l97-tile-35', color: 'orange' },
      { id: 'l97-tile-36', color: 'grey' },
      { id: 'l97-tile-37', color: 'indigo' },
      { id: 'l97-tile-38', color: 'grey' },
      { id: 'l97-tile-39', color: 'amber' },
      { id: 'l97-tile-40', color: 'yellow', number: 8, allowedColors: ['yellow', 'lime', 'amber', 'orange'] },
      { id: 'l97-tile-41', color: 'grey' },
      { id: 'l97-tile-42', color: 'green' },
      { id: 'l97-tile-43', color: 'charcoal' },
      { id: 'l97-tile-44', color: 'grey' },
      { id: 'l97-tile-45', color: 'blue' },
      { id: 'l97-tile-46', color: 'grey' },
      { id: 'l97-tile-47', color: 'grey' },
      { id: 'l97-tile-48', color: 'grey' },
      { id: 'l97-tile-49', color: 'grey' },
    ],
  },
  {
    id: 98,
    title: 'Level 98',
    gridSize: 7,
    initialTiles: [
      { id: 'l98-tile-1', color: 'purple' },
      { id: 'l98-tile-2', color: 'grey' },
      { id: 'l98-tile-3', color: 'orange' },
      { id: 'l98-tile-4', color: 'grey' },
      { id: 'l98-tile-5', color: 'indigo', number: 8, allowedColors: ['indigo', 'purple', 'blue', 'charcoal'] },
      { id: 'l98-tile-6', color: 'grey' },
      { id: 'l98-tile-7', color: 'lime' },
      { id: 'l98-tile-8', color: 'grey' },
      { id: 'l98-tile-9', color: 'joker', isJoker: true },
      { id: 'l98-tile-10', color: 'grey' },
      { id: 'l98-tile-11', color: 'red' },
      { id: 'l98-tile-12', color: 'grey' },
      { id: 'l98-tile-13', color: 'cyan' },
      { id: 'l98-tile-14', color: 'grey' },
      { id: 'l98-tile-15', color: 'blue' },
      { id: 'l98-tile-16', color: 'amber', number: 8, allowedColors: ['amber', 'orange', 'red', 'yellow'] },
      { id: 'l98-tile-17', color: 'grey' },
      { id: 'l98-tile-18', color: 'yellow' },
      { id: 'l98-tile-19', color: 'grey' },
      { id: 'l98-tile-20', color: 'pink' },
      { id: 'l98-tile-21', color: 'grey' },
      { id: 'l98-tile-22', color: 'charcoal' },
      { id: 'l98-tile-23', color: 'grey' },
      { id: 'l98-tile-24', color: 'green' },
      { id: 'l98-tile-25', color: 'grey' },
      { id: 'l98-tile-26', color: 'joker', isJoker: true },
      { id: 'l98-tile-27', color: 'grey' },
      { id: 'l98-tile-28', color: 'indigo' },
      { id: 'l98-tile-29', color: 'grey' },
      { id: 'l98-tile-30', color: 'amber' },
      { id: 'l98-tile-31', color: 'grey' },
      { id: 'l98-tile-32', color: 'blue' },
      { id: 'l98-tile-33', color: 'green', number: 8, allowedColors: ['green', 'lime', 'cyan', 'blue'] },
      { id: 'l98-tile-34', color: 'grey' },
      { id: 'l98-tile-35', color: 'purple' },
      { id: 'l98-tile-36', color: 'joker', isJoker: true },
      { id: 'l98-tile-37', color: 'grey' },
      { id: 'l98-tile-38', color: 'orange' },
      { id: 'l98-tile-39', color: 'grey' },
      { id: 'l98-tile-40', color: 'lime' },
      { id: 'l98-tile-41', color: 'grey' },
      { id: 'l98-tile-42', color: 'red' },
      { id: 'l98-tile-43', color: 'grey' },
      { id: 'l98-tile-44', color: 'pink', number: 8, allowedColors: ['pink', 'red', 'purple', 'indigo'] },
      { id: 'l98-tile-45', color: 'grey' },
      { id: 'l98-tile-46', color: 'cyan' },
      { id: 'l98-tile-47', color: 'grey' },
      { id: 'l98-tile-48', color: 'grey' },
      { id: 'l98-tile-49', color: 'grey' },
    ],
  },
  {
    id: 99,
    title: 'Level 99',
    gridSize: 7,
    initialTiles: [
      { id: 'l99-tile-1', color: 'amber' },
      { id: 'l99-tile-2', color: 'grey' },
      { id: 'l99-tile-3', color: 'indigo' },
      { id: 'l99-tile-4', color: 'grey' },
      { id: 'l99-tile-5', color: 'green' },
      { id: 'l99-tile-6', color: 'grey' },
      { id: 'l99-tile-7', color: 'yellow' },
      { id: 'l99-tile-8', color: 'charcoal', number: 8, allowedColors: ['charcoal', 'amber', 'indigo', 'cyan'] },
      { id: 'l99-tile-9', color: 'grey' },
      { id: 'l99-tile-10', color: 'cyan' },
      { id: 'l99-tile-11', color: 'grey' },
      { id: 'l99-tile-12', color: 'orange' },
      { id: 'l99-tile-13', color: 'lime', number: 8, allowedColors: ['lime', 'green', 'yellow', 'orange'] },
      { id: 'l99-tile-14', color: 'grey' },
      { id: 'l99-tile-15', color: 'grey' },
      { id: 'l99-tile-16', color: 'charcoal' },
      { id: 'l99-tile-17', color: 'grey' },
      { id: 'l99-tile-18', color: 'joker', isJoker: true },
      { id: 'l99-tile-19', color: 'grey' },
      { id: 'l99-tile-20', color: 'lime' },
      { id: 'l99-tile-21', color: 'grey' },
      { id: 'l99-tile-22', color: 'blue' },
      { id: 'l99-tile-23', color: 'grey' },
      { id: 'l99-tile-24', color: 'joker', isJoker: true },
      { id: 'l99-tile-25', color: 'grey' },
      { id: 'l99-tile-26', color: 'red' },
      { id: 'l99-tile-27', color: 'grey' },
      { id: 'l99-tile-28', color: 'cyan' },
      { id: 'l99-tile-29', color: 'grey' },
      { id: 'l99-tile-30', color: 'purple' },
      { id: 'l99-tile-31', color: 'grey' },
      { id: 'l99-tile-32', color: 'joker', isJoker: true },
      { id: 'l99-tile-33', color: 'grey' },
      { id: 'l99-tile-34', color: 'pink' },
      { id: 'l99-tile-35', color: 'grey' },
      { id: 'l99-tile-36', color: 'blue', number: 8, allowedColors: ['blue', 'cyan', 'purple', 'pink'] },
      { id: 'l99-tile-37', color: 'grey' },
      { id: 'l99-tile-38', color: 'amber' },
      { id: 'l99-tile-39', color: 'grey' },
      { id: 'l99-tile-40', color: 'orange' },
      { id: 'l99-tile-41', color: 'red', number: 8, allowedColors: ['red', 'orange', 'amber', 'pink'] },
      { id: 'l99-tile-42', color: 'grey' },
      { id: 'l99-tile-43', color: 'indigo' },
      { id: 'l99-tile-44', color: 'grey' },
      { id: 'l99-tile-45', color: 'purple' },
      { id: 'l99-tile-46', color: 'grey' },
      { id: 'l99-tile-47', color: 'grey' },
      { id: 'l99-tile-48', color: 'grey' },
      { id: 'l99-tile-49', color: 'grey' },
    ],
  },
  {
    id: 100,
    title: 'Level 100',
    gridSize: 7,
    initialTiles: [
      { id: 'l100-tile-1', color: 'orange' },
      { id: 'l100-tile-2', color: 'grey' },
      { id: 'l100-tile-3', color: 'green' },
      { id: 'l100-tile-4', color: 'red', number: 8, allowedColors: ['red', 'orange', 'amber', 'pink'] },
      { id: 'l100-tile-5', color: 'grey' },
      { id: 'l100-tile-6', color: 'indigo' },
      { id: 'l100-tile-7', color: 'pink' },
      { id: 'l100-tile-8', color: 'grey' },
      { id: 'l100-tile-9', color: 'amber' },
      { id: 'l100-tile-10', color: 'grey' },
      { id: 'l100-tile-11', color: 'joker', isJoker: true },
      { id: 'l100-tile-12', color: 'grey' },
      { id: 'l100-tile-13', color: 'cyan' },
      { id: 'l100-tile-14', color: 'grey' },
      { id: 'l100-tile-15', color: 'yellow' },
      { id: 'l100-tile-16', color: 'lime', number: 8, allowedColors: ['lime', 'green', 'yellow', 'cyan'] },
      { id: 'l100-tile-17', color: 'grey' },
      { id: 'l100-tile-18', color: 'red' },
      { id: 'l100-tile-19', color: 'grey' },
      { id: 'l100-tile-20', color: 'blue', number: 8, allowedColors: ['blue', 'indigo', 'purple', 'cyan'] },
      { id: 'l100-tile-21', color: 'grey' },
      { id: 'l100-tile-22', color: 'grey' },
      { id: 'l100-tile-23', color: 'lime' },
      { id: 'l100-tile-24', color: 'grey' },
      { id: 'l100-tile-25', color: 'joker', isJoker: true },
      { id: 'l100-tile-26', color: 'grey' },
      { id: 'l100-tile-27', color: 'purple' },
      { id: 'l100-tile-28', color: 'grey' },
      { id: 'l100-tile-29', color: 'charcoal' },
      { id: 'l100-tile-30', color: 'grey' },
      { id: 'l100-tile-31', color: 'indigo' },
      { id: 'l100-tile-32', color: 'grey' },
      { id: 'l100-tile-33', color: 'joker', isJoker: true },
      { id: 'l100-tile-34', color: 'grey' },
      { id: 'l100-tile-35', color: 'blue' },
      { id: 'l100-tile-36', color: 'grey' },
      { id: 'l100-tile-37', color: 'charcoal', number: 8, allowedColors: ['charcoal', 'indigo', 'blue', 'amber'] },
      { id: 'l100-tile-38', color: 'grey' },
      { id: 'l100-tile-39', color: 'pink' },
      { id: 'l100-tile-40', color: 'purple', number: 8, allowedColors: ['purple', 'pink', 'indigo', 'red'] },
      { id: 'l100-tile-41', color: 'grey' },
      { id: 'l100-tile-42', color: 'green' },
      { id: 'l100-tile-43', color: 'grey' },
      { id: 'l100-tile-44', color: 'amber' },
      { id: 'l100-tile-45', color: 'grey' },
      { id: 'l100-tile-46', color: 'cyan' },
      { id: 'l100-tile-47', color: 'grey' },
      { id: 'l100-tile-48', color: 'grey' },
      { id: 'l100-tile-49', color: 'grey' },
    ],
  },
];

// Move limits starting from Level 5, adjusted progressively with difficulty
const LEVEL_MAX_MOVES: Record<number, number> = {
  5: 10,
  6: 10,
  7: 10,
  8: 10,
  9: 10,
  10: 12,
  11: 10,
  12: 12,
  13: 12,
  14: 12,
  15: 12,
  16: 14,
  17: 12,
  18: 14,
  19: 12,
  20: 14,
  21: 12,
  22: 14,
  23: 12,
  24: 14,
  25: 12,
  26: 14,
  27: 14,
  28: 14,
  29: 12,
  30: 15,
  31: 12,
  32: 12,
  33: 14,
  34: 12,
  35: 14,
  36: 15,
  37: 14,
  38: 15,
  39: 14,
  40: 16,
  41: 14,
  42: 15,
  43: 14,
  44: 16,
  45: 18,
  46: 10,
  47: 10,
  48: 10,
  49: 12,
  50: 14,
  51: 12,
  52: 12,
  53: 12,
  54: 12,
  55: 15,
  56: 16,
  57: 15,
  58: 16,
  59: 16,
  60: 18,
  61: 10,
  62: 12,
  63: 14,
  64: 14,
  65: 15,
  66: 16,
  67: 18,
  68: 18,
  69: 22,
  70: 24,
  71: 24,
  72: 26,
  73: 26,
  74: 28,
  75: 28,
  76: 32,
  77: 32,
  78: 34,
  79: 34,
  80: 36,
  81: 36,
  82: 38,
  83: 38,
  84: 40,
  85: 42,
  86: 45,
  87: 46,
  88: 48,
  89: 48,
  90: 50,
  91: 50,
  92: 52,
  93: 54,
  94: 55,
  95: 56,
  96: 58,
  97: 60,
  98: 62,
  99: 65,
  100: 70,
};

const COLOR_HEX_MAP: Record<TileColor, string> = {
  red: '#EB5872',
  yellow: '#FFCE54',
  green: '#48CFAD',
  blue: '#4FC1E9',
  purple: '#7B79DB',
  orange: '#FC6E51',
  pink: '#EC87C0',
  cyan: '#3BC2A5',
  lime: '#A0D468',
  indigo: '#6366F1',
  amber: '#F59E0B',
  charcoal: '#475569',
  joker: '#FFAAA6',
  grey: '#ECEEF1',
};

const COLOR_SUBTLE_RGBA_MAP: Record<TileColor, string> = {
  red: 'rgba(235, 88, 114, 0.48)',
  yellow: 'rgba(255, 206, 84, 0.50)',
  green: 'rgba(72, 207, 173, 0.48)',
  blue: 'rgba(79, 193, 233, 0.48)',
  purple: 'rgba(123, 121, 219, 0.48)',
  orange: 'rgba(252, 110, 81, 0.48)',
  pink: 'rgba(236, 135, 192, 0.48)',
  cyan: 'rgba(59, 194, 165, 0.48)',
  lime: 'rgba(160, 212, 104, 0.50)',
  indigo: 'rgba(99, 102, 241, 0.48)',
  amber: 'rgba(245, 158, 11, 0.48)',
  charcoal: 'rgba(71, 85, 105, 0.52)',
  joker: 'rgba(255, 170, 166, 0.48)',
  grey: 'rgba(236, 238, 241, 0.48)',
};

const getSvgCornerRadius = (gridSize: number) => {
  if (gridSize === 2) return 18;
  if (gridSize === 3) return 14;
  if (gridSize === 4) return 10;
  if (gridSize === 5) return 8;
  if (gridSize === 6) return 6;
  return 5;
};

function getJokerAdjacentColors(
  index: number,
  tiles: Tile[],
  gridSize: number
): TileColor[] {
  // Find all connected joker / rainbow tiles in this connected cluster
  const visitedJokers = new Set<number>();
  const queue: number[] = [index];
  visitedJokers.add(index);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const row = Math.floor(current / gridSize);
    const col = current % gridSize;

    const neighbors = [
      row > 0 ? (row - 1) * gridSize + col : null,
      row < gridSize - 1 ? (row + 1) * gridSize + col : null,
      col > 0 ? row * gridSize + (col - 1) : null,
      col < gridSize - 1 ? row * gridSize + (col + 1) : null,
    ];

    for (const nIdx of neighbors) {
      if (nIdx !== null && !visitedJokers.has(nIdx)) {
        const nTile = tiles[nIdx];
        const isNeighborJoker = nTile.color === 'joker' || nTile.isJoker;
        if (isNeighborJoker) {
          visitedJokers.add(nIdx);
          queue.push(nIdx);
        }
      }
    }
  }

  // Collect all non-grey, non-joker colors adjacent to ANY joker in this cluster
  const colors: TileColor[] = [];
  for (const jIdx of visitedJokers) {
    const row = Math.floor(jIdx / gridSize);
    const col = jIdx % gridSize;
    const neighbors = [
      row > 0 ? (row - 1) * gridSize + col : null,
      row < gridSize - 1 ? (row + 1) * gridSize + col : null,
      col > 0 ? row * gridSize + (col - 1) : null,
      col < gridSize - 1 ? row * gridSize + (col + 1) : null,
    ];

    for (const nIdx of neighbors) {
      if (nIdx !== null) {
        const c = tiles[nIdx].color;
        const isJokerNeighbor = c === 'joker' || tiles[nIdx].isJoker;
        if (c !== 'grey' && !isJokerNeighbor && !colors.includes(c)) {
          colors.push(c);
        }
      }
    }
  }

  return colors;
}

function getTileBackgroundStyle(
  tile: Tile,
  jokerAdjacentColors: TileColor[]
): CSSProperties | undefined {
  // Multi-coloured number block (anchor) split styling
  if (tile.allowedColors && tile.allowedColors.length > 1) {
    if (tile.allowedColors.length === 2) {
      const c1 = COLOR_HEX_MAP[tile.allowedColors[0]];
      const c2 = COLOR_HEX_MAP[tile.allowedColors[1]];
      return {
        background: `linear-gradient(135deg, ${c1} 0%, ${c1} 50%, ${c2} 50%, ${c2} 100%)`,
      };
    }
    const stops = tile.allowedColors.flatMap((c, cIdx) => {
      const startPct = Math.round((cIdx / tile.allowedColors!.length) * 100);
      const endPct = Math.round(((cIdx + 1) / tile.allowedColors!.length) * 100);
      const hex = COLOR_HEX_MAP[c];
      return [`${hex} ${startPct}%`, `${hex} ${endPct}%`];
    });
    return {
      background: `linear-gradient(135deg, ${stops.join(', ')})`,
    };
  }

  const isJoker = tile.color === 'joker' || tile.isJoker;

  if (isJoker && jokerAdjacentColors.length > 0) {
    const rainbowBase =
      'linear-gradient(135deg, #FFAAA6 0%, #FFD3B5 25%, #DCEDC2 50%, #A8E6CF 75%, #C7CEEA 100%)';

    if (jokerAdjacentColors.length === 1) {
      const tint = COLOR_SUBTLE_RGBA_MAP[jokerAdjacentColors[0]];
      return {
        background: `linear-gradient(${tint}, ${tint}), ${rainbowBase}`,
      };
    }
    if (jokerAdjacentColors.length === 2) {
      const c1 = COLOR_SUBTLE_RGBA_MAP[jokerAdjacentColors[0]];
      const c2 = COLOR_SUBTLE_RGBA_MAP[jokerAdjacentColors[1]];
      const splitTint = `linear-gradient(135deg, ${c1} 0%, ${c1} 50%, ${c2} 50%, ${c2} 100%)`;
      return {
        background: `${splitTint}, ${rainbowBase}`,
      };
    }
    // 3 or more colors: split evenly
    const stops = jokerAdjacentColors.flatMap((c, cIdx) => {
      const startPct = Math.round((cIdx / jokerAdjacentColors.length) * 100);
      const endPct = Math.round(((cIdx + 1) / jokerAdjacentColors.length) * 100);
      const rgba = COLOR_SUBTLE_RGBA_MAP[c];
      return [`${rgba} ${startPct}%`, `${rgba} ${endPct}%`];
    });
    const multiTint = `linear-gradient(135deg, ${stops.join(', ')})`;
    return {
      background: `${multiTint}, ${rainbowBase}`,
    };
  }

  return undefined;
}

function getConnectedComponentForAnchor(
  anchorIdx: number,
  tiles: Tile[],
  gridSize: number
): { indices: number[]; colors: TileColor[] } | null {
  const anchor = tiles[anchorIdx];
  const targetSize = anchor.number;
  if (!targetSize) return null;

  const allowedColors: TileColor[] =
    anchor.allowedColors && anchor.allowedColors.length > 0
      ? anchor.allowedColors
      : [anchor.color];

  // 1. Check each allowed color individually (single color group + jokers)
  for (const color of allowedColors) {
    const visited = new Set<number>();
    const queue: number[] = [anchorIdx];
    visited.add(anchorIdx);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const r = Math.floor(current / gridSize);
      const c = current % gridSize;
      const neighbors = [
        r > 0 ? (r - 1) * gridSize + c : null,
        r < gridSize - 1 ? (r + 1) * gridSize + c : null,
        c > 0 ? r * gridSize + (c - 1) : null,
        c < gridSize - 1 ? r * gridSize + (c + 1) : null,
      ];

      for (const nIdx of neighbors) {
        if (nIdx !== null && !visited.has(nIdx)) {
          const nTile = tiles[nIdx];
          const isMatching =
            nTile.color === color ||
            (nTile.allowedColors && nTile.allowedColors.includes(color));
          const isJoker = nTile.color === 'joker' || nTile.isJoker === true;
          if (isMatching || isJoker) {
            visited.add(nIdx);
            queue.push(nIdx);
          }
        }
      }
    }

    if (visited.size === targetSize) {
      return {
        indices: Array.from(visited),
        colors: [color],
      };
    }
  }

  // 2. If multi-colored, check combined allowed colors component
  if (allowedColors.length > 1) {
    const visited = new Set<number>();
    const queue: number[] = [anchorIdx];
    visited.add(anchorIdx);
    const presentColors = new Set<TileColor>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      const r = Math.floor(current / gridSize);
      const c = current % gridSize;
      const neighbors = [
        r > 0 ? (r - 1) * gridSize + c : null,
        r < gridSize - 1 ? (r + 1) * gridSize + c : null,
        c > 0 ? r * gridSize + (c - 1) : null,
        c < gridSize - 1 ? r * gridSize + (c + 1) : null,
      ];

      for (const nIdx of neighbors) {
        if (nIdx !== null && !visited.has(nIdx)) {
          const nTile = tiles[nIdx];
          const isAllowed =
            allowedColors.includes(nTile.color) ||
            (nTile.allowedColors &&
              nTile.allowedColors.some((ac) => allowedColors.includes(ac)));
          const isJoker = nTile.color === 'joker' || nTile.isJoker === true;
          if (isAllowed || isJoker) {
            visited.add(nIdx);
            queue.push(nIdx);
            if (nTile.color !== 'grey' && nTile.color !== 'joker' && !nTile.isJoker) {
              presentColors.add(nTile.color);
            }
          }
        }
      }
    }

    if (visited.size === targetSize) {
      return {
        indices: Array.from(visited),
        colors: presentColors.size > 0 ? Array.from(presentColors) : allowedColors,
      };
    }
  }

  return null;
}

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
        const neighborTile = tiles[neighborIdx];
        const isMatchingColor = neighborTile.color === targetColor;
        const isJoker = neighborTile.color === 'joker' || neighborTile.isJoker === true;
        if (!visited.has(neighborIdx) && (isMatchingColor || isJoker)) {
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
  if (levelId > 3 && levelId !== 31 && levelId !== 61) return null;

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

  // Level 31: Introduction to the Joker / Rainbow Block
  if (levelId === 31) {
    if (isLevelCompleted) {
      return {
        mainText: 'LEVEL 31 COMPLETED!',
        subText: 'RAINBOW WILDCARDS MASTERED!',
        fingerIndex: null,
      };
    }

    const isRedCompleted =
      getConnectedSameColorComponent(0, tiles, 4).length === 3;
    const isGreenCompleted =
      getConnectedSameColorComponent(12, tiles, 4).length === 3;

    // Step 1: Red set not yet completed -> Guide to place first rainbow to the right of the 2nd red (index 2)
    if (!isRedCompleted) {
      const redJokerTarget = 2; // Right of the 2nd red at index 1

      if (selectedIndex === null) {
        // Find a rainbow block not currently at index 13
        const availableJokerIdx = tiles.findIndex(
          (t, i) => (t.color === 'joker' || t.isJoker) && i !== 13
        );
        return {
          mainText: 'TAP A RAINBOW BLOCK',
          subText: 'RAINBOW WILDCARDS CAN COMPLETE ANY COLOR SET',
          fingerIndex: availableJokerIdx !== -1 ? availableJokerIdx : 11,
        };
      }

      const selectedTile = tiles[selectedIndex];
      if (selectedTile && (selectedTile.color === 'joker' || selectedTile.isJoker)) {
        return {
          mainText: 'PLACE RIGHT OF 2ND RED',
          subText: 'TAP THE EMPTY SPACE TO COMPLETE RED (3)',
          fingerIndex: redJokerTarget,
        };
      }

      return {
        mainText: 'TAP A RAINBOW BLOCK',
        subText: 'SELECT A RAINBOW WILDCARD TO MOVE',
        fingerIndex: 11,
      };
    }

    // Step 2: Red set completed, Green set not yet completed -> Guide to place 2nd rainbow to the right of green numbered block (index 13)
    if (!isGreenCompleted) {
      const greenJokerTarget = 13; // Right of green [3] at index 12

      if (selectedIndex === null) {
        // Find remaining rainbow block not at index 2
        const remainingJokerIdx = tiles.findIndex(
          (t, i) => (t.color === 'joker' || t.isJoker) && i !== 2
        );
        return {
          mainText: 'TAP THE 2ND RAINBOW BLOCK',
          subText: 'NOW COMPLETE THE GREEN SET',
          fingerIndex: remainingJokerIdx !== -1 ? remainingJokerIdx : 15,
        };
      }

      const selectedTile = tiles[selectedIndex];
      if (selectedTile && (selectedTile.color === 'joker' || selectedTile.isJoker)) {
        return {
          mainText: 'PLACE RIGHT OF GREEN [3]',
          subText: 'TAP THE EMPTY SPACE TO COMPLETE GREEN (3)',
          fingerIndex: greenJokerTarget,
        };
      }

      return {
        mainText: 'TAP THE 2ND RAINBOW BLOCK',
        subText: 'SELECT THE REMAINING RAINBOW TO MOVE',
        fingerIndex: 15,
      };
    }

    return {
      mainText: 'LEVEL 31 COMPLETED!',
      subText: 'RAINBOW WILDCARDS MASTERED!',
      fingerIndex: null,
    };
  }

  // Level 61: Introduction to the Multi-Coloured Number Block
  if (levelId === 61) {
    if (isLevelCompleted) {
      return {
        mainText: 'LEVEL 61 COMPLETED!',
        subText: 'MULTI-COLOURED NUMBER BLOCKS MASTERED!',
        fingerIndex: null,
      };
    }

    const anchor1Comp = getConnectedComponentForAnchor(0, tiles, 3);
    const isAnchor1Done = anchor1Comp !== null;
    const anchor2Comp = getConnectedComponentForAnchor(8, tiles, 3);
    const isAnchor2Done = anchor2Comp !== null;

    if (!isAnchor1Done) {
      if (selectedIndex === null) {
        const movableTarget = tiles.findIndex(
          (t, i) => (t.color === 'red' || t.color === 'blue') && t.number === undefined && i !== 1 && i !== 3
        );
        return {
          mainText: 'MULTI-COLOURED NUMBER BLOCK [3]',
          subText: 'ACCEPTS RED OR BLUE BLOCKS TO COMPLETE [3]',
          fingerIndex: movableTarget !== -1 ? movableTarget : 4,
        };
      } else {
        const emptyTarget = tiles[1].color === 'grey' ? 1 : tiles[3].color === 'grey' ? 3 : 2;
        return {
          mainText: 'PLACE ADJACENT TO RED/BLUE [3]',
          subText: 'CONNECT RED & BLUE BLOCKS TO SATISFY ANCHOR',
          fingerIndex: emptyTarget,
        };
      }
    }

    return null;
  }

  return null;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenMode>('home');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const currentLevel = LEVELS[currentLevelIndex];

  const [unlockedLevelsMax, setUnlockedLevelsMax] = useState<number>(LEVELS.length);

  const [tiles, setTiles] = useState<Tile[]>(currentLevel.initialTiles);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);
  const [hintToast, setHintToast] = useState<string | null>(null);

  // Moves management (Level 5+)
  const [movesLeft, setMovesLeft] = useState<number | null>(
    LEVELS[0].maxMoves ?? LEVEL_MAX_MOVES[LEVELS[0].id] ?? null
  );
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(3);

  // Undo moves management (Level 5+)
  const [undoCount, setUndoCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('grid_puzzle_undo_count');
      return saved !== null ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });
  const [moveHistory, setMoveHistory] = useState<Array<{ tiles: Tile[]; movesLeft: number | null }>>([]);
  const [showUndoAdModal, setShowUndoAdModal] = useState<boolean>(false);
  const [isWatchingUndoAd, setIsWatchingUndoAd] = useState<boolean>(false);
  const [undoAdCountdown, setUndoAdCountdown] = useState<number>(3);

  const updateUndoCount = (val: number) => {
    setUndoCount(val);
    try {
      localStorage.setItem('grid_puzzle_undo_count', String(val));
    } catch {
      // ignore
    }
  };

  const showToast = (message: string) => {
    setHintToast(message);
    setTimeout(() => {
      setHintToast((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const handleWatchAdForMoves = () => {
    if (isWatchingAd) return;
    setIsWatchingAd(true);
    setAdCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setAdCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsWatchingAd(false);
        setMovesLeft((current) => (current ?? 0) + 5);
        showToast('🎉 +5 Extra Moves Added!');
      }
    }, 850);
  };

  const handleWatchAdForUndos = () => {
    if (isWatchingUndoAd) return;
    setIsWatchingUndoAd(true);
    setUndoAdCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setUndoAdCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsWatchingUndoAd(false);
        setShowUndoAdModal(false);
        const updated = (undoCount || 0) + 3;
        updateUndoCount(updated);
      }
    }, 850);
  };

  const handleUndo = () => {
    if (currentLevel.id < 5) {
      return;
    }

    if (isLevelCompleted) return;

    if (undoCount <= 0) {
      setShowUndoAdModal(true);
      return;
    }

    if (moveHistory.length === 0) {
      return;
    }

    const prevSnapshot = moveHistory[moveHistory.length - 1];
    setMoveHistory((prev) => prev.slice(0, -1));
    setTiles(prevSnapshot.tiles);
    setMovesLeft(prevSnapshot.movesLeft);
    setSelectedIndex(null);

    const updated = Math.max(0, undoCount - 1);
    updateUndoCount(updated);
  };

  const switchLevel = (levelIndex: number) => {
    setCurrentLevelIndex(levelIndex);
    setTiles(LEVELS[levelIndex].initialTiles);
    setSelectedIndex(null);
    setHintToast(null);
    setIsWatchingAd(false);
    setShowUndoAdModal(false);
    setIsWatchingUndoAd(false);
    setMoveHistory([]);
    const defaultMoves =
      LEVELS[levelIndex].maxMoves ?? LEVEL_MAX_MOVES[LEVELS[levelIndex].id] ?? null;
    setMovesLeft(defaultMoves);
  };

  const handleStartPlay = () => {
    switchLevel(currentLevelIndex);
    setScreen('game');
  };

  const handleSelectLevel = (levelIdx: number) => {
    switchLevel(levelIdx);
    setScreen('game');
  };

  // Determine which tiles have changed boundaries based on continuous orthogonal connected components of matching color
  const changedBoundaryTileIds = new Set<string>();
  const completedTileSetColors = new Map<string, TileColor[]>();

  const numberedTiles = tiles
    .map((tile, idx) => ({ tile, idx }))
    .filter(({ tile }) => tile.number !== undefined);

  let allNumberedSatisfied = numberedTiles.length > 0;

  numberedTiles.forEach(({ tile, idx }) => {
    const result = getConnectedComponentForAnchor(
      idx,
      tiles,
      currentLevel.gridSize
    );

    // Only consider the set complete if the connected component EXACTLY equals targetSize (no more and no less)
    if (result) {
      result.indices.forEach((cIdx) => {
        const cTile = tiles[cIdx];
        changedBoundaryTileIds.add(cTile.id);
        const existing = completedTileSetColors.get(cTile.id) || [];
        const combined = Array.from(new Set([...existing, ...result.colors]));
        completedTileSetColors.set(cTile.id, combined);
      });
    } else {
      allNumberedSatisfied = false;
    }
  });

  const isLevelCompleted = allNumberedSatisfied && changedBoundaryTileIds.size > 0;
  const isOutOfMoves = movesLeft !== null && movesLeft <= 0 && !isLevelCompleted;
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
    // When level is completed or out of moves, prevent interaction
    if (isLevelCompleted || (movesLeft !== null && movesLeft <= 0)) {
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

    // Record history snapshot for undo
    setMoveHistory((prev) => [...prev, { tiles: [...tiles], movesLeft }]);

    // Swapping selected colored square with clicked grey square
    const nextTiles = [...tiles];
    const temp = nextTiles[selectedIndex];
    nextTiles[selectedIndex] = nextTiles[index];
    nextTiles[index] = temp;

    setTiles(nextTiles);
    setSelectedIndex(null);

    // Decrement remaining moves if level has a move limit
    if (movesLeft !== null) {
      setMovesLeft((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
    }
  };

  const handleReset = () => {
    setTiles(currentLevel.initialTiles);
    setSelectedIndex(null);
    setHintToast(null);
    setIsWatchingAd(false);
    setShowUndoAdModal(false);
    setIsWatchingUndoAd(false);
    setMoveHistory([]);
    const defaultMoves =
      currentLevel.maxMoves ?? LEVEL_MAX_MOVES[currentLevel.id] ?? null;
    setMovesLeft(defaultMoves);
  };

  const getTileBgClasses = (
    tile: Tile,
    isSelected: boolean,
    isDisabled: boolean,
    hasCustomJokerBg: boolean = false
  ) => {
    const isColored = tile.color !== 'grey';
    const hasNumber = tile.number !== undefined;

    if (isLevelCompleted) {
      if (hasCustomJokerBg) {
        return 'cursor-default shadow-xs';
      }
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
        case 'indigo':
          return 'bg-[#6366F1] cursor-default shadow-xs';
        case 'amber':
          return 'bg-[#F59E0B] cursor-default shadow-xs';
        case 'charcoal':
          return 'bg-[#475569] cursor-default shadow-xs';
        case 'joker':
          return 'bg-[linear-gradient(135deg,#FFAAA6_0%,#FFD3B5_25%,#DCEDC2_50%,#A8E6CF_75%,#C7CEEA_100%)] cursor-default shadow-xs';
        default:
          return 'bg-[#ECEEF1] cursor-default';
      }
    }

    if (hasNumber) {
      if (hasCustomJokerBg) {
        return 'cursor-not-allowed shadow-xs';
      }
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
        case 'indigo':
          return 'bg-[#6366F1] cursor-not-allowed shadow-xs';
        case 'amber':
          return 'bg-[#F59E0B] cursor-not-allowed shadow-xs';
        case 'charcoal':
          return 'bg-[#475569] cursor-not-allowed shadow-xs';
        case 'joker':
          return 'bg-[linear-gradient(135deg,#FFAAA6_0%,#FFD3B5_25%,#DCEDC2_50%,#A8E6CF_75%,#C7CEEA_100%)] cursor-not-allowed shadow-xs';
        default:
          return 'bg-[#ECEEF1] cursor-not-allowed';
      }
    }

    if (isColored) {
      if (hasCustomJokerBg) {
        if (isSelected) {
          return 'brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
        }
        return 'hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
      }
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
          case 'indigo':
            return 'bg-[#6366F1] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'amber':
            return 'bg-[#F59E0B] brightness-110 ring-3 ring-inset ring-slate-900/30 shadow-md cursor-pointer z-10';
          case 'charcoal':
            return 'bg-[#475569] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10';
          case 'joker':
            return 'bg-[linear-gradient(135deg,#FFAAA6_0%,#FFD3B5_25%,#DCEDC2_50%,#A8E6CF_75%,#C7CEEA_100%)] brightness-110 ring-3 ring-inset ring-white shadow-md cursor-pointer z-10 animate-pulse';
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
        case 'indigo':
          return 'bg-[#6366F1] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'amber':
          return 'bg-[#F59E0B] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'charcoal':
          return 'bg-[#475569] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
        case 'joker':
          return 'bg-[linear-gradient(135deg,#FFAAA6_0%,#FFD3B5_25%,#DCEDC2_50%,#A8E6CF_75%,#C7CEEA_100%)] hover:brightness-105 active:brightness-95 shadow-xs cursor-pointer transition-all duration-150';
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
        return 'border-[#EB5872] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'yellow':
        return 'border-[#FFCE54] ring-2 sm:ring-3 ring-inset ring-slate-900/30 shadow-xs';
      case 'green':
        return 'border-[#48CFAD] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'blue':
        return 'border-[#4FC1E9] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'purple':
        return 'border-[#7B79DB] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'orange':
        return 'border-[#FC6E51] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'pink':
        return 'border-[#EC87C0] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'cyan':
        return 'border-[#3BC2A5] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'lime':
        return 'border-[#A0D468] ring-2 sm:ring-3 ring-inset ring-slate-900/30 shadow-xs';
      case 'indigo':
        return 'border-[#6366F1] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'amber':
        return 'border-[#F59E0B] ring-2 sm:ring-3 ring-inset ring-slate-900/30 shadow-xs';
      case 'charcoal':
        return 'border-[#475569] ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      case 'joker':
        return 'border-white ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
      default:
        return 'border-white ring-2 sm:ring-3 ring-inset ring-white/90 shadow-xs';
    }
  };

  const getTileNumberTextClass = (tile: Tile) => {
    if (tile.allowedColors && tile.allowedColors.length > 1) {
      return 'text-white drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.85)] font-black';
    }
    switch (tile.color) {
      case 'yellow':
      case 'lime':
      case 'amber':
        return 'text-slate-900 drop-shadow-xs font-black';
      case 'red':
      case 'green':
      case 'blue':
      case 'purple':
      case 'orange':
      case 'pink':
      case 'cyan':
      case 'indigo':
      case 'charcoal':
      case 'joker':
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
    if (gridSize === 6) return 'text-base sm:text-lg font-black';
    return 'text-xs sm:text-sm font-black';
  };

  const getTileCornerRadius = (gridSize: number) => {
    if (gridSize === 2) return 'rounded-2xl';
    if (gridSize === 3) return 'rounded-xl';
    if (gridSize === 4) return 'rounded-lg';
    if (gridSize === 5) return 'rounded-md';
    if (gridSize === 6) return 'rounded-md';
    return 'rounded-sm';
  };

  return (
    <div
      id="app-root"
      className="min-h-screen w-full bg-[#FFFFFF] flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 font-sans select-none overflow-x-hidden touch-manipulation"
    >
      {/* Home Screen View */}
      {screen === 'home' && (
        <div className="w-full max-w-[min(92vw,72vh,420px)] flex flex-col items-center justify-between flex-1 min-h-[92vh] py-6 sm:py-8">
          <header className="w-full flex items-center justify-end px-1 pt-1">
            <button
              type="button"
              id="home-how-to-play-button"
              onClick={() => setShowHowToPlayModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-[#ECEEF1] hover:bg-[#DFE2E8] active:scale-95 cursor-pointer transition-all shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>How to Play</span>
            </button>
          </header>

          <main className="flex flex-col items-center justify-center gap-8 w-full my-auto text-center">
            {/* Decorative Mini 3x3 Grid Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#F8F9FB] border border-[#ECEEF1] p-3 shadow-sm grid grid-cols-3 gap-1.5 items-center justify-center">
              <div className="w-full h-full rounded-lg bg-[#EB5872] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#FFCE54] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#48CFAD] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#4FC1E9] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#E4E7ED] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#7B79DB] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#FC6E51] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#3BC2A5] shadow-2xs"></div>
              <div className="w-full h-full rounded-lg bg-[#A0D468] shadow-2xs"></div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 id="game-title" className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0F172A] tracking-tight">
                Grid Puzzle
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-500 tracking-wide uppercase">
                Connect Blocks & Solve Color Groups
              </p>
            </div>

            <div className="flex flex-col gap-3.5 w-full max-w-[280px] sm:max-w-[320px] pt-4">
              <button
                type="button"
                id="home-play-button"
                onClick={handleStartPlay}
                className="w-full py-4 px-6 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-extrabold text-base sm:text-lg shadow-sm flex items-center justify-center gap-3 active:scale-95 cursor-pointer transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>PLAY (LEVEL {currentLevelIndex + 1})</span>
              </button>

              <button
                type="button"
                id="home-level-selection-button"
                onClick={() => setScreen('level-select')}
                className="w-full py-4 px-6 rounded-2xl bg-[#ECEEF1] hover:bg-[#DFE2E8] text-[#0F172A] font-extrabold text-base sm:text-lg shadow-xs flex items-center justify-center gap-3 active:scale-95 cursor-pointer transition-all"
              >
                <Grid className="w-5 h-5 text-slate-700" />
                <span>SELECT LEVEL</span>
              </button>
            </div>
          </main>

          <footer className="w-full flex items-center justify-center pt-4 pb-2">
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">
              All {LEVELS.length} Levels Unlocked
            </span>
          </footer>
        </div>
      )}

      {/* Level Selection Screen View */}
      {screen === 'level-select' && (
        <div className="w-full max-w-[min(92vw,72vh,420px)] flex flex-col items-center justify-between flex-1 min-h-[92vh] py-2 sm:py-4">
          <header id="level-select-top-bar" className="w-full flex items-center justify-between px-1 pt-1 pb-3">
            <button
              type="button"
              id="back-to-home-button"
              onClick={() => setScreen('home')}
              aria-label="Back to Home"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#94A3B8] hover:bg-[#64748B] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Undo2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>

            <h1 id="level-select-title" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Levels
            </h1>

            <div className="w-12 h-12 sm:w-14 sm:h-14"></div>
          </header>

          <main className="w-full flex-1 overflow-y-auto px-1 py-3 my-auto">
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 max-w-sm mx-auto w-full pb-6">
              {LEVELS.map((lvl, idx) => {
                const isCurrent = currentLevelIndex === idx;

                return (
                  <button
                    type="button"
                    key={lvl.id}
                    id={`level-button-${lvl.id}`}
                    onClick={() => handleSelectLevel(idx)}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center font-extrabold text-base sm:text-lg transition-all shadow-xs cursor-pointer active:scale-95 ${
                      isCurrent
                        ? 'bg-[#FA8231] text-white shadow-md ring-2 ring-white ring-offset-2 ring-offset-[#FA8231]/30'
                        : 'bg-[#ECEEF1] hover:bg-[#DFE2E8] text-[#0F172A]'
                    }`}
                  >
                    <span>{lvl.id}</span>
                  </button>
                );
              })}
            </div>
          </main>

          <footer className="w-full flex items-center justify-center pt-2 pb-2">
            <span className="text-xs text-slate-500 font-medium tracking-wide">
              All {LEVELS.length} Levels Unlocked & Playable
            </span>
          </footer>
        </div>
      )}

      {/* Gameplay Screen View */}
      {screen === 'game' && (
        <div className="w-full max-w-[min(92vw,72vh,420px)] flex flex-col items-center justify-between flex-1 min-h-[92vh] py-2 sm:py-4">
          
          {/* Top Header Bar: Back Button (Left), Level Title + Moves UI (Middle), Reset Button (Right) */}
          <header id="app-top-bar" className="w-full flex items-center justify-between px-1 pt-1 pb-1">
            {/* Back button on top left to return to level selection */}
            <button
              type="button"
              id="back-to-levels-button"
              onClick={() => setScreen('level-select')}
              aria-label="Level Selection"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#94A3B8] hover:bg-[#64748B] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>

            {/* Level Number and Moves Counter directly below it */}
            <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
              <h1 id="level-title-display" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-none">
                {currentLevel.title}
              </h1>

              {movesLeft !== null && (
                <div
                  id="moves-remaining-badge"
                  className={`flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-2xl text-sm sm:text-base font-black tracking-wide shadow-sm border transition-all ${
                    movesLeft <= 2
                      ? 'bg-rose-500 border-rose-600 text-white animate-pulse shadow-rose-200 scale-105'
                      : movesLeft <= 4
                      ? 'bg-[#FA8231] border-amber-600 text-white shadow-amber-200'
                      : 'bg-[#ECEEF1] border-slate-300/80 text-[#0F172A]'
                  }`}
                >
                  <span className="text-xs sm:text-sm opacity-80 uppercase tracking-wider font-extrabold">Moves</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                  <span className="text-lg sm:text-xl font-black tabular-nums leading-none">{movesLeft}</span>
                </div>
              )}
            </div>

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
                    : currentLevel.gridSize === 6
                    ? 'grid-cols-6 gap-1 sm:gap-1.5'
                    : 'grid-cols-7 gap-0.5 sm:gap-1'
                }`}
              >
                {tiles.map((tile, index) => {
                  const isSelected = !isLevelCompleted && selectedIndex === index;
                  const hasNumber = tile.number !== undefined;
                  const hasChangedBoundary = changedBoundaryTileIds.has(tile.id);
                  const completedColors = completedTileSetColors.get(tile.id) || [tile.color];
                  const primaryColor = completedColors[0] || tile.color;

                  // Check if tile is a rainbow block with adjacent colored blocks
                  const isJoker = tile.color === 'joker' || tile.isJoker;
                  const jokerAdjacentColors = isJoker
                    ? getJokerAdjacentColors(index, tiles, currentLevel.gridSize)
                    : [];
                  const rainbowBorderColors =
                    isJoker && jokerAdjacentColors.length > 0 ? jokerAdjacentColors : null;

                  const hasSvgBorder =
                    Boolean(rainbowBorderColors) || (hasChangedBoundary && completedColors.length >= 2);
                  const activeSvgBorderColors = rainbowBorderColors || completedColors;
                  const showCssBorder = hasChangedBoundary && !hasSvgBorder;
                  const isDisabled = isLevelCompleted || hasNumber;

                  const customBgStyle = getTileBackgroundStyle(tile, jokerAdjacentColors);
                  const hasCustomJokerBg = Boolean(customBgStyle);

                  const showTutorialFinger =
                    tutorialGuidance !== null && tutorialGuidance.fingerIndex === index;

                  return (
                    <button
                      type="button"
                      key={tile.id}
                      id={`grid-square-${tile.id}`}
                      disabled={isDisabled}
                      onClick={() => handleTileClick(index)}
                      style={customBgStyle}
                      aria-label={`${tile.color} square${
                        hasNumber ? ` with number ${tile.number}` : ''
                      } at position ${index + 1}${isSelected ? ', selected' : ''}${
                        hasChangedBoundary ? ', matching neighbor boundary active' : ''
                      }`}
                      className={`relative w-full h-full ${getTileCornerRadius(
                        currentLevel.gridSize
                      )} outline-none box-border ${
                        showCssBorder ? 'border-2 sm:border-3' : 'border-0'
                      } ${getTileBorderClass(
                        primaryColor,
                        showCssBorder
                      )} ${getTileBgClasses(tile, isSelected, isDisabled, hasCustomJokerBg)} ${
                        showTutorialFinger ? 'ring-3 ring-inset ring-[#FA8231] shadow-md' : ''
                      }`}
                    >
                      {/* Adaptive Multi-Color / Single-Color Border for Rainbow Wildcards and Multi-Set Completing Tiles */}
                      {hasSvgBorder && activeSvgBorderColors.length > 0 && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id={`split-border-${tile.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              {activeSvgBorderColors.length === 1 ? (
                                [
                                  <stop key={`${tile.id}-s1`} offset="0%" stopColor={COLOR_HEX_MAP[activeSvgBorderColors[0]]} />,
                                  <stop key={`${tile.id}-s2`} offset="100%" stopColor={COLOR_HEX_MAP[activeSvgBorderColors[0]]} />,
                                ]
                              ) : activeSvgBorderColors.length === 2 ? (
                                [
                                  <stop key={`${tile.id}-s1`} offset="0%" stopColor={COLOR_HEX_MAP[activeSvgBorderColors[0]]} />,
                                  <stop key={`${tile.id}-s2`} offset="50%" stopColor={COLOR_HEX_MAP[activeSvgBorderColors[0]]} />,
                                  <stop key={`${tile.id}-s3`} offset="50%" stopColor={COLOR_HEX_MAP[activeSvgBorderColors[1]]} />,
                                  <stop key={`${tile.id}-s4`} offset="100%" stopColor={COLOR_HEX_MAP[activeSvgBorderColors[1]]} />,
                                ]
                              ) : (
                                activeSvgBorderColors.flatMap((c, cIdx) => {
                                  const startPct = Math.round((cIdx / activeSvgBorderColors.length) * 100);
                                  const endPct = Math.round(((cIdx + 1) / activeSvgBorderColors.length) * 100);
                                  return [
                                    <stop key={`${tile.id}-s1-${cIdx}`} offset={`${startPct}%`} stopColor={COLOR_HEX_MAP[c]} />,
                                    <stop key={`${tile.id}-s2-${cIdx}`} offset={`${endPct}%`} stopColor={COLOR_HEX_MAP[c]} />,
                                  ];
                                })
                              )}
                            </linearGradient>
                          </defs>
                          {/* Outer Split Multi-Color Border */}
                          <rect
                            x="1.5"
                            y="1.5"
                            width="97"
                            height="97"
                            rx={getSvgCornerRadius(currentLevel.gridSize)}
                            ry={getSvgCornerRadius(currentLevel.gridSize)}
                            fill="none"
                            stroke={`url(#split-border-${tile.id})`}
                            strokeWidth="6"
                          />
                          {/* Inner White Illumination Ring */}
                          <rect
                            x="3.5"
                            y="3.5"
                            width="93"
                            height="93"
                            rx={Math.max(1, getSvgCornerRadius(currentLevel.gridSize) - 2)}
                            ry={Math.max(1, getSvgCornerRadius(currentLevel.gridSize) - 2)}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.85)"
                            strokeWidth="2.5"
                          />
                        </svg>
                      )}

                      {tile.number !== undefined && (
                        <span
                          id={`tile-number-${tile.number}`}
                          className={`absolute inset-0 flex items-center justify-center select-none leading-none pointer-events-none ${getNumberSizeClass(
                            currentLevel.gridSize
                          )} ${getTileNumberTextClass(tile)}`}
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
                className="w-full flex flex-col items-center justify-center text-center px-3 select-none gap-1"
              >
                <p className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
                  {tutorialGuidance.mainText}
                </p>
                <p className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-600 uppercase">
                  {tutorialGuidance.subText}
                </p>
              </div>
            ) : isLevelCompleted ? (
              <div
                id="level-completed-status-text"
                className="w-full flex flex-col items-center justify-center text-center px-3 select-none gap-1 animate-in fade-in"
              >
                <p className="text-base sm:text-lg font-black tracking-wider text-emerald-600 uppercase flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  <span>LEVEL COMPLETED!</span>
                </p>
                <p className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-600 uppercase">
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
              <div className="flex items-center justify-between w-full">
                {currentLevel.id >= 5 ? (
                  <button
                    type="button"
                    id="undo-move-button"
                    onClick={handleUndo}
                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm border border-slate-200 shadow-2xs active:scale-95 cursor-pointer transition-all"
                    aria-label={`Undo last move. ${undoCount} undos left.`}
                  >
                    <Undo2 className="w-4 h-4 text-[#FA8231] stroke-[2.5]" />
                    <span>Undo</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black leading-none ${
                        undoCount > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {undoCount}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

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
      )}

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
                  The Core Goal: Exact Count
                </span>
                <p className="text-xs text-slate-600">
                  Form continuous groups of matching colored blocks. The total connected count in each color group must <strong>exactly equal</strong> the number on the anchor block (no more and no less). If there are too many blocks attached, the set will not complete!
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

              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[linear-gradient(135deg,#FFAAA6_0%,#FFD3B5_25%,#DCEDC2_50%,#A8E6CF_75%,#C7CEEA_100%)] text-white text-[10px] flex items-center justify-center font-black">5</span>
                  Rainbow Joker (Wildcard) Block
                </span>
                <p className="text-xs text-slate-600">
                  The soothing <strong>Rainbow block</strong> acts as a universal wildcard and can connect with <strong>any color</strong> to help complete required group sizes.
                </p>
              </div>

              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[#FA8231] text-white text-[10px] flex items-center justify-center font-black">6</span>
                  Limited Moves (Level 5+)
                </span>
                <p className="text-xs text-slate-600">
                  Starting from Level 5, you have a <strong>limited number of moves</strong>. If you run out of moves, you can restart the level or watch a quick ad to get <strong>+5 extra moves</strong>!
                </p>
              </div>

              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[#FA8231] text-white text-[10px] flex items-center justify-center font-black">7</span>
                  Undo Moves (Level 5+)
                </span>
                <p className="text-xs text-slate-600">
                  Made a wrong move? Tap the <strong>Undo</strong> button to reverse your last move and restore your board and move count. You start with <strong>3 free Undos</strong>, and can watch an ad to get <strong>+3 more</strong> when empty!
                </p>
              </div>

              <div className="bg-[#F8F9FB] p-3.5 rounded-2xl border border-[#ECEEF1] flex flex-col gap-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-[linear-gradient(135deg,#EB5872_0%,#EB5872_50%,#4FC1E9_50%,#4FC1E9_100%)] text-white text-[10px] flex items-center justify-center font-black">8</span>
                  Multi-Coloured Number Blocks (Level 61+)
                </span>
                <p className="text-xs text-slate-600">
                  Numbered anchor blocks with <strong>two or more colors</strong> accept <strong>any of their listed colors</strong> to form connected sets! Place blocks of any shown color next to the multi-coloured anchor to match the required number and complete the set.
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

      {/* Out of Moves Game Over Modal */}
      {isOutOfMoves && (
        <div
          id="out-of-moves-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col items-center gap-4 text-center animate-in zoom-in-95">
            {/* Warning / Out of Moves Badge Icon */}
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-xs">
              <AlertCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Out of Moves!</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                You used all moves for <span className="font-bold text-slate-700">{currentLevel.title}</span>.
              </p>
            </div>

            {/* Action Buttons: Watch Ad for +5 Moves OR Restart Level */}
            <div className="flex flex-col gap-2.5 w-full pt-2">
              {/* Watch Ad for +5 Moves */}
              <button
                type="button"
                id="watch-ad-for-moves-button"
                onClick={handleWatchAdForMoves}
                disabled={isWatchingAd}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#FA8231] hover:bg-[#E67325] text-white font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all disabled:opacity-85"
              >
                {isWatchingAd ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Watching Ad ({adCountdown}s)...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 fill-white/20" />
                    <span>Watch Ad (+5 Moves)</span>
                  </>
                )}
              </button>

              {/* Restart Game */}
              <button
                type="button"
                id="restart-level-out-of-moves-button"
                onClick={handleReset}
                disabled={isWatchingAd}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#ECEEF1] hover:bg-[#DFE2E8] text-[#0F172A] font-extrabold text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-600 stroke-[2.5]" />
                <span>Restart Level</span>
              </button>

              {/* Return to Level Select */}
              <button
                type="button"
                id="back-to-levels-out-of-moves-button"
                onClick={() => setScreen('level-select')}
                disabled={isWatchingAd}
                className="w-full py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Back to Levels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Out of Undos Ad Modal (Watch Ad vs Skip) */}
      {showUndoAdModal && (
        <div
          id="undo-ad-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col items-center gap-4 text-center animate-in zoom-in-95">
            {/* Undo Badge Icon */}
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#FA8231] shadow-xs">
              <Undo2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Need More Undos?</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                You have used all your free Undo moves. Watch a quick ad to receive <span className="font-bold text-slate-800">+3 Extra Undos</span>!
              </p>
            </div>

            {/* Action Buttons: Watch Ad for +3 Undos OR Skip */}
            <div className="flex flex-col gap-2.5 w-full pt-2">
              <button
                type="button"
                id="watch-ad-for-undos-button"
                onClick={handleWatchAdForUndos}
                disabled={isWatchingUndoAd}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#FA8231] hover:bg-[#E67325] text-white font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all disabled:opacity-85"
              >
                {isWatchingUndoAd ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Watching Ad ({undoAdCountdown}s)...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 fill-white/20" />
                    <span>Watch Ad (+3 Undos)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="skip-undo-ad-button"
                onClick={() => {
                  if (!isWatchingUndoAd) setShowUndoAdModal(false);
                }}
                disabled={isWatchingUndoAd}
                className="w-full py-3 px-4 rounded-2xl bg-[#ECEEF1] hover:bg-[#DFE2E8] text-[#0F172A] font-extrabold text-sm shadow-xs flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

