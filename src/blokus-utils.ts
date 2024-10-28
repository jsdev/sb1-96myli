import { generateAllOrientations } from './blokus-shapes';

export const isAdjacentToSameColor = (board, row, col, color) => {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  return directions.some(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    return (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length &&
      board[newRow][newCol] === color
    );
  });
};

export const isDiagonalToSameColor = (board, row, col, color) => {
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  return directions.some(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    return (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length &&
      board[newRow][newCol] === color
    );
  });
};

export const canPlaceShapeInCorner = (shape, row, col, boardSize) => {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          (newRow === 0 && newCol === 0) ||
          (newRow === 0 && newCol === boardSize - 1) ||
          (newRow === boardSize - 1 && newCol === 0) ||
          (newRow === boardSize - 1 && newCol === boardSize - 1)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isValidMoveForShape = (
  board,
  shape,
  row,
  col,
  color,
  isFirstMove
) => {
  let touchesDiagonally = false;

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const newRow = row + i;
        const newCol = col + j;

        // Check if the cell is within the board and empty
        if (
          newRow < 0 ||
          newRow >= board.length ||
          newCol < 0 ||
          newCol >= board[0].length ||
          board[newRow][newCol] !== null
        ) {
          return false;
        }

        // Check for adjacent same color
        if (isAdjacentToSameColor(board, newRow, newCol, color)) {
          return false;
        }

        // Check for diagonal touch
        if (isDiagonalToSameColor(board, newRow, newCol, color)) {
          touchesDiagonally = true;
        }
      }
    }
  }

  if (isFirstMove) {
    return canPlaceShapeInCorner(shape, row, col, board.length);
  }

  return touchesDiagonally;
};

export const getValidMovesForShape = (board, shape, color, isFirstMove) => {
  const validMoves = new Set();
  const orientations = generateAllOrientations(shape);

  for (const orientation of orientations) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        if (
          isValidMoveForShape(board, orientation, row, col, color, isFirstMove)
        ) {
          validMoves.add(`${row},${col}`);
        }
      }
    }
  }

  return Array.from(validMoves).map((move) => move.split(',').map(Number));
};
