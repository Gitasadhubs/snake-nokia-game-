
import React from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE } from '../constants';

interface LCDDisplayProps {
  snake: Point[];
  food: Point;
  score: number;
  highScore: number;
  status: GameStatus;
  onStart: () => void;
}

const LCDDisplay: React.FC<LCDDisplayProps> = ({ snake, food, score, highScore, status, onStart }) => {
  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(p => p.x === x && p.y === y);
    const isFood = food.x === x && food.y === y;
    
    return (
      <div 
        key={`${x}-${y}`}
        className={`w-full h-full border-[0.5px] border-[#8a9ba5]/30 ${
          isSnake ? 'pixel' : isFood ? 'pixel animate-pulse' : ''
        }`}
      />
    );
  };

  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      grid.push(renderCell(x, y));
    }
  }

  return (
    <div className="relative w-full aspect-square nokia-screen border-4 border-[#7a8b95] rounded-sm overflow-hidden p-1 flex flex-col">
      {/* Header Info */}
      <div className="flex justify-between items-center px-2 py-1 border-b border-black/10 lcd-font text-xs text-black/80 font-bold">
        <span>HI: {highScore}</span>
        <span>SCORE: {score}</span>
      </div>

      {/* Main Board */}
      <div 
        className="flex-1 grid gap-0" 
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {grid}
      </div>

      {/* Overlays */}
      {status === GameStatus.IDLE && (
        <div className="absolute inset-0 bg-[#9badb7]/80 flex flex-col items-center justify-center text-black lcd-font text-center p-4">
          <h2 className="text-4xl font-bold mb-2 tracking-widest">SNAKE</h2>
          <p className="text-sm mb-4">PRESS START</p>
          <button 
            onClick={onStart}
            className="px-6 py-2 border-2 border-black hover:bg-black hover:text-[#9badb7] transition-colors font-bold uppercase"
          >
            Start Game
          </button>
        </div>
      )}

      {status === GameStatus.PAUSED && (
        <div className="absolute inset-0 bg-[#9badb7]/60 flex items-center justify-center">
          <span className="text-3xl font-bold lcd-font tracking-widest text-black">PAUSED</span>
        </div>
      )}

      {status === GameStatus.GAME_OVER && (
        <div className="absolute inset-0 bg-[#9badb7]/90 flex flex-col items-center justify-center text-black lcd-font p-4">
          <h2 className="text-3xl font-bold mb-1 tracking-tighter">GAME OVER</h2>
          <p className="text-xl mb-4">FINAL: {score}</p>
          <button 
            onClick={onStart}
            className="px-6 py-2 border-2 border-black hover:bg-black hover:text-[#9badb7] transition-colors font-bold uppercase"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default LCDDisplay;
