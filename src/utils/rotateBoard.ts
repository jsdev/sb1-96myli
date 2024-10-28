export default (board: (string | null)[][], rotation: number) => {
  const size = board.length;
  let rotatedBoard = board.map((row) => [...row]);

  for (let r = 0; r < rotation; r++) {
    rotatedBoard = rotatedBoard[0].map((_, index) =>
      rotatedBoard.map((row) => row[index]).reverse()
    );
  }

  return rotatedBoard;
};
