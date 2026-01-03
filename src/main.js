// Tetris Game - Main Entry Point
import { Game } from './scripts/game/Game.js';
import { Renderer } from './scripts/ui/Renderer.js';
import { GAME_STATE } from './scripts/game/constants.js';

// DOM Elements
let gameCanvas;
let nextPieceCanvas;
let scoreElement;
let levelElement;
let linesElement;
let highScoreElement;
let startBtn;
let pauseBtn;
let resetBtn;

// Game instances
let game;
let renderer;
let renderLoopId = null;

// Key bindings
const KEY_BINDINGS = {
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ArrowDown: 'softDrop',
  ArrowUp: 'rotate',
  Space: 'hardDrop',
  KeyP: 'pause',
  Escape: 'pause',
  KeyA: 'moveLeft',
  KeyD: 'moveRight',
  KeyS: 'softDrop',
  KeyW: 'rotate',
  KeyR: 'reset',
};

// Prevent key repeat
const keysPressed = new Set();

/**
 * Initialize the game
 */
function init() {
  // Get DOM elements
  gameCanvas = document.getElementById('gameCanvas');
  nextPieceCanvas = document.getElementById('nextPieceCanvas');
  scoreElement = document.getElementById('score');
  levelElement = document.getElementById('level');
  linesElement = document.getElementById('lines');
  highScoreElement = document.getElementById('highScore');
  startBtn = document.getElementById('startBtn');
  pauseBtn = document.getElementById('pauseBtn');
  resetBtn = document.getElementById('resetBtn');

  // Create game and renderer instances
  game = new Game();
  renderer = new Renderer(gameCanvas, nextPieceCanvas);

  // Bind event listeners
  bindEvents();

  // Initialize UI
  updateUI();

  // Load high score from localStorage
  loadHighScore();

  console.log('Tetris Game initialized!');
  console.log('Press START button or use keyboard controls to play');
}

/**
 * Bind event listeners
 */
function bindEvents() {
  // Button events
  startBtn.addEventListener('click', handleStart);
  pauseBtn.addEventListener('click', handlePause);
  resetBtn.addEventListener('click', handleReset);

  // Keyboard events
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Prevent default behavior for game keys
  document.addEventListener('keydown', (e) => {
    if (KEY_BINDINGS[e.code]) {
      e.preventDefault();
    }
  });
}

/**
 * Handle start button click
 */
function handleStart() {
  game.start();
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  startRenderLoop();
  updateUI();
}

/**
 * Handle pause button click
 */
function handlePause() {
  game.togglePause();

  if (game.isPaused()) {
    pauseBtn.textContent = '再開';
  } else {
    pauseBtn.textContent = 'ポーズ';
  }
}

/**
 * Handle reset button click
 */
function handleReset() {
  game.reset();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = 'ポーズ';
  stopRenderLoop();
  renderer.clear();
  renderer.clearNextPiece();
  updateUI();
}

/**
 * Handle key down events
 */
function handleKeyDown(e) {
  const action = KEY_BINDINGS[e.code];

  if (!action || keysPressed.has(e.code)) {
    return;
  }

  keysPressed.add(e.code);

  switch (action) {
    case 'moveLeft':
      game.moveLeft();
      break;
    case 'moveRight':
      game.moveRight();
      break;
    case 'softDrop':
      game.softDrop();
      break;
    case 'rotate':
      game.rotatePiece();
      break;
    case 'hardDrop':
      game.hardDrop();
      break;
    case 'pause':
      if (game.isPlaying() || game.isPaused()) {
        handlePause();
      }
      break;
    case 'reset':
      if (game.isGameOver()) {
        handleReset();
        handleStart();
      }
      break;
  }
}

/**
 * Handle key up events
 */
function handleKeyUp(e) {
  keysPressed.delete(e.code);
}

/**
 * Start render loop
 */
function startRenderLoop() {
  if (renderLoopId !== null) {
    return;
  }

  function render() {
    renderer.render(game);
    updateUI();

    // Check for game over
    if (game.isGameOver()) {
      handleGameOver();
      return;
    }

    renderLoopId = requestAnimationFrame(render);
  }

  render();
}

/**
 * Stop render loop
 */
function stopRenderLoop() {
  if (renderLoopId !== null) {
    cancelAnimationFrame(renderLoopId);
    renderLoopId = null;
  }
}

/**
 * Update UI elements
 */
function updateUI() {
  const stats = game.getScoreStats();

  scoreElement.textContent = stats.score.toLocaleString();
  levelElement.textContent = stats.level;
  linesElement.textContent = stats.lines;
}

/**
 * Handle game over
 */
function handleGameOver() {
  stopRenderLoop();
  renderer.render(game); // Render final state with game over overlay

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = 'ポーズ';

  // Update high score
  const stats = game.getScoreStats();
  updateHighScore(stats.score);

  console.log('Game Over!');
  console.log(`Final Score: ${stats.score}`);
  console.log('Press R to restart or click START button');
}

/**
 * Load high score from localStorage
 */
function loadHighScore() {
  const savedHighScore = localStorage.getItem('tetris_highscore');
  if (savedHighScore) {
    highScoreElement.textContent = parseInt(savedHighScore).toLocaleString();
  }
}

/**
 * Update and save high score
 * @param {number} score - Current score
 */
function updateHighScore(score) {
  const currentHighScore = parseInt(localStorage.getItem('tetris_highscore') || '0');

  if (score > currentHighScore) {
    localStorage.setItem('tetris_highscore', score.toString());
    highScoreElement.textContent = score.toLocaleString();
    console.log(`New High Score: ${score}`);
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
