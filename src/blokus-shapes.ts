export const shapes = [
  { id: 'monomino', shape: [[1]] },
  { id: 'domino', shape: [[1, 1]] },
  { id: 'tromino-I', shape: [[1, 1, 1]] },
  {
    id: 'tromino-L',
    shape: [
      [1, 1],
      [1, 0],
    ],
  },
  {
    id: 'tetromino-O',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  { id: 'tetromino-I', shape: [[1, 1, 1, 1]] },
  {
    id: 'tetromino-T',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    id: 'tetromino-L',
    shape: [
      [1, 1, 1],
      [1, 0, 0],
    ],
  },
  {
    id: 'tetromino-S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  { id: 'pentomino-I', shape: [[1, 1, 1, 1, 1]] },
  {
    id: 'pentomino-F',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    id: 'pentomino-L',
    shape: [
      [1, 1, 1, 1],
      [1, 0, 0, 0],
    ],
  },
  {
    id: 'pentomino-N',
    shape: [
      [1, 1, 0, 0],
      [0, 1, 1, 1],
    ],
  },
  {
    id: 'pentomino-P',
    shape: [
      [1, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    id: 'pentomino-T',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    id: 'pentomino-U',
    shape: [
      [1, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    id: 'pentomino-V',
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    id: 'pentomino-W',
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  {
    id: 'pentomino-X',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    id: 'pentomino-Y',
    shape: [
      [0, 1],
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  },
  {
    id: 'pentomino-Z',
    shape: [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
  },
];

export const rotateShape = (shape) => {
  return shape[0].map((_, index) => shape.map((row) => row[index]).reverse());
};

export const flipShape = (shape) => {
  return shape.map((row) => [...row].reverse());
};

export const generateAllOrientations = (shape: number[][]): number[][][] => {
  const orientations: number[][][] = [];
  let current = shape;

  for (let flip = 0; flip < 2; flip++) {
    for (let rotation = 0; rotation < 4; rotation++) {
      orientations.push(current);
      current = rotateShape(current);
    }
    current = flipShape(current);
  }

  return orientations.filter(
    (orientation, index, self) =>
      index ===
      self.findIndex((t) => JSON.stringify(t) === JSON.stringify(orientation))
  );
};

export const canPlaceInCorner = (shape) => {
  return shape.some((row, i) =>
    row.some(
      (cell, j) =>
        cell &&
        ((i === 0 && j === 0) ||
          (i === 0 && j === row.length - 1) ||
          (i === shape.length - 1 && j === 0) ||
          (i === shape.length - 1 && j === row.length - 1))
    )
  );
};
