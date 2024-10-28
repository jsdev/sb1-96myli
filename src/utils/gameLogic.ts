import { Cell, Color, Piece, GameState, Corner, ShapeGrid } from '../types';

// ... (keep the existing code)

export const rotatePiece = (piece: ShapeGrid, rotations: number): ShapeGrid => {
  let rotatedShape = piece;
  for (let i = 0; i < rotations; i++) {
    rotatedShape = rotatedShape[0].map((_, index) =>
      rotatedShape.map((row) => row[index]).reverse()
    );
  }
  return rotatedShape;
};

export const flipPiece = (
  shape: ShapeGrid,
  direction: 'horizontal' | 'vertical'
): ShapeGrid => {
  if (direction === 'horizontal') {
    return shape.map((row) => [...row].reverse());
  } else {
    return [...shape].reverse();
  }
};

// ... (keep the rest of the code)