# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Tetris Web Game** project in the planning phase. The codebase currently contains comprehensive documentation for developing a browser-based Tetris game using vanilla JavaScript, HTML5 Canvas, and modern web technologies.

**Current Status**: Documentation phase complete. Implementation has not yet started.

## Documentation Structure

All project documentation is located in `docs/tetris-game/`:

- **00-SOW.md**: Statement of Work - Project scope, deliverables, schedule, quality standards
- **01-requirements.md**: Requirements specification - Functional/non-functional requirements, acceptance criteria, priorities
- **02-technical-specification.md**: Technical design - System architecture, class design, algorithms, data models
- **03-wbs.md**: Work Breakdown Structure - 190 detailed tasks organized into 14 categories across 4 development phases
- **README.md**: Documentation index and navigation guide

**When implementing features**: Always reference the technical specification first for class design, data models, and algorithms. Check the requirements document for acceptance criteria and priorities.

## Planned Architecture

The application follows a **3-layer architecture**:

1. **Presentation Layer**: HTML/CSS/Canvas rendering, event handlers, animations
2. **Game Logic Layer**: Game engine (Game.js), board management (Board.js), tetromino pieces (Tetromino.js), scoring (Score.js)
3. **Data Layer**: LocalStorage for high scores, game state, and settings

### Key Classes (Not Yet Implemented)

- `Game`: Main game engine, game loop, state management, piece spawning/movement/rotation
- `Board`: 10x20 grid, collision detection, line clearing
- `Tetromino`: 7 piece types (I, O, T, S, Z, J, L), rotation with Super Rotation System (SRS)
- `Renderer`: Canvas drawing with 30px cell size, visual effects
- `UI`: Score/level/lines display, control buttons, event binding
- `Storage`: LocalStorage wrapper for persistence

### Core Algorithms (Defined in Technical Spec)

- **Collision Detection**: Boundary checks + existing block checks
- **Rotation**: SRS (Super Rotation System) with wall kicks
- **Line Clearing**: Splice full rows, add empty rows at top
- **Scoring**: 100×level (1 line) to 800×level (4 lines/Tetris)

## Planned Directory Structure

```
src/
├── index.html
├── styles/
│   ├── main.css
│   ├── game.css
│   └── responsive.css
├── scripts/
│   ├── main.js
│   ├── game/          # Core game logic
│   ├── ui/            # Rendering and UI
│   └── utils/         # Storage, helpers
└── assets/
    ├── images/
    └── sounds/

tests/
├── unit/              # Jest unit tests
└── integration/
```

## Development Workflow (When Implementation Begins)

### Build & Development
- Build tool: Webpack or Vite (to be selected during setup)
- Dev server with hot reload
- ES6+ transpilation via Babel

### Testing
- Framework: Jest
- Target: 80%+ code coverage
- Run unit tests for Game, Board, Tetromino, Score, Storage classes

### Code Quality
- ESLint + Prettier for code style
- Git hooks via Husky
- Browser targets: Latest Chrome, Firefox, Safari, Edge

### Performance Requirements
- 60 FPS gameplay
- <3s initial load time
- <50ms input latency
- <50MB memory usage

## Key Constants & Configuration

Defined in `src/scripts/game/constants.js` (to be created):

- Board: 10 columns × 20 rows
- Cell size: 30px
- 7 tetromino types with specific colors
- Level speeds: 1000ms (level 1) → 50ms (level 15)
- Scoring: Single=100, Double=300, Triple=500, Tetris=800 (all multiplied by level)

## Implementation Priority

**P0 (Must Have)**:
- Basic game logic, 7 tetrominos, scoring, game over detection

**P1 (High Priority)**:
- Next piece preview, high score persistence, pause, level system

**P2 (Medium Priority)**:
- Sound effects, visual effects, game state save/restore

**P3 (Low Priority)**:
- Touch controls, color-blind mode, additional game modes

## Development Phases

1. **Phase 1** (1-2 weeks): Requirements & design - COMPLETE
2. **Phase 2** (3-4 weeks): Core development - NOT STARTED
3. **Phase 3** (1-2 weeks): Testing & optimization - NOT STARTED
4. **Phase 4** (1 week): Deployment - NOT STARTED

## Important Design Decisions

- **Client-side only**: No server required, runs entirely in browser
- **Vanilla JavaScript**: Minimal external dependencies
- **Canvas rendering**: Using Canvas API for game board (not DOM manipulation)
- **LocalStorage**: For high scores and settings persistence
- **SRS rotation**: Standard Tetris rotation system with wall kicks
- **Bundle size limit**: <500KB

## When Adding New Features

1. Check if feature is in requirements (01-requirements.md)
2. Review technical design in 02-technical-specification.md
3. Update WBS checklist in 03-wbs.md
4. Follow the 3-layer architecture
5. Maintain class separation: game logic in `game/`, rendering in `ui/`, data in `utils/`
6. Write unit tests for game logic classes
7. Ensure 60 FPS performance target is maintained
