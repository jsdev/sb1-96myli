import React, { useState, useEffect } from 'react';
import { canPlaceInCorner } from './blokus-shapes';

const BlokusShapes = ({
  playerShapes,
  currentPlayer,
  selectedShape,
  setSelectedShape,
  firstMoves,
}) => {
  const [cellSize, setCellSize] = useState('10px');

  useEffect(() => {
    const calculateCellSize = () => {
      const viewportWidth = window.innerWidth;
      const calculatedCellSize = Math.floor(viewportWidth * 0.02); // 2% of viewport width
      setCellSize(`${Math.max(calculatedCellSize, 5)}px`); // Minimum size of 5px
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);

    return () => window.removeEventListener('resize', calculateCellSize);
  }, []);

  const renderShapePreview = (shape, color) => {
    return (
      <div style={{ display: 'inline-block' }}>
        {shape.map((row, i) => (
          <div key={i} style={{ display: 'flex' }}>
            {row.map((cell, j) => (
              <div
                key={j}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? color : 'transparent',
                  border: cell ? `1px solid ${color}` : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const currentPlayerShapes = playerShapes[currentPlayer] || [];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      {currentPlayerShapes.map((shape, index) => (
        <button
          key={index}
          onClick={() => setSelectedShape(shape)}
          disabled={
            !shape.available ||
            (firstMoves.has(currentPlayer) && !canPlaceInCorner(shape.shape))
          }
          style={{
            margin: '5px',
            padding: '5px',
            backgroundColor: shape.available
              ? selectedShape?.id === shape.id
                ? 'white'
                : currentPlayer
              : '#ccc',
            border: `2px solid ${
              selectedShape?.id === shape.id ? 'black' : 'transparent'
            }`,
            cursor: shape.available ? 'pointer' : 'not-allowed',
            opacity:
              firstMoves.has(currentPlayer) && !canPlaceInCorner(shape.shape)
                ? 0.5
                : 1,
          }}
        >
          {renderShapePreview(
            shape.shape,
            shape.available
              ? selectedShape?.id === shape.id
                ? 'black'
                : 'white'
              : '#999'
          )}
        </button>
      ))}
    </div>
  );
};

export default BlokusShapes;
