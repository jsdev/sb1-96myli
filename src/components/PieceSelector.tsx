import React, { useState } from 'react';
import { Piece, Color } from '../types';

interface PieceSelectorProps {
  pieces: Piece[];
  color: Color;
  onSelectPiece: (piece: Piece) => void;
  selectedPiece: Piece | null;
}

const PieceSelector: React.FC<PieceSelectorProps> = ({ pieces, color, onSelectPiece, selectedPiece }) => {
  const [activeTab, setActiveTab] = useState<string>('pentominoes');

  const getCellColor = (color: Color): string => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
    }
  };

  const categorizedPieces = {
    pentominoes: pieces.filter(p => p.value === 5),
    tetrominoes: pieces.filter(p => p.value === 4),
    triominoes: pieces.filter(p => p.value === 3),
    dominoMonomino: pieces.filter(p => p.value === 2 || p.value === 1),
  };

  const tabs = [
    { id: 'pentominoes', label: 'Pentominoes' },
    { id: 'tetrominoes', label: 'Tetrominoes' },
    { id: 'triominoes', label: 'Triominoes' },
    { id: 'dominoMonomino', label: 'Domino & Monomino' },
  ];

  return (
    <div className="w-full max-w-3xl">
      <div className="flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab.id
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {categorizedPieces[activeTab as keyof typeof categorizedPieces].map((piece) => (
          <div
            key={piece.id}
            className={`cursor-pointer ${selectedPiece?.id === piece.id ? 'border-2 border-black' : ''}`}
            onClick={() => onSelectPiece(piece)}
          >
            <div className="grid grid-cols-5 gap-px bg-gray-300 p-1">
              {piece.shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-4 h-4 ${cell ? getCellColor(color) : 'bg-white'}`}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieceSelector;