import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import PieceSelector from './components/PieceSelector';
import { Cell, Color, Piece, GameState, Corner } from './types';
import { initializeBoard, initializePieces, isValidMove, placePiece, nextPlayer, hasValidMoves, rotatePiece, flipPiece, getPlayerCorner, calculateScore } from './utils/gameLogic';
import { Square, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const players: Color[] = ['green', 'yellow', 'red', 'blue'];
    const corners = getPlayerCorner(players);
    return {
      board: initializeBoard(),
      currentPlayer: 'green',
      pieces: initializePieces(),
      placedFirstPiece: [false, false, false, false],
      selectedPiece: null,
      rotation: 0,
      flippedHorizontal: false,
      flippedVertical: false,
      playerCorners: corners,
    };
  });

  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    checkGameOver();
  }, [gameState.currentPlayer]);

  const checkGameOver = () => {
    const playerIndex = ['green', 'yellow', 'red', 'blue'].indexOf(gameState.currentPlayer);
    const isFirstMove = !gameState.placedFirstPiece[playerIndex];
    const playerCorner = gameState.playerCorners[playerIndex];

    if (!hasValidMoves(gameState.board, gameState.pieces[playerIndex], isFirstMove, playerCorner)) {
      setGameOver(true);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.selectedPiece && !gameOver) {
      const playerIndex = ['green', 'yellow', 'red', 'blue'].indexOf(gameState.currentPlayer);
      const isFirstMove = !gameState.placedFirstPiece[playerIndex];
      const playerCorner = gameState.playerCorners[playerIndex];

      let pieceShape = gameState.selectedPiece.shape;
      if (gameState.rotation > 0) {
        pieceShape = rotatePiece(gameState.selectedPiece, gameState.rotation);
      }
      if (gameState.flippedHorizontal) {
        pieceShape = flipPiece(pieceShape, 'horizontal');
      }
      if (gameState.flippedVertical) {
        pieceShape = flipPiece(pieceShape, 'vertical');
      }

      if (isValidMove(gameState.board, { ...gameState.selectedPiece, shape: pieceShape }, row, col, isFirstMove, playerCorner)) {
        const newBoard = placePiece(gameState.board, { ...gameState.selectedPiece, shape: pieceShape }, row, col);
        const newPieces = gameState.pieces.map((playerPieces, index) =>
          index === playerIndex
            ? playerPieces.filter((piece) => piece.id !== gameState.selectedPiece!.id)
            : playerPieces
        );
        const newPlacedFirstPiece = [...gameState.placedFirstPiece];
        newPlacedFirstPiece[playerIndex] = true;

        setGameState({
          ...gameState,
          board: newBoard,
          currentPlayer: nextPlayer(gameState.currentPlayer),
          pieces: newPieces,
          placedFirstPiece: newPlacedFirstPiece,
          selectedPiece: null,
          rotation: 0,
          flippedHorizontal: false,
          flippedVertical: false,
        });
      }
    }
  };

  const handleSelectPiece = (piece: Piece) => {
    setGameState({
      ...gameState,
      selectedPiece: piece,
      rotation: 0,
      flippedHorizontal: false,
      flippedVertical: false,
    });
  };

  const handleRotate = () => {
    if (gameState.selectedPiece) {
      setGameState({
        ...gameState,
        rotation: (gameState.rotation + 1) % 4,
      });
    }
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (gameState.selectedPiece) {
      setGameState({
        ...gameState,
        flippedHorizontal: direction === 'horizontal' ? !gameState.flippedHorizontal : gameState.flippedHorizontal,
        flippedVertical: direction === 'vertical' ? !gameState.flippedVertical : gameState.flippedVertical,
      });
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Blokus</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <Board
            board={gameState.board}
            onCellClick={handleCellClick}
            isFirstMove={!gameState.placedFirstPiece[['green', 'yellow', 'red', 'blue'].indexOf(gameState.currentPlayer)]}
            playerCorner={gameState.playerCorners[['green', 'yellow', 'red', 'blue'].indexOf(gameState.currentPlayer)]}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-semibold flex items-center gap-2">
            Current Player: <Square className={`w-6 h-6 ${gameState.currentPlayer}`} />
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleRotate}
              disabled={!gameState.selectedPiece}
            >
              <RotateCw className="w-6 h-6" />
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleFlip('horizontal')}
              disabled={!gameState.selectedPiece}
            >
              <FlipHorizontal className="w-6 h-6" />
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => handleFlip('vertical')}
              disabled={!gameState.selectedPiece}
            >
              <FlipVertical className="w-6 h-6" />
            </button>
          </div>
          <PieceSelector
            pieces={gameState.pieces[['green', 'yellow', 'red', 'blue'].indexOf(gameState.currentPlayer)]}
            color={gameState.currentPlayer}
            onSelectPiece={handleSelectPiece}
            selectedPiece={gameState.selectedPiece}
          />
          {gameOver && (
            <div className="mt-4 text-xl font-bold">
              Game Over! Final Scores:
              <ul>
                <li>Green: {calculateScore(gameState.board, 'green')}</li>
                <li>Yellow: {calculateScore(gameState.board, 'yellow')}</li>
                <li>Red: {calculateScore(gameState.board, 'red')}</li>
                <li>Blue: {calculateScore(gameState.board, 'blue')}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;