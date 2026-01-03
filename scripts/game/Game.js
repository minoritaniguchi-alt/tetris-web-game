// Tetris Game - Game Class (Main Game Engine)
import { Board } from './Board.js';
import { Tetromino } from './Tetromino.js';
import { Score } from './Score.js';
import { GAME_STATE } from './constants.js';

export class Game {
  constructor() {
    this.board = new Board();
    this.score = new Score();
    this.currentPiece = null;
    this.nextPiece = null;
    this.state = GAME_STATE.IDLE;
    this.dropTimer = 0;
    this.dropInterval = 0;
    this.lastTime = 0;
    this.animationFrameId = null;
  }

  /**
   * Initialize the game
   */
  init() {
    this.board.init();
    this.score.init();
    this.currentPiece = null;
    this.nextPiece = null;
    this.state = GAME_STATE.IDLE;
    this.dropTimer = 0;
    this.dropInterval = this.score.getDropSpeed();
    this.lastTime = 0;
  }

  /**
   * Start the game
   */
  start() {
    if (this.state === GAME_STATE.PLAYING) {
      return;
    }

    this.init();
    this.spawnPiece();
    this.spawnNextPiece();
    this.state = GAME_STATE.PLAYING;
    this.dropInterval = this.score.getDropSpeed();
    this.lastTime = performance.now();
    this.gameLoop();
  }

  /**
   * Pause the game
   */
  pause() {
    if (this.state !== GAME_STATE.PLAYING) {
      return;
    }

    this.state = GAME_STATE.PAUSED;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume the game
   */
  resume() {
    if (this.state !== GAME_STATE.PAUSED) {
      return;
    }

    this.state = GAME_STATE.PLAYING;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  /**
   * Reset the game
   */
  reset() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.init();
  }

  /**
   * Main game loop
   */
  gameLoop() {
    if (this.state !== GAME_STATE.PLAYING) {
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Update game state
   * @param {number} deltaTime - Time elapsed since last update (milliseconds)
   */
  update(deltaTime) {
    if (this.state !== GAME_STATE.PLAYING || !this.currentPiece) {
      return;
    }

    this.dropTimer += deltaTime;

    if (this.dropTimer >= this.dropInterval) {
      this.dropTimer = 0;
      this.moveDown();
    }
  }

  /**
   * Spawn a new piece at the top of the board
   */
  spawnPiece() {
    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
      this.nextPiece = null;
    } else {
      this.currentPiece = new Tetromino();
    }

    // Check if piece can be placed (game over if not)
    if (!this.board.isValidMove(this.currentPiece, 0, 0)) {
      this.gameOver();
    }
  }

  /**
   * Spawn the next piece (for preview)
   */
  spawnNextPiece() {
    this.nextPiece = new Tetromino();
  }

  /**
   * Move piece left
   * @returns {boolean} - True if move was successful
   */
  moveLeft() {
    if (!this.currentPiece || this.state !== GAME_STATE.PLAYING) {
      return false;
    }

    if (this.board.isValidMove(this.currentPiece, -1, 0)) {
      this.currentPiece.move(-1, 0);
      return true;
    }
    return false;
  }

  /**
   * Move piece right
   * @returns {boolean} - True if move was successful
   */
  moveRight() {
    if (!this.currentPiece || this.state !== GAME_STATE.PLAYING) {
      return false;
    }

    if (this.board.isValidMove(this.currentPiece, 1, 0)) {
      this.currentPiece.move(1, 0);
      return true;
    }
    return false;
  }

  /**
   * Move piece down (soft drop)
   * @returns {boolean} - True if move was successful
   */
  moveDown() {
    if (!this.currentPiece || this.state !== GAME_STATE.PLAYING) {
      return false;
    }

    if (this.board.isValidMove(this.currentPiece, 0, 1)) {
      this.currentPiece.move(0, 1);
      this.dropTimer = 0;
      return true;
    } else {
      // Piece can't move down, lock it
      this.lockPiece();
      return false;
    }
  }

  /**
   * Soft drop (player manually drops piece faster)
   * @returns {number} - Number of cells dropped
   */
  softDrop() {
    if (!this.currentPiece || this.state !== GAME_STATE.PLAYING) {
      return 0;
    }

    let cellsDropped = 0;
    while (this.board.isValidMove(this.currentPiece, 0, 1)) {
      this.currentPiece.move(0, 1);
      cellsDropped++;
    }

    if (cellsDropped > 0) {
      this.score.addSoftDropScore(cellsDropped);
      this.dropTimer = 0;
    }

    return cellsDropped;
  }

  /**
   * Hard drop (instant drop to bottom)
   * @returns {number} - Number of cells dropped
   */
  hardDrop() {
    if (!this.currentPiece || this.state !== GAME_STATE.PLAYING) {
      return 0;
    }

    let cellsDropped = 0;
    while (this.board.isValidMove(this.currentPiece, 0, 1)) {
      this.currentPiece.move(0, 1);
      cellsDropped++;
    }

    if (cellsDropped > 0) {
      this.score.addHardDropScore(cellsDropped);
    }

    this.lockPiece();
    return cellsDropped;
  }

  /**
   * Rotate piece clockwise with SRS (Super Rotation System)
   * @returns {boolean} - True if rotation was successful
   */
  rotatePiece() {
    if (!this.currentPiece || this.state !== GAME_STATE.PLAYING) {
      return false;
    }

    return this.tryRotate();
  }

  /**
   * Try to rotate piece with wall kicks (SRS)
   * @returns {boolean} - True if rotation was successful
   */
  tryRotate() {
    const originalShape = JSON.parse(JSON.stringify(this.currentPiece.shape));
    const originalRotation = this.currentPiece.rotation;

    // Rotate the piece
    this.currentPiece.rotate();

    // Try standard position first
    if (this.board.isValidMove(this.currentPiece, 0, 0)) {
      return true;
    }

    // Wall kick offsets to try
    const kicks = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [-1, -1],
      [1, -1],
      [0, 1],
      [-2, 0],
      [2, 0],
    ];

    // Try each wall kick offset
    for (const [dx, dy] of kicks) {
      if (this.board.isValidMove(this.currentPiece, dx, dy)) {
        this.currentPiece.move(dx, dy);
        return true;
      }
    }

    // Rotation failed, revert to original state
    this.currentPiece.shape = originalShape;
    this.currentPiece.rotation = originalRotation;
    return false;
  }

  /**
   * Lock the current piece in place
   */
  lockPiece() {
    if (!this.currentPiece) {
      return;
    }

    this.board.placePiece(this.currentPiece);
    this.clearLines();
    this.currentPiece = null;
    this.spawnPiece();
    this.spawnNextPiece();

    // Update drop interval based on current level
    this.dropInterval = this.score.getDropSpeed();
  }

  /**
   * Clear completed lines and update score
   * @returns {number} - Number of lines cleared
   */
  clearLines() {
    const fullRows = this.board.getFullRows();

    if (fullRows.length > 0) {
      const linesCleared = this.board.clearRows(fullRows);
      this.score.addLinesScore(linesCleared);
      return linesCleared;
    }

    return 0;
  }

  /**
   * Check and handle game over
   */
  gameOver() {
    this.state = GAME_STATE.GAME_OVER;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get current game state
   * @returns {string} - Current game state
   */
  getState() {
    return this.state;
  }

  /**
   * Check if game is playing
   * @returns {boolean} - True if game is playing
   */
  isPlaying() {
    return this.state === GAME_STATE.PLAYING;
  }

  /**
   * Check if game is paused
   * @returns {boolean} - True if game is paused
   */
  isPaused() {
    return this.state === GAME_STATE.PAUSED;
  }

  /**
   * Check if game is over
   * @returns {boolean} - True if game is over
   */
  isGameOver() {
    return this.state === GAME_STATE.GAME_OVER;
  }

  /**
   * Get current board state
   * @returns {Array} - Current board grid
   */
  getBoardState() {
    return this.board.getState();
  }

  /**
   * Get current piece
   * @returns {Tetromino} - Current piece
   */
  getCurrentPiece() {
    return this.currentPiece;
  }

  /**
   * Get next piece
   * @returns {Tetromino} - Next piece
   */
  getNextPiece() {
    return this.nextPiece;
  }

  /**
   * Get score statistics
   * @returns {object} - Score statistics
   */
  getScoreStats() {
    return this.score.getStats();
  }

  /**
   * Toggle pause
   */
  togglePause() {
    if (this.state === GAME_STATE.PLAYING) {
      this.pause();
    } else if (this.state === GAME_STATE.PAUSED) {
      this.resume();
    }
  }
}
