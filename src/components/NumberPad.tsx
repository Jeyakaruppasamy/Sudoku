import React from 'react';
import { Eraser } from 'lucide-react';

interface NumberPadProps {
  onNumberSelect: (number: number | null) => void;
  pencilMode: boolean;
  disabled: boolean;
}

export function NumberPad({ onNumberSelect, pencilMode, disabled }: NumberPadProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-5 gap-3">
        {/* Numbers 1-9 */}
        {Array.from({ length: 9 }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => onNumberSelect(number)}
            disabled={disabled}
            className={`aspect-square flex items-center justify-center text-lg font-medium rounded-lg border-2 transition-all duration-200 ${
              pencilMode
                ? 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100'
                : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
            } disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 hover:scale-105 active:scale-95`}
          >
            {number}
          </button>
        ))}
        
        {/* Eraser */}
        <button
          onClick={() => onNumberSelect(null)}
          disabled={disabled}
          className="aspect-square flex items-center justify-center rounded-lg border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 hover:scale-105 active:scale-95"
        >
          <Eraser size={20} />
        </button>
      </div>
      
      <div className="mt-3 text-center text-sm text-gray-600">
        {pencilMode ? 'Pencil Mode: Click to add/remove marks' : 'Normal Mode: Click to enter numbers'}
      </div>
    </div>
  );
}