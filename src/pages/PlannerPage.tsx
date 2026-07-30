import React, { useState, useEffect } from 'react';
import { Calendar, Play, Pause, RotateCcw, Clock, Plus } from 'lucide-react';

export const PlannerPage: React.FC = () => {
  // Pomodoro Timer State
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      alert(timerMode === 'work' ? 'Pomodoro Session Finished! Take a 5 min break.' : 'Break finished! Back to study.');
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, timerMode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(timerMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (mode: 'work' | 'break') => {
    setTimerMode(mode);
    setIsActive(false);
    setSeconds(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const schedule = [
    { time: '09:00 AM - 10:30 AM', title: 'Computer Science: Data Structures', tag: 'High Focus' },
    { time: '11:00 AM - 12:30 PM', title: 'Calculus: Practice Problem Set', tag: 'Homework' },
    { time: '02:00 PM - 03:30 PM', title: 'Physics: Lab Report Writing', tag: 'Writing' },
    { time: '04:00 PM - 05:00 PM', title: 'AI Flashcard Revision', tag: 'Review' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Study Planner & Focus Timer</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Schedule your day with AI smart time blocking</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pomodoro Timer */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/80 border border-indigo-500/30 backdrop-blur-xl shadow-xl flex flex-col justify-between items-center text-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ⏱️ Pomodoro Focus Timer
            </span>
            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={() => switchMode('work')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  timerMode === 'work' ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 text-slate-400'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => switchMode('break')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  timerMode === 'break' ? 'bg-emerald-600 text-white' : 'bg-slate-800/60 text-slate-400'
                }`}
              >
                Break (5m)
              </button>
            </div>
          </div>

          {/* Big Timer Circle */}
          <div className="w-48 h-48 rounded-full border-4 border-indigo-500/30 bg-slate-900/60 flex flex-col items-center justify-center shadow-inner space-y-1">
            <span className="text-4xl font-extrabold text-white tracking-wider font-mono">
              {formatTime(seconds)}
            </span>
            <span className="text-[10px] text-indigo-300 uppercase font-semibold">
              {isActive ? 'Session Active' : 'Paused'}
            </span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={toggleTimer}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-500/20 transition-all"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause' : 'Start Focus'}</span>
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-2xl bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Time Blocks */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Today's Schedule Blocks
            </h3>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Block
            </button>
          </div>

          <div className="space-y-4">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-indigo-500/40 transition-all text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-indigo-400">{item.time}</span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.title}</h4>
                </div>
                <span className="self-start sm:self-center px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-[10px]">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
