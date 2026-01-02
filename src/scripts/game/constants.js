// Tetris Game - Constants and Configuration

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

// Tetromino shapes (4x4 matrix)
export const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0', // Cyan
  },
  O: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: '#f0f000', // Yellow
  },
  T: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: '#a000f0', // Purple
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f000', // Green
  },
  Z: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: '#f00000', // Red
  },
  J: {
    shape: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: '#0000f0', // Blue
  },
  L: {
    shape: [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: '#f0a000', // Orange
  },
};

// Tetromino types array for random selection
export const TETROMINO_TYPES = Object.keys(TETROMINOS);

// Scoring system
export const SCORING = {
  SINGLE: 100, // 1 line
  DOUBLE: 300, // 2 lines
  TRIPLE: 500, // 3 lines
  TETRIS: 800, // 4 lines
  SOFT_DROP: 1, // per cell
  HARD_DROP: 2, // per cell
};

// Level speeds (milliseconds per drop)
export const LEVEL_SPEEDS = {
  1: 1000,
  2: 900,
  3: 800,
  4: 700,
  5: 600,
  6: 500,
  7: 400,
  8: 300,
  9: 250,
  10: 200,
  11: 170,
  12: 140,
  13: 110,
  14: 80,
  15: 50,
};

// Level up conditions
export const LINES_PER_LEVEL = 10;
export const MAX_LEVEL = 15;

// Key bindings
export const KEYS = {
  LEFT: ['ArrowLeft', 'KeyA'],
  RIGHT: ['ArrowRight', 'KeyD'],
  DOWN: ['ArrowDown', 'KeyS'],
  ROTATE: ['ArrowUp', 'KeyW'],
  HARD_DROP: [' ', 'Space'],
  PAUSE: ['KeyP', 'Escape'],
};

// Game states
export const GAME_STATE = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
};
