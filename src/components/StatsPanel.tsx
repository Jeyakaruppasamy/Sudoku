import React, { useState } from 'react';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import type { GameStats } from '../types/sudoku';

interface StatsPanelProps {
  stats: GameStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesCompleted / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Statistics</h2>
          <Trophy size={24} />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.gamesCompleted}</div>
            <div className="text-sm text-gray-600">Games Won</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-4 border-t pt-4">
            {/* Detailed Stats */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock size={20} className="text-blue-500" />
                  <span className="font-medium">Average Time</span>
                </div>
                <span className="font-bold">{formatTime(stats.averageTime)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target size={20} className="text-green-500" />
                  <span className="font-medium">Total Games</span>
                </div>
                <span className="font-bold">{stats.gamesPlayed}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={20} className="text-purple-500" />
                  <span className="font-medium">Total Time Played</span>
                </div>
                <span className="font-bold">{formatTime(stats.totalTime)}</span>
              </div>
            </div>

            {/* Best Times */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Best Times</h3>
              <div className="space-y-2">
                {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                  <div key={difficulty} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        difficulty === 'easy' ? 'bg-green-500' :
                        difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="capitalize">{difficulty}</span>
                    </div>
                    <span className="font-medium">
                      {formatTime(stats.bestTimes[difficulty])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}