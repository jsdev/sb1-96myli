import React, { useState } from 'react';

const GameBoard = ({ selectedShape, playerColor, isFirstTurn, onPlayPiece }) => {
  const [board, setBoard] = useState(Array(20).fill(Array(20).fill(null)));
  const [hoverPosition, setHoverPosition] = useState(null);

  const isCornerCell = (rowIndex, colIndex) => {
    return (
      (rowIndex === 0 || rowIndex === 19) && (colIndex === 0 || colIndex === 19)
    );
  };

  const isValidPlacement = (rowIndex, colIndex) => {
    if (!selectedShape) return false;
    if (isFirstTurn && !isCornerCell(rowIndex, colIndex)) return false;

    // Check if the shape fits within the board
    if (rowIndex + selectedShape.length > 20 || colIndex + selectedShape[0].length > 20) return false;

    // Check if the shape overlaps with existing pieces or touches the same color
    for (let i = 0; i < selectedShape.length; i++) {
      for (let j = 0; j < selectedShape[i].length; j++) {
        if (selectedShape[i][j]) {
          if (board[rowIndex + i][colIndex + j] !== null) return false;
          
          // Check adjacent cells for the same color
          const adjacentCells = [
            [rowIndex + i - 1, colIndex + j],
            [rowIndex + i + 1, colIndex + j],
            [rowIndex + i, colIndex + j - 1],
            [rowIndex + i, colIndex + j + 1],
          ];

          for (const [adjRow, adjCol] of adjacentCells) {
            if (
              adjRow >= 0 && adjRow < 20 && adjCol >= 0 && adjCol < 20 &&
              board[adjRow][adjCol] === playerColor
            ) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const handleCellHover = (rowIndex, colIndex) => {
    setHoverPosition({ row: rowIndex, col: colIndex });
  };

  const handleCellLeave = () => {
    setHoverPosition(null);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (isValidPlacement(rowIndex, colIndex)) {
      const newBoard = board.map(row => [...row]);
      for (let i = 0; i < selectedShape.length; i++) {
        for (let j = 0; j < selectedShape[i].length; j++) {
          if (selectedShape[i][j]) {
            newBoard[rowIndex + i][colIndex + j] = playerColor;
          }
        }
      }
      setBoard(newBoard);
      onPlayPiece();    
    }
  };

  const renderCell = (rowIndex, colIndex) => {
    const isHovered = hoverPosition &&
      rowIndex >= hoverPosition.row &&
      rowIndex < hoverPosition.row + (selectedShape?.length || 0) &&
      colIndex >= hoverPosition.col &&
      colIndex < hoverPosition.col + (selectedShape?.[0]?.length || 0);

    const showHoverShape = isHovered && selectedShape?.[rowIndex - hoverPosition.row]?.[colIndex - hoverPosition.col];

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`w-6 h-6 border ${
          board[rowIndex][colIndex]
            ? `bg-${board[rowIndex][colIndex]}-500`
            : showHoverShape
            ? `bg-${playerColor}-200`
            : 'bg-gray-200'
        } ${isCornerCell(rowIndex, colIndex) ? 'border-2 border-black' : ''}`}
        onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
        onMouseLeave={handleCellLeave}
        onClick={() => handleCellClick(rowIndex, colIndex)}
      />
    );
  };

  const renderRow = (row, rowIndex) => (
    <div key={rowIndex} className="flex">
      {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
    </div>
  );

  return (
    <div className="gameboard">
      {board.map((row, rowIndex) => renderRow(row, rowIndex))}
    </div>
  );
};

export default GameBoard;