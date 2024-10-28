import React from 'react';

const ScoreBoard = ({ scores, currentPlayer }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Scores:</h2>
      {Object.entries(scores).map(([player, score]) => (
        <div key={player} className={`${player === currentPlayer ? 'font-bold' : ''}`}>
          {player}: {score}
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;