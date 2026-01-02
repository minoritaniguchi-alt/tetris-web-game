// Tetris Game - Tetromino Class
import { TETROMINOS, TETROMINO_TYPES } from './constants.js';

export class Tetromino {
  constructor(type = null) {
    // If no type specified, pick random
    this.type = type || this.getRandomType();

    const config = TETROMINOS[this.type];
    this.shape = JSON.parse(JSON.stringify(config.shape)); // Deep copy
    this.color = config.color;
    this.position = { x: 3, y: 0 }; // Start position (center top)
    this.rotation = 0; // 0, 1, 2, 3 (0-360 degrees in 90-degree increments)
  }

  /**
   * Get random tetromino type
   */
  static getRandomType() {
    return TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  }

  getRandomType() {
    return Tetromino.getRandomType();
  }

  /**
   * Rotate the tetromino 90 degrees clockwise
   */
  rotate() {
    const N = this.shape.length;
    const rotated = Array(N)
      .fill(0)
      .map(() => Array(N).fill(0));

    // Transpose and reverse each row (90-degree rotation)
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[j][N - 1 - i] = this.shape[i][j];
      }
    }

    this.shape = rotated;
    this.rotation = (this.rotation + 1) % 4;
  }

  /**
   * Get rotated shape without modifying current state
   */
  getRotatedShape() {
    const N = this.shape.length;
    const rotated = Array(N)
      .fill(0)
      .map(() => Array(N).fill(0));

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[j][N - 1 - i] = this.shape[i][j];
      }
    }

    return rotated;
  }

  /**
   * Get array of occupied cells relative to position
   * Returns array of {x, y} coordinates
   */
  getCells() {
    const cells = [];
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          cells.push({
            x: this.position.x + col,
            y: this.position.y + row,
          });
        }
      }
    }
    return cells;
  }

  /**
   * Get cells with offset (for testing movement)
   */
  getCellsWithOffset(offsetX = 0, offsetY = 0) {
    const cells = [];
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          cells.push({
            x: this.position.x + col + offsetX,
            y: this.position.y + row + offsetY,
          });
        }
      }
    }
    return cells;
  }

  /**
   * Move the tetromino
   */
  move(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
  }

  /**
   * Clone the tetromino (deep copy)
   */
  clone() {
    const cloned = new Tetromino(this.type);
    cloned.shape = JSON.parse(JSON.stringify(this.shape));
    cloned.position = { ...this.position };
    cloned.rotation = this.rotation;
    return cloned;
  }
}
