import React, { useState, useEffect } from 'react';

const BlokusBoard = ({ board, validMoves, onCellClick }) => {
  const [cellSize, setCellSize] = useState('20px');

  useEffect(() => {
    const calculateCellSize = () => {
      const viewportWidth = Math.min(window.innerWidth, window.innerHeight);
      const boardSize = board.length;
      const maxBoardSize = viewportWidth * 0.9; // Board takes up to 90% of the viewport
      const calculatedCellSize = Math.floor(maxBoardSize / boardSize);
      setCellSize(`${calculatedCellSize}px`);
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);

    return () => window.removeEventListener('resize', calculateCellSize);
  }, [board.length]);

  return (
    <div style={{ display: 'inline-block', border: '2px solid black' }}>
      {board.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((cell, j) => (
            <div
              key={j}
              onClick={() => onCellClick(i, j)}
              style={{
                width: cellSize,
                height: cellSize,
                border: '1px solid black',
                backgroundColor:
                  cell ||
                  (validMoves.some(([r, c]) => r === i && c === j)
                    ? '#ffff99'
                    : 'white'),
                cursor: validMoves.some(([r, c]) => r === i && c === j)
                  ? 'pointer'
                  : 'default',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BlokusBoard;
