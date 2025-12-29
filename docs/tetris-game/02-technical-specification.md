# テトリス Webゲーム - 技術仕様書

## 1. システムアーキテクチャ

### 1.1 全体構成
```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│  ┌───────────────────────────────┐  │
│  │     Presentation Layer        │  │
│  │  (HTML/CSS/Canvas Rendering)  │  │
│  └───────────────────────────────┘  │
│              ↕                      │
│  ┌───────────────────────────────┐  │
│  │      Game Logic Layer         │  │
│  │   (Game Engine, State Mgmt)   │  │
│  └───────────────────────────────┘  │
│              ↕                      │
│  ┌───────────────────────────────┐  │
│  │       Data Layer              │  │
│  │    (LocalStorage API)         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 1.2 レイヤー構成

#### 1.2.1 プレゼンテーション層
- UI コンポーネント
- Canvas レンダリング
- イベントハンドラー
- アニメーション制御

#### 1.2.2 ゲームロジック層
- ゲームエンジン
- 状態管理
- スコア計算
- 衝突判定

#### 1.2.3 データ層
- ローカルストレージ管理
- ゲーム設定管理
- ハイスコア管理

## 2. ディレクトリ構成

```
tetris-game/
├── docs/                    # ドキュメント
│   ├── 00-SOW.md
│   ├── 01-requirements.md
│   ├── 02-technical-specification.md
│   └── 03-wbs.md
├── src/                     # ソースコード
│   ├── index.html          # エントリーポイント
│   ├── styles/             # スタイルシート
│   │   ├── main.css
│   │   ├── game.css
│   │   └── responsive.css
│   ├── scripts/            # JavaScript
│   │   ├── main.js         # エントリーポイント
│   │   ├── game/           # ゲームロジック
│   │   │   ├── Game.js     # ゲームエンジン
│   │   │   ├── Board.js    # ゲームボード
│   │   │   ├── Tetromino.js # テトリミノクラス
│   │   │   ├── Score.js    # スコア管理
│   │   │   └── constants.js # 定数定義
│   │   ├── ui/             # UI関連
│   │   │   ├── Renderer.js # Canvas描画
│   │   │   ├── UI.js       # UIコントローラー
│   │   │   └── Sound.js    # サウンド管理
│   │   └── utils/          # ユーティリティ
│   │       ├── Storage.js  # ストレージ管理
│   │       └── helpers.js  # ヘルパー関数
│   └── assets/             # アセット
│       ├── images/
│       └── sounds/
├── tests/                  # テストコード
│   ├── unit/
│   │   ├── Game.test.js
│   │   ├── Board.test.js
│   │   ├── Tetromino.test.js
│   │   └── Score.test.js
│   └── integration/
├── dist/                   # ビルド出力
├── package.json
├── webpack.config.js       # または vite.config.js
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## 3. データモデル

### 3.1 ゲーム状態 (GameState)
```javascript
{
  board: Array<Array<number>>,  // 20x10のボード状態
  currentPiece: Tetromino,       // 現在のテトリミノ
  nextPiece: Tetromino,          // 次のテトリミノ
  score: number,                 // 現在のスコア
  level: number,                 // 現在のレベル
  lines: number,                 // 消去したライン数
  isPlaying: boolean,            // ゲーム進行中か
  isPaused: boolean,             // 一時停止中か
  isGameOver: boolean,           // ゲームオーバーか
  dropInterval: number,          // 落下速度（ミリ秒）
  lastDropTime: number           // 最後に落下した時刻
}
```

### 3.2 テトリミノ (Tetromino)
```javascript
{
  type: string,                  // 'I', 'O', 'T', 'S', 'Z', 'J', 'L'
  shape: Array<Array<number>>,   // 形状 (4x4マトリクス)
  position: {x: number, y: number}, // ボード上の位置
  color: string,                 // 色
  rotation: number               // 回転状態 (0-3)
}
```

### 3.3 テトリミノ定義
```javascript
const TETROMINOS = {
  I: {
    shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    color: '#00f0f0'  // Cyan
  },
  O: {
    shape: [[0,0,0,0], [0,1,1,0], [0,1,1,0], [0,0,0,0]],
    color: '#f0f000'  // Yellow
  },
  T: {
    shape: [[0,0,0,0], [0,1,0,0], [1,1,1,0], [0,0,0,0]],
    color: '#a000f0'  // Purple
  },
  S: {
    shape: [[0,0,0,0], [0,1,1,0], [1,1,0,0], [0,0,0,0]],
    color: '#00f000'  // Green
  },
  Z: {
    shape: [[0,0,0,0], [1,1,0,0], [0,1,1,0], [0,0,0,0]],
    color: '#f00000'  // Red
  },
  J: {
    shape: [[0,0,0,0], [1,0,0,0], [1,1,1,0], [0,0,0,0]],
    color: '#0000f0'  // Blue
  },
  L: {
    shape: [[0,0,0,0], [0,0,1,0], [1,1,1,0], [0,0,0,0]],
    color: '#f0a000'  // Orange
  }
};
```

### 3.4 スコアリング定数
```javascript
const SCORING = {
  SINGLE: 100,      // 1ライン
  DOUBLE: 300,      // 2ライン
  TRIPLE: 500,      // 3ライン
  TETRIS: 800,      // 4ライン
  SOFT_DROP: 1,     // ソフトドロップ/セル
  HARD_DROP: 2      // ハードドロップ/セル
};
```

### 3.5 レベル・速度定義
```javascript
const LEVEL_SPEEDS = {
  1: 1000,   // 1秒
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
  15: 50     // 最高速
};
```

## 4. 主要クラス設計

### 4.1 Game クラス
```javascript
class Game {
  constructor(canvas, ui)
  init()                        // 初期化
  start()                       // ゲーム開始
  pause()                       // 一時停止
  resume()                      // 再開
  reset()                       // リセット
  update(deltaTime)             // ゲーム状態更新
  gameLoop()                    // メインループ
  spawnPiece()                  // 新しいピース生成
  movePiece(direction)          // ピース移動
  rotatePiece()                 // ピース回転
  dropPiece(hard)               // ピース落下
  lockPiece()                   // ピース固定
  clearLines()                  // ライン消去
  checkGameOver()               // ゲームオーバー判定
  updateScore(lines)            // スコア更新
  levelUp()                     // レベルアップ
}
```

### 4.2 Board クラス
```javascript
class Board {
  constructor(width, height)
  init()                        // ボード初期化
  isValidMove(piece, x, y)      // 移動可能判定
  placePiece(piece)             // ピースを配置
  getFullRows()                 // 完成したライン取得
  clearRows(rows)               // ライン消去
  getState()                    // ボード状態取得
  setState(state)               // ボード状態設定
}
```

### 4.3 Tetromino クラス
```javascript
class Tetromino {
  constructor(type)
  rotate()                      // 回転
  getRotatedShape()             // 回転後の形状取得
  getCells()                    // 占有セル取得
  clone()                       // 複製
}
```

### 4.4 Renderer クラス
```javascript
class Renderer {
  constructor(canvas)
  clear()                       // 画面クリア
  drawBoard(board)              // ボード描画
  drawPiece(piece)              // ピース描画
  drawGrid()                    // グリッド描画
  drawGhost(piece, board)       // ゴーストピース描画
  drawNextPiece(piece)          // 次のピース描画
  drawGameOver()                // ゲームオーバー表示
}
```

### 4.5 UI クラス
```javascript
class UI {
  constructor()
  updateScore(score)            // スコア表示更新
  updateLevel(level)            // レベル表示更新
  updateLines(lines)            // ライン数表示更新
  updateHighScore(score)        // ハイスコア表示更新
  showMessage(message)          // メッセージ表示
  bindEvents(game)              // イベントバインド
}
```

### 4.6 Storage クラス
```javascript
class Storage {
  static getHighScore()         // ハイスコア取得
  static saveHighScore(score)   // ハイスコア保存
  static getSettings()          // 設定取得
  static saveSettings(settings) // 設定保存
  static getGameState()         // ゲーム状態取得
  static saveGameState(state)   // ゲーム状態保存
  static clear()                // ストレージクリア
}
```

## 5. アルゴリズム詳細

### 5.1 衝突判定アルゴリズム
```javascript
function isValidMove(piece, board, offsetX, offsetY) {
  const cells = piece.getCells();
  for (let cell of cells) {
    const newX = piece.x + cell.x + offsetX;
    const newY = piece.y + cell.y + offsetY;

    // 境界チェック
    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
      return false;
    }

    // ボード下部（-1はまだボード外）
    if (newY < 0) continue;

    // 既存ブロックとの衝突チェック
    if (board[newY][newX] !== 0) {
      return false;
    }
  }
  return true;
}
```

### 5.2 回転アルゴリズム（SRS - Super Rotation System）
```javascript
function rotate(matrix) {
  const N = matrix.length;
  const result = Array(N).fill(0).map(() => Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[j][N - 1 - i] = matrix[i][j];
    }
  }
  return result;
}

// ウォールキック実装
function tryRotate(piece, board) {
  const rotated = piece.clone();
  rotated.shape = rotate(rotated.shape);

  // 標準位置で試行
  if (isValidMove(rotated, board, 0, 0)) {
    return rotated;
  }

  // ウォールキックオフセット
  const kicks = [[0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];

  for (let [dx, dy] of kicks) {
    if (isValidMove(rotated, board, dx, dy)) {
      rotated.x += dx;
      rotated.y += dy;
      return rotated;
    }
  }

  return null; // 回転不可
}
```

### 5.3 ライン消去アルゴリズム
```javascript
function clearLines(board) {
  let linesCleared = 0;

  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      // ライン削除
      board.splice(y, 1);
      // 新しい空行を上部に追加
      board.unshift(new Array(BOARD_WIDTH).fill(0));
      linesCleared++;
      y++; // 同じ行を再チェック
    }
  }

  return linesCleared;
}
```

## 6. レンダリング設計

### 6.1 Canvas設定
```javascript
const CELL_SIZE = 30;           // セルサイズ（ピクセル）
const BOARD_WIDTH = 10;         // ボード幅（セル数）
const BOARD_HEIGHT = 20;        // ボード高さ（セル数）
const CANVAS_WIDTH = BOARD_WIDTH * CELL_SIZE;
const CANVAS_HEIGHT = BOARD_HEIGHT * CELL_SIZE;
```

### 6.2 描画最適化
- requestAnimationFrame を使用
- ダブルバッファリング
- 変更があった部分のみ再描画（Dirty Rectangle）

## 7. イベント処理

### 7.1 キーボードイベント
```javascript
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
  KeyW: 'rotate'
};
```

### 7.2 イベント防止
- キーリピート制御
- 複数キー同時押し対応
- ゲーム外でのキー入力無効化

## 8. パフォーマンス最適化

### 8.1 最適化戦略
- オブジェクトプールでメモリ割り当て削減
- 配列操作の最適化
- Canvas描画の最適化（レイヤー分離）
- イベントデバウンス・スロットル

### 8.2 メモリ管理
- 不要なオブジェクト参照の削除
- クロージャーの適切な使用
- WeakMapの活用

## 9. テスト戦略

### 9.1 ユニットテスト
- 各クラスの公開メソッド
- ゲームロジック（衝突判定、回転、ライン消去）
- スコア計算
- ストレージ操作

### 9.2 統合テスト
- ゲームフロー全体
- UI連携
- イベント処理

### 9.3 E2Eテスト（オプション）
- 実際のゲームプレイシナリオ
- ブラウザ互換性

## 10. デプロイ設計

### 10.1 ビルドプロセス
```bash
npm run build
- トランスパイル (Babel)
- バンドル (Webpack/Vite)
- 最小化 (Terser)
- アセット最適化
```

### 10.2 ホスティング
- GitHub Pages
- Netlify
- Vercel

---

## 改訂履歴

| バージョン | 日付 | 変更内容 | 承認者 |
|-----------|------|---------|--------|
| 1.0 | YYYY-MM-DD | 初版作成 | - |
