import React from 'react';
import { Cell, Color, Corner } from '../types';

interface BoardProps {
  board: Cell[][];
  onCellClick: (row: number, col: number) => void;
  isFirstMove: boolean;
  playerCorner: Corner;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, isFirstMove, playerCorner }) => {
  const getCellColor = (color: Color | null): string => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-white';
    }
  };

  const getCornerCoordinates = (corner: Corner): [number, number] => {
    switch (corner) {
      case 'topLeft': return [0, 0];
      case 'topRight': return [0, 15];
      case 'bottomLeft': return [15, 0];
      case 'bottomRight': return [15, 15];
    }
  };

  const [startRow, startCol] = getCornerCoordinates(playerCorner);

  return (
    <div className="grid grid-cols-20 gap-px bg-gray-300 p-1">
      {board.slice(startRow, startRow + 5).map((row, rowIndex) =>
        row.slice(startCol, startCol + 5).map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-6 h-6 ${getCellColor(cell.color)} ${
              cell.isCorner ? 'border-2 border-gray-400' : ''
            }`}
            onClick={() => onCellClick(startRow + rowIndex, startCol + colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;