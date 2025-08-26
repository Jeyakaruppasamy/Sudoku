import type { SudokuGrid } from '../types/sudoku';

export class SudokuSolver {
  static solve(grid: SudokuGrid): SudokuGrid | null {
    const solution = grid.map(row => [...row]);
    
    if (this.solvePuzzle(solution)) {
      return solution;
    }
    
    return null;
  }
  
  private static solvePuzzle(grid: SudokuGrid): boolean {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) {
      return true; // Puzzle solved
    }
    
    const { row, col } = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (this.isValidMove(grid, row, col, num)) {
        grid[row][col] = num;
        
        if (this.solvePuzzle(grid)) {
          return true;
        }
        
        grid[row][col] = null;
      }
    }
    
    return false;
  }
  
  private static findEmptyCell(grid: SudokuGrid): { row: number; col: number } | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          return { row, col };
        }
      }
    }
    return null;
  }
  
  static isValidMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) {
        return false;
      }
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== row && c !== col && grid[r][c] === num) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  static getHint(grid: SudokuGrid, solution: SudokuGrid): { row: number; col: number; value: number } | null {
    const emptyCells = [];
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null && solution[row][col] !== null) {
          emptyCells.push({ row, col, value: solution[row][col]! });
        }
      }
    }
    
    if (emptyCells.length === 0) return null;
    
    // Return a random empty cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  
  static validateGrid(grid: SudokuGrid, solution: SudokuGrid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const currentValue = grid[row][col];
        const correctValue = solution[row][col];
        
        if (currentValue !== null && currentValue !== correctValue) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  static isComplete(grid: SudokuGrid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  }
}