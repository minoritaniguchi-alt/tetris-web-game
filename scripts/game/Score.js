// Tetris Game - Score Class
import { SCORING, LINES_PER_LEVEL, MAX_LEVEL, LEVEL_SPEEDS } from './constants.js';

export class Score {
  constructor() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.linesInCurrentLevel = 0;
  }

  /**
   * Initialize or reset the score
   */
  init() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.linesInCurrentLevel = 0;
  }

  /**
   * Add score for cleared lines
   * @param {number} linesCleared - Number of lines cleared (1-4)
   * @returns {number} - Points earned
   */
  addLinesScore(linesCleared) {
    if (linesCleared <= 0 || linesCleared > 4) {
      return 0;
    }

    let baseScore = 0;
    switch (linesCleared) {
      case 1:
        baseScore = SCORING.SINGLE;
        break;
      case 2:
        baseScore = SCORING.DOUBLE;
        break;
      case 3:
        baseScore = SCORING.TRIPLE;
        break;
      case 4:
        baseScore = SCORING.TETRIS;
        break;
    }

    // Score is multiplied by current level
    const earnedScore = baseScore * this.level;
    this.score += earnedScore;
    this.lines += linesCleared;
    this.linesInCurrentLevel += linesCleared;

    // Check for level up
    this.checkLevelUp();

    return earnedScore;
  }

  /**
   * Add score for soft drop (when player manually moves piece down)
   * @param {number} cells - Number of cells dropped
   * @returns {number} - Points earned
   */
  addSoftDropScore(cells) {
    if (cells <= 0) {
      return 0;
    }

    const earnedScore = cells * SCORING.SOFT_DROP;
    this.score += earnedScore;
    return earnedScore;
  }

  /**
   * Add score for hard drop (instant drop to bottom)
   * @param {number} cells - Number of cells dropped
   * @returns {number} - Points earned
   */
  addHardDropScore(cells) {
    if (cells <= 0) {
      return 0;
    }

    const earnedScore = cells * SCORING.HARD_DROP;
    this.score += earnedScore;
    return earnedScore;
  }

  /**
   * Check if player should level up
   * @returns {boolean} - True if leveled up, false otherwise
   */
  checkLevelUp() {
    if (this.linesInCurrentLevel >= LINES_PER_LEVEL && this.level < MAX_LEVEL) {
      this.level++;
      this.linesInCurrentLevel = 0;
      return true;
    }
    return false;
  }

  /**
   * Get the current level
   * @returns {number} - Current level
   */
  getLevel() {
    return this.level;
  }

  /**
   * Get the current score
   * @returns {number} - Current score
   */
  getScore() {
    return this.score;
  }

  /**
   * Get total lines cleared
   * @returns {number} - Total lines cleared
   */
  getLines() {
    return this.lines;
  }

  /**
   * Get lines cleared in current level
   * @returns {number} - Lines in current level
   */
  getLinesInCurrentLevel() {
    return this.linesInCurrentLevel;
  }

  /**
   * Get lines needed for next level
   * @returns {number} - Lines needed for next level (0 if at max level)
   */
  getLinesUntilNextLevel() {
    if (this.level >= MAX_LEVEL) {
      return 0;
    }
    return LINES_PER_LEVEL - this.linesInCurrentLevel;
  }

  /**
   * Get drop speed for current level (milliseconds)
   * @returns {number} - Drop speed in milliseconds
   */
  getDropSpeed() {
    return LEVEL_SPEEDS[this.level] || LEVEL_SPEEDS[MAX_LEVEL];
  }

  /**
   * Get current game statistics
   * @returns {object} - Object containing all score statistics
   */
  getStats() {
    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
      linesInCurrentLevel: this.linesInCurrentLevel,
      linesUntilNextLevel: this.getLinesUntilNextLevel(),
      dropSpeed: this.getDropSpeed(),
    };
  }

  /**
   * Set score state (useful for loading saved games)
   * @param {object} state - Score state object
   */
  setState(state) {
    if (!state) {
      throw new Error('Invalid score state');
    }

    this.score = state.score || 0;
    this.level = state.level || 1;
    this.lines = state.lines || 0;
    this.linesInCurrentLevel = state.linesInCurrentLevel || 0;

    // Validate level
    if (this.level > MAX_LEVEL) {
      this.level = MAX_LEVEL;
    }
    if (this.level < 1) {
      this.level = 1;
    }
  }

  /**
   * Get score state (useful for saving games)
   * @returns {object} - Score state object
   */
  getState() {
    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
      linesInCurrentLevel: this.linesInCurrentLevel,
    };
  }

  /**
   * Reset score to initial state
   */
  reset() {
    this.init();
  }
}
