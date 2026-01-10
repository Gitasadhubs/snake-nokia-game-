
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PhoneFrame from './components/PhoneFrame';
import LCDDisplay from './components/LCDDisplay';
import { Direction, GameStatus, Point } from './types';
import { 
  GRID_SIZE, 
  INITIAL_SNAKE, 
  INITIAL_FOOD, 
  INITIAL_SPEED, 
  DIRECTIONS,
  SPEED_INCREMENT,
  MIN_SPEED
} from './constants';
import { getSystemCommentary } from './services/geminiService';

const App: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('UP');
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [commentary, setCommentary] = useState("SNAKE 3310 - READY?");
  const [isSystemLoading, setIsSystemLoading] = useState(false);

  const gameLoopRef = useRef<number | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  }, [score, highScore]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const move = DIRECTIONS[direction];
      const newHead = { x: head.x + move.x, y: head.y + move.y };

      // Wall Collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      // Self Collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food Collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, status, generateFood]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          if (status === GameStatus.PLAYING) setStatus(GameStatus.PAUSED);
          else if (status === GameStatus.PAUSED) setStatus(GameStatus.PLAYING);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  // Game Loop
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, speed, moveSnake]);

  // System Commentary trigger
  useEffect(() => {
    if (status === GameStatus.GAME_OVER) {
      updateCommentary();
    } else if (score > 0 && score % 50 === 0) {
        updateCommentary();
    }
  }, [status, score]);

  const updateCommentary = async () => {
    setIsSystemLoading(true);
    const text = await getSystemCommentary(score, status);
    setCommentary(text);
    setIsSystemLoading(false);
  };

  const handleStart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('UP');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus(GameStatus.PLAYING);
    setCommentary("GOOD LUCK!");
  };

  const handleDirectionChange = (dir: Direction) => {
    if (status !== GameStatus.PLAYING) return;
    if (dir === 'UP' && direction !== 'DOWN') setDirection('UP');
    if (dir === 'DOWN' && direction !== 'UP') setDirection('DOWN');
    if (dir === 'LEFT' && direction !== 'RIGHT') setDirection('LEFT');
    if (dir === 'RIGHT' && direction !== 'LEFT') setDirection('RIGHT');
  };

  const togglePause = () => {
    if (status === GameStatus.PLAYING) setStatus(GameStatus.PAUSED);
    else if (status === GameStatus.PAUSED) setStatus(GameStatus.PLAYING);
  };

  return (
    <div className="relative min-h-screen bg-neutral-900 flex items-center justify-center p-4 gap-8 flex-col lg:flex-row overflow-auto">
      
      {/* Left Panel: Info & System Game Master */}
      <div className="hidden lg:flex flex-col w-64 gap-4 animate-fade-in">
        <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl">
          <h3 className="text-[#16a085] font-bold text-xs uppercase tracking-[0.2em] mb-4">Game Master</h3>
          <p className="text-white/80 italic font-medium leading-relaxed mb-4">
            "{commentary}"
          </p>
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isSystemLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
             <span className="text-[10px] text-neutral-500 font-mono">SYSTEM STATUS: {isSystemLoading ? 'SYNCING' : 'READY'}</span>
          </div>
        </div>
        <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl text-xs space-y-2">
            <h3 className="text-white/40 uppercase tracking-widest font-bold">Shortcuts</h3>
            <p className="text-white/60">• ARROW KEYS to slide</p>
            <p className="text-white/60">• SPACE to pause</p>
            <p className="text-white/60">• Eat pixels to grow</p>
        </div>
      </div>

      {/* Center: The Phone */}
      <PhoneFrame 
        onDirection={handleDirectionChange}
        onPause={togglePause}
        onSelect={status === GameStatus.IDLE || status === GameStatus.GAME_OVER ? handleStart : () => {}}
      >
        <LCDDisplay 
          snake={snake}
          food={food}
          score={score}
          highScore={highScore}
          status={status}
          onStart={handleStart}
        />
      </PhoneFrame>

      {/* Right Panel: Mobile/Small Screen Commentary (Visible only on mobile) */}
      <div className="lg:hidden w-full max-w-[340px] bg-neutral-800 p-4 rounded-xl border border-neutral-700">
        <p className="text-white/80 italic text-sm text-center">"{commentary}"</p>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-mono">
          © {new Date().getFullYear()} gitasadhubs • all rights reserved
        </span>
      </div>

    </div>
  );
};

export default App;
