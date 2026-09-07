export type TileColor =
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'lime'
  | 'indigo'
  | 'amber'
  | 'charcoal'
  | 'joker'
  | 'grey';

export interface Tile {
  id: string;
  color: TileColor;
  number?: number;
  isJoker?: boolean;
  allowedColors?: TileColor[];
  isFrozen?: boolean;
}

export interface LevelConfig {
  id: number;
  title: string;
  gridSize: number;
  initialTiles: Tile[];
  maxMoves?: number;
}
