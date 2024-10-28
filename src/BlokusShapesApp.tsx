import React from 'react';
import { useBlokusGame } from './useBlokusGame';
import Settings from './Settings';
import BlokusBoard from './BlokusBoard';
import BlokusShapes from './BlokusShapes';
import Timer from './components/Timer';
import ScoreBoard from './components/ScoreBoard';
import RewardAnimation from './components/RewardAnimation';

const BlokusGame = () => {
  const {
    gameMode,
    setGameMode,
    board,
    currentPlayer,
    selectedShape,
    setSelectedShape,
    playerShapes,
    message,
    overlayShapes,
    validMoves,
    handleCellClick,
    handleOverlayClick,
    gameModes,
    timerDuration,
    setTimerDuration,
    timeLeft,
    scores,
    showReward,
  } = useBlokusGame();

  const renderOverlay = () => {
    if (overlayShapes.length === 0) return null;

    const { players } = gameModes[gameMode];
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          border: '2px solid black',
          zIndex: 1000,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <h3>Choose an orientation:</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {overlayShapes.map((shape, index) => (
            <div
              key={index}
              onClick={() => handleOverlayClick(shape)}
              style={{ margin: '10px', cursor: 'pointer' }}
            >
              {shape.map((row, i) => (
                <div key={i} style={{ display: 'flex' }}>
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: cell
                          ? players[currentPlayer]
                          : 'transparent',
                        border: '1px solid black',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}
    >
      <Settings
        gameMode={gameMode}
        onGameModeChange={setGameMode}
        timerDuration={timerDuration}
        onTimerDurationChange={setTimerDuration}
      />
      <Timer timeLeft={timeLeft} />
      <ScoreBoard scores={scores} currentPlayer={gameModes[gameMode].players[currentPlayer]} />
      <BlokusBoard
        board={board}
        validMoves={validMoves}
        onCellClick={handleCellClick}
      />
      <BlokusShapes
        playerShapes={playerShapes}
        currentPlayer={gameModes[gameMode].players[currentPlayer]}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        firstMoves={new Set([currentPlayer])}
      />
      <div
        style={{
          marginTop: '20px',
          height: '20px',
          color: 'red',
          fontSize: 'calc(12px + 0.5vw)',
        }}
      >
        {message}
      </div>
      {renderOverlay()}
      {showReward && <RewardAnimation />}
    </div>
  );
};

export default BlokusGame;