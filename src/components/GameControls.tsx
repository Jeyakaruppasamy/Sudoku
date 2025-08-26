import React from 'react';
import { Play, Pause, RotateCcw, Lightbulb, Save, Edit3 } from 'lucide-react';
import type { Difficulty } from '../types/sudoku';

interface GameControlsProps {
  difficulty: Difficulty | null;
  isPaused: boolean;
  isComplete: boolean;
  pencilMode: boolean;
  mistakes: number;
  hintsUsed: number;
  currentTime: number;
  onNewGame: (difficulty: Difficulty) => void;
  onPause: () => void;
  onHint: () => void;
  onSave: () => void;
  onTogglePencil: () => void;
}

export function GameControls({
  difficulty,
  isPaused,
  isComplete,
  pencilMode,
  mistakes,
  hintsUsed,
  currentTime,
  onNewGame,
  onPause,
  onHint,
  onSave,
  onTogglePencil
}: GameControlsProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Info Bar */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          {difficulty && (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getDifficultyColor(difficulty)}`} />
              <span className="font-medium capitalize">{difficulty}</span>
            </div>
          )}
          <div className="text-sm text-gray-600">
            Time: {formatTime(currentTime)}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Mistakes: {mistakes}</span>
          <span>Hints: {hintsUsed}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={onPause}
          disabled={!difficulty}
          className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          onClick={onHint}
          disabled={!difficulty || isPaused || isComplete}
          className="flex items-center justify-center space-x-2 p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 transition-colors"
        >
          <Lightbulb size={20} />
          <span>Hint</span>
        </button>

        <button
          onClick={onTogglePencil}
          disabled={!difficulty || isPaused || isComplete}
          className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
            pencilMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } disabled:bg-gray-300`}
        >
          <Edit3 size={20} />
          <span>Pencil</span>
        </button>

        <button
          onClick={onSave}
          disabled={!difficulty}
          className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
        >
          <Save size={20} />
          <span>Save</span>
        </button>
      </div>

      {/* New Game Buttons */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">New Game</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => onNewGame(diff)}
              className={`flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors ${getDifficultyColor(diff)} hover:opacity-90`}
            >
              <RotateCcw size={18} />
              <span className="capitalize">{diff}</span>
            </button>
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-semibold text-green-800">Congratulations!</div>
          <div className="text-sm text-green-600">
            Completed in {formatTime(currentTime)} with {mistakes} mistakes
          </div>
        </div>
      )}
    </div>
  );
}