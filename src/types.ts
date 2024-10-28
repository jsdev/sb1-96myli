export type Color = 'green' | 'yellow' | 'red' | 'blue';

export type Piece = {
  id: number;
  shape: boolean[][];
  color: Color;
  value: number;
};

export type Cell = {
  color: Color | null;
  isCorner: boolean;
};

export type GameState = {
  board: Cell[][];
  currentPlayer: Color;
  pieces: Piece[][];
  placedFirstPiece: boolean[];
  selectedPiece: Piece | null;
  rotation: number;
  flippedHorizontal: boolean;
  flippedVertical: boolean;
  playerCorners: Corner[];
};

export type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

// Add this new type for the shape grid
export type ShapeGrid = (Color | 0)[][];