import { useState, useEffect, useCallback } from 'react';
import { shapes, generateAllOrientations } from './blokus-shapes';
import {
  getValidMovesForShape,
  canPlaceShapeInCorner,
  isValidMoveForShape,
} from './blokus-utils';
import { isAdjacentToSameColor } from './blokus-utils';
import gameModes from './utils/gameModes';

export const useBlokusGame = (initialMode = 'classic') => {
  const [gameMode, setGameMode] = useState(initialMode);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedShape, setSelectedShape] = useState(null);
  const [playerShapes, setPlayerShapes] = useState({});
  const [message, setMessage] = useState('');
  const [overlayShapes, setOverlayShapes] = useState([]);
  const [overlayPosition, setOverlayPosition] = useState({ row: -1, col: -1 });
  const [firstMoves, setFirstMoves] = useState(new Set());
  const [validMoves, setValidMoves] = useState([]);
  const [timerDuration, setTimerDuration] = useState(150);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [scores, setScores] = useState({});
  const [showReward, setShowReward] = useState(false);

  const initializeGame = (mode: string) => {
    const { boardSize, players } = gameModes[mode];
    setBoard(
      Array(boardSize)
        .fill()
        .map(() => Array(boardSize).fill(null))
    );
    setCurrentPlayer(0);
    setSelectedShape(null);
    setPlayerShapes(
      players.reduce(
        (acc, player) => ({
          ...acc,
          [player]: shapes.map((shape) => ({ ...shape, available: true })),
        }),
        {}
      )
    );
    setMessage('');
    setOverlayShapes([]);
    setOverlayPosition({ row: -1, col: -1 });
    setFirstMoves(new Set(players.map((_, i) => i)));
    setValidMoves([]);
    setTimeLeft(timerDuration);
    setScores(players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {}));
  };

  useEffect(() => {
    initializeGame(gameMode);
  }, [gameMode]);

  useEffect(() => {
    updateValidMoves();
  }, [board, currentPlayer, selectedShape, firstMoves, gameMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          nextTurn();
          return timerDuration;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, timerDuration]);

  const updateValidMoves = () => {
    const { players, boardSize } = gameModes[gameMode];
    const isFirstMove = firstMoves.has(currentPlayer);

    if (selectedShape) {
      const newValidMoves = getValidMovesForShape(
        board,
        selectedShape.shape,
        players[currentPlayer],
        isFirstMove
      );
      setValidMoves(newValidMoves);
    } else if (isFirstMove) {
      // Show only valid corner moves for available shapes
      const cornerMoves = [
        [0, 0],
        [0, boardSize - 1],
        [boardSize - 1, 0],
        [boardSize - 1, boardSize - 1],
      ];
      const availableShapes = playerShapes[players[currentPlayer]].filter(
        (shape) => shape.available
      );
      const validCornerMoves = cornerMoves.filter(([row, col]) =>
        availableShapes.some((shape) => {
          const orientations = generateAllOrientations(shape.shape);
          return orientations.some((orientation) =>
            canPlaceShapeInCorner(orientation, row, col, boardSize)
          );
        })
      );
      setValidMoves(validCornerMoves);
    } else {
      setValidMoves([]);
    }
  };

  const handleCellClick = (row, col) => {
    if (!selectedShape) {
      setMessage('Please select a shape first');
      return;
    }

    if (!validMoves.some(([r, c]) => r === row && c === col)) {
      setMessage('Invalid move');
      return;
    }

    const { players, boardSize } = gameModes[gameMode];
    const isFirstMove = firstMoves.has(currentPlayer);
    const currentColor = players[currentPlayer];

    const validOrientations = generateAllOrientations(
      selectedShape.shape
    ).filter(
      (orientation) =>
        isValidMoveForShape(
          board,
          orientation,
          row,
          col,
          currentColor,
          isFirstMove
        ) &&
        orientation.every((shapeRow, i) =>
          shapeRow.every(
            (cell, j) =>
              cell === 0 ||
              (row + i < boardSize &&
                col + j < boardSize &&
                board[row + i][col + j] === null &&
                !isAdjacentToSameColor(board, row + i, col + j, currentColor))
          )
        )
    );

    if (validOrientations.length > 0) {
      setOverlayShapes(validOrientations);
      setOverlayPosition({ row, col });
    } else {
      setMessage('No valid placement for this shape at this position');
    }
  };

  const handleOverlayClick = (shape) => {
    const { players } = gameModes[gameMode];
    placeShape(shape, overlayPosition.row, overlayPosition.col);
    setPlayerShapes((prevShapes) => ({
      ...prevShapes,
      [players[currentPlayer]]: prevShapes[players[currentPlayer]].map((s) =>
        s.id === selectedShape.id ? { ...s, available: false } : s
      ),
    }));
    updateScore(selectedShape);
    setSelectedShape(null);
    nextTurn();
    setMessage('');
    setOverlayShapes([]);
    setOverlayPosition({ row: -1, col: -1 });
    setFirstMoves((prevFirstMoves) => {
      const newFirstMoves = new Set(prevFirstMoves);
      newFirstMoves.delete(currentPlayer);
      return newFirstMoves;
    });
    checkPentominoesCleared();
  };

  const placeShape = (shape, row, col) => {
    const { players } = gameModes[gameMode];
    const newBoard = board.map((row) => [...row]);
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          newBoard[row + i][col + j] = players[currentPlayer];
        }
      }
    }
    setBoard(newBoard);
  };

  const updateScore = (shape) => {
    const { players } = gameModes[gameMode];
    const currentColor = players[currentPlayer];
    const points = getShapePoints(shape);
    setScores((prevScores) => ({
      ...prevScores,
      [currentColor]: prevScores[currentColor] + points,
    }));
  };

  const getShapePoints = (shape) => {
    const size = shape.shape.flat().filter(Boolean).length;
    if (size === 5) return 5;
    if (size === 4) return 4;
    if (size === 3) return 3;
    if (size === 2) return 2;
    return 1;
  };

  const checkPentominoesCleared = () => {
    const { players } = gameModes[gameMode];
    const currentColor = players[currentPlayer];
    const remainingPentominoes = playerShapes[currentColor].filter(
      (shape) => shape.available && shape.shape.flat().filter(Boolean).length === 5
    );
    if (remainingPentominoes.length === 0) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000); // Hide reward after 3 seconds
    }
  };

  const nextTurn = useCallback(() => {
    const { players } = gameModes[gameMode];
    setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % players.length);
    setTimeLeft(timerDuration);
  }, [gameMode, timerDuration]);

  const calculateFinalScores = () => {
    const { players } = gameModes[gameMode];
    const finalScores = { ...scores };
    players.forEach((color) => {
      const remainingShapes = playerShapes[color].filter((shape) => shape.available);
      const penaltyPoints = remainingShapes.reduce((total, shape) => total + getShapePoints(shape), 0);
      finalScores[color] -= penaltyPoints;
    });
    setScores(finalScores);
  };

  return {
    gameMode,
    setGameMode,
    board,
    currentPlayer,
    selectedShape,
    setSelectedShape,
    playerShapes,
    message,
    overlayShapes,
    overlayPosition,
    validMoves,
    handleCellClick,
    handleOverlayClick,
    gameModes,
    timerDuration,
    setTimerDuration,
    timeLeft,
    scores,
    showReward,
    calculateFinalScores,
  };
};