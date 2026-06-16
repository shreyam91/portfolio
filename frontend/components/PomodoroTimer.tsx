'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Plus, Minus } from 'lucide-react';

const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workDuration, setWorkDuration] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const adjustTime = (amount: number) => {
    if (isRunning) return;
    if (mode === 'work') {
      const newDuration = Math.max(1, workDuration + amount);
      setWorkDuration(newDuration);
      setTimeLeft(newDuration * 60);
    } else {
      const newDuration = Math.max(1, breakDuration + amount);
      setBreakDuration(newDuration);
      setTimeLeft(newDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { m, s };
  };

  const totalCurrentSeconds = mode === 'work' ? workDuration * 60 : breakDuration * 60;
  const progress = ((totalCurrentSeconds - timeLeft) / totalCurrentSeconds) * 100;
  const { m, s } = formatTime(timeLeft);

  return (
    <div className="bg-gradient-to-br from-card to-muted/20 border border-border shadow-sm rounded-2xl p-5 w-full relative overflow-hidden group">
      {/* Background Animated Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 blur-3xl opacity-20 rounded-full transition-colors duration-1000 ${mode === 'work' ? 'bg-orange-500' : 'bg-green-500'}`}></div>

      {/* Header Toggles */}
      <div className="flex gap-2 mb-6 relative z-10">
        <button 
          onClick={() => switchMode('work')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-full transition-all flex justify-center items-center gap-1.5 ${mode === 'work' ? 'bg-orange-500 text-primary-foreground shadow-md shadow-primary/20 scale-105' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          <Briefcase size={14} /> Focus
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-full transition-all flex justify-center items-center gap-1.5 ${mode === 'break' ? 'bg-green-500 text-white shadow-md shadow-green-500/20 scale-105' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          <Coffee size={14} /> Relax
        </button>
      </div>

      {/* Timer Display */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <button 
          onClick={() => adjustTime(-1)} 
          disabled={isRunning}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-50 transition-all active:scale-90"
        >
          <Minus size={16} />
        </button>
        
        <div className="flex flex-col items-center justify-center font-black tabular-nums tracking-tighter text-5xl">
          <div className="flex items-baseline">
            <span className={mode === 'work' ? 'text-orange-500' : 'text-green-500'}>{m}</span>
            <span className="text-foreground animate-pulse">:</span>
            <span className="text-foreground">{s}</span>
          </div>
        </div>

        <button 
          onClick={() => adjustTime(1)} 
          disabled={isRunning}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-50 transition-all active:scale-90"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Controls & Progress Bar */}
      <div className="relative z-10">
        <div className="flex gap-3 mb-4">
          <button 
            onClick={toggleTimer}
            className={`flex-1 py-2.5 flex items-center justify-center rounded-xl text-white font-bold text-sm transition-all active:scale-95 shadow-lg ${isRunning ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : (mode === 'work' ? 'bg-orange-500 hover:bg-primary/90 shadow-primary/20' : 'bg-green-500 hover:bg-green-600 shadow-green-500/20')}`}
          >
            {isRunning ? (
              <><Pause fill="currentColor" size={16} className="mr-1.5" /> Pause</>
            ) : (
              <><Play fill="currentColor" size={16} className="mr-1.5" /> Start</>
            )}
          </button>
          <button 
            onClick={resetTimer}
            className="w-12 flex items-center justify-center rounded-xl bg-muted border border-border/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all active:scale-95"
            title="Reset Timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Minimal Progress Line */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${mode === 'work' ? 'bg-orange-500' : 'bg-green-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
