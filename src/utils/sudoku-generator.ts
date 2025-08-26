import type { SudokuGrid, Difficulty } from '../types/sudoku';

export class SudokuGenerator {
  private static readonly GRID_SIZE = 9;
  private static readonly BOX_SIZE = 3;
  
  static generatePuzzle(difficulty: Difficulty): { puzzle: SudokuGrid, solution: SudokuGrid } {
    // Start with a complete valid grid
    const solution = this.generateCompletedGrid();
    
    // Create puzzle by removing numbers based on difficulty
    const puzzle = this.createPuzzle(solution, difficulty);
    
    return { puzzle, solution };
  }
  
  private static generateCompletedGrid(): SudokuGrid {
    const grid: SudokuGrid = Array(this.GRID_SIZE).fill(null).map(() => 
      Array(this.GRID_SIZE).fill(null)
    );
    
    this.fillGrid(grid);
    return grid;
  }
  
  private static fillGrid(grid: SudokuGrid): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (grid[row][col] === null) {
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          
          for (const num of numbers) {
            if (this.isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              
              if (this.fillGrid(grid)) {
                return true;
              }
              
              grid[row][col] = null;
            }
          }
          
          return false;
        }
      }
    }
    
    return true;
  }
  
  private static createPuzzle(solution: SudokuGrid, difficulty: Difficulty): SudokuGrid {
    const puzzle = solution.map(row => [...row]);
    const cellsToRemove = this.getCellsToRemove(difficulty);
    
    const positions = [];
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        positions.push({ row, col });
      }
    }
    
    const shuffledPositions = this.shuffleArray(positions);
    let removed = 0;
    
    for (const { row, col } of shuffledPositions) {
      if (removed >= cellsToRemove) break;
      
      const backup = puzzle[row][col];
      puzzle[row][col] = null;
      
      // Ensure the puzzle still has a unique solution
      if (this.hasUniqueSolution(puzzle)) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }
    
    return puzzle;
  }
  
  private static getCellsToRemove(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 40;
      case 'medium': return 50;
      case 'hard': return 60;
      default: return 45;
    }
  }
  
  private static hasUniqueSolution(puzzle: SudokuGrid): boolean {
    const solutions: SudokuGrid[] = [];
    this.solvePuzzle(puzzle.map(row => [...row]), solutions, 2);
    return solutions.length === 1;
  }
  
  private static solvePuzzle(
    grid: SudokuGrid, 
    solutions: SudokuGrid[], 
    maxSolutions: number
  ): void {
    if (solutions.length >= maxSolutions) return;
    
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) {
      solutions.push(grid.map(row => [...row]));
      return;
    }
    
    const { row, col } = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (this.isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;
        this.solvePuzzle(grid, solutions, maxSolutions);
        grid[row][col] = null;
      }
    }
  }
  
  private static findEmptyCell(grid: SudokuGrid): { row: number; col: number } | null {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (grid[row][col] === null) {
          return { row, col };
        }
      }
    }
    return null;
  }
  
  static isValidPlacement(grid: SudokuGrid, row: number, col: number, num: number): boolean {
    // Check row
    for (let c = 0; c < this.GRID_SIZE; c++) {
      if (c !== col && grid[row][c] === num) {
        return false;
      }
    }
    
    // Check column
    for (let r = 0; r < this.GRID_SIZE; r++) {
      if (r !== row && grid[r][col] === num) {
        return false;
      }
    }
    
    // Check box
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;
    
    for (let r = boxRow; r < boxRow + this.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + this.BOX_SIZE; c++) {
        if (r !== row && c !== col && grid[r][c] === num) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}