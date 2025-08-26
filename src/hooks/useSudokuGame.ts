import { useState, useEffect, useCallback } from 'react';
import type { GameState, Difficulty, PencilMarks, Position, GameStats } from '../types/sudoku';
import { SudokuGenerator } from '../utils/sudoku-generator';
import { SudokuSolver } from '../utils/sudoku-solver';

export function useSudokuGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [pencilMode, setPencilMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize pencil marks
  const createEmptyPencilMarks = useCallback((): PencilMarks => {
    return Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set<number>()))
    );
  }, []);

  const startNewGame = useCallback((difficulty: Difficulty) => {
    const { puzzle, solution } = SudokuGenerator.generatePuzzle(difficulty);
    
    const newGame: GameState = {
      id: Date.now().toString(),
      puzzle,
      solution,
      current: puzzle.map(row => [...row]),
      pencilMarks: createEmptyPencilMarks(),
      difficulty,
      startTime: Date.now(),
      isPaused: false,
      isComplete: false,
      mistakes: 0,
      hintsUsed: 0
    };

    setGameState(newGame);
    setSelectedCell(null);
    setCurrentTime(0);
  }, [createEmptyPencilMarks]);

  const pauseGame = useCallback(() => {
    setGameState(prev => prev ? { ...prev, isPaused: !prev.isPaused } : null);
  }, []);

  const makeMove = useCallback((row: number, col: number, value: number | null) => {
    if (!gameState || gameState.isComplete || gameState.isPaused) return;

    // Don't allow changing original puzzle cells
    if (gameState.puzzle[row][col] !== null) return;

    setGameState(prev => {
      if (!prev) return null;

      const newCurrent = prev.current.map(r => [...r]);
      const newPencilMarks = prev.pencilMarks.map(r => 
        r.map(c => c.map(marks => new Set(marks)))
      );

      if (pencilMode && value !== null) {
        // Toggle pencil mark
        if (newPencilMarks[row][col][value - 1].has(value)) {
          newPencilMarks[row][col][value - 1].delete(value);
        } else {
          newPencilMarks[row][col][value - 1].add(value);
        }
      } else {
        // Regular move
        newCurrent[row][col] = value;
        
        // Clear pencil marks for this cell
        for (let i = 0; i < 9; i++) {
          newPencilMarks[row][col][i].clear();
        }

        // Check for mistakes
        let newMistakes = prev.mistakes;
        if (value !== null && value !== prev.solution[row][col]) {
          newMistakes++;
        }

        // Check if game is complete
        const isComplete = SudokuSolver.isComplete(newCurrent) && 
                          SudokuSolver.validateGrid(newCurrent, prev.solution);

        return {
          ...prev,
          current: newCurrent,
          pencilMarks: newPencilMarks,
          mistakes: newMistakes,
          isComplete,
          endTime: isComplete ? Date.now() : undefined
        };
      }

      return {
        ...prev,
        current: newCurrent,
        pencilMarks: newPencilMarks
      };
    });
  }, [gameState, pencilMode]);

  const getHint = useCallback(() => {
    if (!gameState || gameState.isComplete) return;

    const hint = SudokuSolver.getHint(gameState.current, gameState.solution);
    if (hint) {
      makeMove(hint.row, hint.col, hint.value);
      setGameState(prev => prev ? { ...prev, hintsUsed: prev.hintsUsed + 1 } : null);
    }
  }, [gameState, makeMove]);

  const saveGame = useCallback(() => {
    if (!gameState) return;
    
    localStorage.setItem(`sudoku-game-${gameState.id}`, JSON.stringify(gameState));
  }, [gameState]);

  const loadGame = useCallback((gameId: string) => {
    const saved = localStorage.getItem(`sudoku-game-${gameId}`);
    if (saved) {
      const loaded = JSON.parse(saved);
      // Recreate Sets for pencil marks
      loaded.pencilMarks = loaded.pencilMarks.map((row: any) =>
        row.map((col: any) => col.map((marks: number[]) => new Set(marks)))
      );
      setGameState(loaded);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameState || gameState.isPaused || gameState.isComplete) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now() - gameState.startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Auto-save effect
  useEffect(() => {
    if (gameState) {
      const timeoutId = setTimeout(saveGame, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState, saveGame]);

  const getGameStats = useCallback((): GameStats => {
    const stats = localStorage.getItem('sudoku-stats');
    if (stats) {
      return JSON.parse(stats);
    }
    
    return {
      gamesPlayed: 0,
      gamesCompleted: 0,
      bestTimes: {
        easy: null,
        medium: null,
        hard: null
      },
      totalTime: 0,
      averageTime: 0
    };
  }, []);

  const updateStats = useCallback((completedGame: GameState) => {
    const stats = getGameStats();
    const gameTime = (completedGame.endTime! - completedGame.startTime) / 1000;
    
    const updatedStats: GameStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      gamesCompleted: stats.gamesCompleted + 1,
      bestTimes: {
        ...stats.bestTimes,
        [completedGame.difficulty]: stats.bestTimes[completedGame.difficulty] === null 
          ? gameTime 
          : Math.min(stats.bestTimes[completedGame.difficulty]!, gameTime)
      },
      totalTime: stats.totalTime + gameTime,
      averageTime: (stats.totalTime + gameTime) / (stats.gamesCompleted + 1)
    };

    localStorage.setItem('sudoku-stats', JSON.stringify(updatedStats));
  }, [getGameStats]);

  // Update stats when game is completed
  useEffect(() => {
    if (gameState?.isComplete && gameState.endTime) {
      updateStats(gameState);
    }
  }, [gameState, updateStats]);

  return {
    gameState,
    selectedCell,
    setSelectedCell,
    pencilMode,
    setPencilMode,
    currentTime,
    startNewGame,
    pauseGame,
    makeMove,
    getHint,
    saveGame,
    loadGame,
    getGameStats
  };
}