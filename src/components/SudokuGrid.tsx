import React from 'react';
import type { GameState, Position } from '../types/sudoku';

interface SudokuGridProps {
  gameState: GameState;
  selectedCell: Position | null;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuGrid({ gameState, selectedCell, onCellClick }: SudokuGridProps) {
  const getCellClassName = (row: number, col: number) => {
    const baseClasses = 'relative aspect-square border border-gray-300 cursor-pointer transition-all duration-200 hover:bg-blue-50';
    
    // Thick borders for 3x3 boxes
    const borderClasses = [
      row % 3 === 0 ? 'border-t-2 border-t-gray-700' : '',
      row % 3 === 2 ? 'border-b-2 border-b-gray-700' : '',
      col % 3 === 0 ? 'border-l-2 border-l-gray-700' : '',
      col % 3 === 2 ? 'border-r-2 border-r-gray-700' : '',
    ].filter(Boolean).join(' ');

    // Selection and related cell highlighting
    let selectionClasses = '';
    if (selectedCell) {
      const isSelected = selectedCell.row === row && selectedCell.col === col;
      const sameRow = selectedCell.row === row;
      const sameCol = selectedCell.col === col;
      const sameBox = Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && 
                     Math.floor(selectedCell.col / 3) === Math.floor(col / 3);
      
      if (isSelected) {
        selectionClasses = 'bg-blue-200 ring-2 ring-blue-500';
      } else if (sameRow || sameCol || sameBox) {
        selectionClasses = 'bg-blue-100';
      }
    }

    // Original puzzle cells
    const isOriginal = gameState.puzzle[row][col] !== null;
    const originalClasses = isOriginal ? 'bg-gray-100 font-bold text-gray-800' : 'bg-white';

    // Wrong answer highlighting
    const currentValue = gameState.current[row][col];
    const correctValue = gameState.solution[row][col];
    const isWrong = currentValue !== null && currentValue !== correctValue;
    const wrongClasses = isWrong ? 'bg-red-100 text-red-600' : '';

    return `${baseClasses} ${borderClasses} ${selectionClasses} ${originalClasses} ${wrongClasses}`.trim();
  };

  const renderCellContent = (row: number, col: number) => {
    const value = gameState.current[row][col];
    const pencilMarks = gameState.pencilMarks[row][col];
    
    if (value !== null) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-lg font-medium">
          {value}
        </div>
      );
    }

    // Show pencil marks if any exist
    const hasMarks = pencilMarks.some(markSet => markSet.size > 0);
    if (hasMarks) {
      return (
        <div className="absolute inset-0 p-1">
          <div className="grid grid-cols-3 gap-0 h-full text-xs text-gray-500">
            {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
              <div key={num} className="flex items-center justify-center">
                {pencilMarks[num - 1].has(num) ? num : ''}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (gameState.isPaused) {
    return (
      <div className="aspect-square max-w-md mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏸️</div>
          <div className="text-xl font-medium text-gray-600">Game Paused</div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-square max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-9 h-full">
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => (
            <div
              key={`${row}-${col}`}
              className={getCellClassName(row, col)}
              onClick={() => onCellClick(row, col)}
            >
              {renderCellContent(row, col)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}