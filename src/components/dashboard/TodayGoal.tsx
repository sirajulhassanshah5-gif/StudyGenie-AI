import React from 'react';
import { Target, CheckCircle2, Clock, Award } from 'lucide-react';

export const TodayGoal: React.FC = () => {
  const goalPercentage = 75;

  const tasks = [
    { title: 'Complete Physics Ch 4 Summary', done: true, time: '45 mins' },
    { title: 'Solve 10 Calculus Practice Problems', done: true, time: '60 mins' },
    { title: 'Review Organic Chemistry Flashcards', done: false, time: '30 mins' },
    { title: 'AI Quiz on Computer Architecture', done: false, time: '20 mins' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/80 border border-indigo-500/20 backdrop-blur-xl shadow-xl hover:shadow-indigo-500/10 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Today's Goal</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">3 of 4 tasks completed</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> On Track
        </span>
      </div>

      {/* Goal Progress Ring / Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Daily Study Target (3.5 / 4.0 hrs)</span>
          <span className="text-indigo-400 font-bold">{goalPercentage}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-300/30 dark:border-slate-700/50">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 shadow-sm shadow-indigo-500/50"
            style={{ width: `${goalPercentage}%` }}
          />
        </div>
      </div>

      {/* Task Checklist */}
      <div className="space-y-2.5">
        {tasks.map((task, idx) => (
          <div 
            key={idx}
            className={`
              flex items-center justify-between p-3 rounded-2xl border transition-all text-xs
              ${task.done 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400 line-through dark:text-slate-400' 
                : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 font-medium hover:border-indigo-500/40'}
            `}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className={`w-4 h-4 ${task.done ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`} />
              <span>{task.title}</span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{task.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
