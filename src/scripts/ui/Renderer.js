// Tetris Game - Renderer Class (Canvas Drawing)
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from '../game/constants.js';

export class Renderer {
  constructor(canvas, nextPieceCanvas = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nextPieceCanvas = nextPieceCanvas;
    this.nextPieceCtx = nextPieceCanvas ? nextPieceCanvas.getContext('2d') : null;

    // Set canvas size
    this.canvas.width = BOARD_WIDTH * CELL_SIZE;
    this.canvas.height = BOARD_HEIGHT * CELL_SIZE;

    if (this.nextPieceCanvas) {
      this.nextPieceCanvas.width = 4 * CELL_SIZE;
      this.nextPieceCanvas.height = 4 * CELL_SIZE;
    }

    // Colors
    this.backgroundColor = '#1a1a2e';
    this.gridColor = '#16213e';
    this.borderColor = '#0f3460';
    this.ghostOpacity = 0.3;
  }

  /**
   * Clear the entire canvas
   */
  clear() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Clear the next piece canvas
   */
  clearNextPiece() {
    if (!this.nextPieceCtx) return;
    this.nextPieceCtx.fillStyle = this.backgroundColor;
    this.nextPieceCtx.fillRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
  }

  /**
   * Draw the game board
   * @param {Board} board - The game board
   */
  drawBoard(board) {
    const grid = board.getState();

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        if (cell !== 0) {
          this.drawCell(x, y, cell);
        }
      }
    }
  }

  /**
   * Draw a single cell
   * @param {number} x - X coordinate (grid)
   * @param {number} y - Y coordinate (grid)
   * @param {string} color - Cell color
   */
  drawCell(x, y, color) {
    const px = x * CELL_SIZE;
    const py = y * CELL_SIZE;

    // Fill cell
    this.ctx.fillStyle = color;
    this.ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

    // Draw border for 3D effect
    this.ctx.strokeStyle = this.borderColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(px + 0.5, py + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);

    // Add highlight for 3D effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, 2);
    this.ctx.fillRect(px + 1, py + 1, 2, CELL_SIZE - 2);
  }

  /**
   * Draw the current piece
   * @param {Tetromino} piece - The tetromino piece
   */
  drawPiece(piece) {
    if (!piece) return;

    const cells = piece.getCells();
    for (const cell of cells) {
      if (cell.y >= 0) {
        this.drawCell(cell.x, cell.y, piece.color);
      }
    }
  }

  /**
   * Draw grid lines
   */
  drawGrid() {
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      const px = x * CELL_SIZE;
      this.ctx.beginPath();
      this.ctx.moveTo(px + 0.5, 0);
      this.ctx.lineTo(px + 0.5, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      const py = y * CELL_SIZE;
      this.ctx.beginPath();
      this.ctx.moveTo(0, py + 0.5);
      this.ctx.lineTo(this.canvas.width, py + 0.5);
      this.ctx.stroke();
    }
  }

  /**
   * Draw ghost piece (shows where piece will land)
   * @param {Tetromino} piece - The current piece
   * @param {Board} board - The game board
   */
  drawGhost(piece, board) {
    if (!piece) return;

    const ghost = piece.clone();

    // Move ghost down until it hits something
    while (board.isValidMove(ghost, 0, 1)) {
      ghost.move(0, 1);
    }

    // Draw ghost with transparency
    const cells = ghost.getCells();
    for (const cell of cells) {
      if (cell.y >= 0) {
        const px = cell.x * CELL_SIZE;
        const py = cell.y * CELL_SIZE;

        this.ctx.fillStyle = piece.color;
        this.ctx.globalAlpha = this.ghostOpacity;
        this.ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        this.ctx.globalAlpha = 1.0;

        // Draw border
        this.ctx.strokeStyle = piece.color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }
    }
  }

  /**
   * Draw the next piece preview
   * @param {Tetromino} piece - The next piece
   */
  drawNextPiece(piece) {
    if (!this.nextPieceCtx || !piece) return;

    this.clearNextPiece();

    // Calculate centering offset
    const shape = piece.shape;
    let minX = 4, maxX = 0, minY = 4, maxY = 0;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const pieceWidth = maxX - minX + 1;
    const pieceHeight = maxY - minY + 1;
    const offsetX = (4 - pieceWidth) / 2 - minX;
    const offsetY = (4 - pieceHeight) / 2 - minY;

    // Draw piece cells
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const px = (x + offsetX) * CELL_SIZE;
          const py = (y + offsetY) * CELL_SIZE;

          // Fill cell
          this.nextPieceCtx.fillStyle = piece.color;
          this.nextPieceCtx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          // Draw border
          this.nextPieceCtx.strokeStyle = this.borderColor;
          this.nextPieceCtx.lineWidth = 1;
          this.nextPieceCtx.strokeRect(px + 0.5, py + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);

          // Add highlight
          this.nextPieceCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          this.nextPieceCtx.fillRect(px + 1, py + 1, CELL_SIZE - 2, 2);
          this.nextPieceCtx.fillRect(px + 1, py + 1, 2, CELL_SIZE - 2);
        }
      }
    }
  }

  /**
   * Draw game over overlay
   */
  drawGameOver() {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Game Over text
    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      'GAME OVER',
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    // Subtitle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(
      'Press R to Restart',
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  }

  /**
   * Render the entire game state
   * @param {Game} game - The game instance
   */
  render(game) {
    this.clear();
    this.drawGrid();
    this.drawBoard(game.board);

    if (game.isPlaying()) {
      const currentPiece = game.getCurrentPiece();
      if (currentPiece) {
        this.drawGhost(currentPiece, game.board);
        this.drawPiece(currentPiece);
      }
    }

    if (game.isGameOver()) {
      this.drawGameOver();
    }

    // Draw next piece
    const nextPiece = game.getNextPiece();
    if (nextPiece) {
      this.drawNextPiece(nextPiece);
    }
  }
}
