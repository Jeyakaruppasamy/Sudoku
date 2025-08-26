import React from 'react';
import { Brain } from 'lucide-react';
import { useSudokuGame } from './hooks/useSudokuGame';
import { SudokuGrid } from './components/SudokuGrid';
import { GameControls } from './components/GameControls';
import { NumberPad } from './components/NumberPad';
import { StatsPanel } from './components/StatsPanel';

function App() {
  const {
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
    getGameStats
  } = useSudokuGame();

  const handleCellClick = (row: number, col: number) => {
    if (gameState?.isComplete || gameState?.isPaused) return;
    setSelectedCell({ row, col });
  };

  const handleNumberSelect = (number: number | null) => {
    if (!selectedCell || !gameState) return;
    makeMove(selectedCell.row, selectedCell.col, number);
  };

  const stats = getGameStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain size={48} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Sudoku Master</h1>
          </div>
          <p className="text-lg text-gray-600">Challenge your mind with classic Sudoku puzzles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sudoku Grid */}
            {gameState ? (
              <SudokuGrid
                gameState={gameState}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
              />
            ) : (
              <div className="aspect-square max-w-md mx-auto bg-white rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <Brain size={64} className="text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Sudoku Master</h2>
                  <p className="text-gray-600 mb-6">Choose a difficulty level to start playing</p>
                </div>
              </div>
            )}

            {/* Number Pad */}
            <NumberPad
              onNumberSelect={handleNumberSelect}
              pencilMode={pencilMode}
              disabled={!gameState || gameState.isComplete || gameState.isPaused}
            />
          </div>

          {/* Controls and Stats Sidebar */}
          <div className="space-y-6">
            {/* Game Controls */}
            <GameControls
              difficulty={gameState?.difficulty || null}
              isPaused={gameState?.isPaused || false}
              isComplete={gameState?.isComplete || false}
              pencilMode={pencilMode}
              mistakes={gameState?.mistakes || 0}
              hintsUsed={gameState?.hintsUsed || 0}
              currentTime={currentTime}
              onNewGame={startNewGame}
              onPause={pauseGame}
              onHint={getHint}
              onSave={saveGame}
              onTogglePencil={() => setPencilMode(!pencilMode)}
            />

            {/* Statistics */}
            <StatsPanel stats={stats} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>© 2025 Sudoku Master. Built with React and TypeScript.</p>
        </div>
      </div>
    </div>
  );
}

export default App;