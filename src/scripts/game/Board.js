// Tetris Game - Board Class
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants.js';

export class Board {
  constructor(width = BOARD_WIDTH, height = BOARD_HEIGHT) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.init();
  }

  /**
   * Initialize the board with empty cells
   */
  init() {
    this.grid = Array(this.height)
      .fill(0)
      .map(() => Array(this.width).fill(0));
  }

  /**
   * Check if a piece can be placed at the given position
   * @param {Tetromino} piece - The tetromino piece
   * @param {number} offsetX - X offset to test (default: 0)
   * @param {number} offsetY - Y offset to test (default: 0)
   * @returns {boolean} - True if valid move, false otherwise
   */
  isValidMove(piece, offsetX = 0, offsetY = 0) {
    const cells = piece.getCellsWithOffset(offsetX, offsetY);

    for (const cell of cells) {
      // Check boundaries
      if (cell.x < 0 || cell.x >= this.width || cell.y >= this.height) {
        return false;
      }

      // Allow pieces above the board (cell.y < 0) during spawn
      if (cell.y < 0) {
        continue;
      }

      // Check collision with existing blocks
      if (this.grid[cell.y][cell.x] !== 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Place a piece on the board (lock it in place)
   * @param {Tetromino} piece - The tetromino piece to place
   */
  placePiece(piece) {
    const cells = piece.getCells();

    for (const cell of cells) {
      // Only place cells that are within the board
      if (cell.y >= 0 && cell.y < this.height && cell.x >= 0 && cell.x < this.width) {
        this.grid[cell.y][cell.x] = piece.color;
      }
    }
  }

  /**
   * Get all rows that are completely filled
   * @returns {number[]} - Array of row indices that are full
   */
  getFullRows() {
    const fullRows = [];

    for (let y = 0; y < this.height; y++) {
      if (this.grid[y].every((cell) => cell !== 0)) {
        fullRows.push(y);
      }
    }

    return fullRows;
  }

  /**
   * Clear the specified rows and add new empty rows at the top
   * @param {number[]} rowIndices - Array of row indices to clear
   * @returns {number} - Number of rows cleared
   */
  clearRows(rowIndices) {
    if (!rowIndices || rowIndices.length === 0) {
      return 0;
    }

    // Sort in descending order to remove from bottom to top
    const sortedRows = [...rowIndices].sort((a, b) => b - a);

    // Remove each row
    for (const rowIndex of sortedRows) {
      this.grid.splice(rowIndex, 1);
    }

    // Add new empty rows at the top
    for (let i = 0; i < sortedRows.length; i++) {
      this.grid.unshift(Array(this.width).fill(0));
    }

    return sortedRows.length;
  }

  /**
   * Get the current state of the board
   * @returns {Array<Array<number|string>>} - Deep copy of the grid
   */
  getState() {
    return this.grid.map((row) => [...row]);
  }

  /**
   * Set the board state
   * @param {Array<Array<number|string>>} state - The board state to set
   */
  setState(state) {
    if (!state || state.length !== this.height) {
      throw new Error('Invalid board state');
    }

    this.grid = state.map((row) => {
      if (row.length !== this.width) {
        throw new Error('Invalid board row width');
      }
      return [...row];
    });
  }

  /**
   * Get the value at a specific cell
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {number|string|null} - Cell value or null if out of bounds
   */
  getCellAt(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  /**
   * Check if a cell is empty
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} - True if empty, false otherwise
   */
  isEmpty(x, y) {
    const cell = this.getCellAt(x, y);
    return cell === 0;
  }

  /**
   * Clear the entire board
   */
  clear() {
    this.init();
  }

  /**
   * Reset the board to initial state
   */
  reset() {
    this.init();
  }
}
