import React from 'react';

const Settings = ({ gameMode, onGameModeChange }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label>
        Game Mode:
        <select
          value={gameMode}
          onChange={(e) => onGameModeChange(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="classic">Classic Blokus (4 players, 20x20)</option>
          <option value="duo">Duo Blokus (2 players, 14x14)</option>
        </select>
      </label>
    </div>
  );
};

export default Settings;
