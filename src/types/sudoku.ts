export type SudokuGrid = (number | null)[][];
export type PencilMarks = Set<number>[][][];

export interface GameState {
  id: string;
  puzzle: SudokuGrid;
  solution: SudokuGrid;
  current: SudokuGrid;
  pencilMarks: PencilMarks;
  difficulty: Difficulty;
  startTime: number;
  endTime?: number;
  isPaused: boolean;
  isComplete: boolean;
  mistakes: number;
  hintsUsed: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  bestTimes: {
    easy: number | null;
    medium: number | null;
    hard: number | null;
  };
  totalTime: number;
  averageTime: number;
}

export interface Position {
  row: number;
  col: number;
}