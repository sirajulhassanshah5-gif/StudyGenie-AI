import React from 'react';
import { TrendingUp, BookOpen, Brain, Zap } from 'lucide-react';

export const StudyProgress: React.FC = () => {
  const subjects = [
    { name: 'Computer Science', progress: 88, color: 'from-blue-500 to-indigo-600', hours: '14.5 hrs', level: 'Master' },
    { name: 'Calculus & Linear Algebra', progress: 72, color: 'from-purple-500 to-pink-600', hours: '10.2 hrs', level: 'Proficient' },
    { name: 'Physics Mechanics', progress: 64, color: 'from-cyan-500 to-blue-600', hours: '8.0 hrs', level: 'Intermediate' },
    { name: 'Organic Chemistry', progress: 45, color: 'from-amber-500 to-rose-600', hours: '5.5 hrs', level: 'Learning' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Study Progress</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Overall Mastery: 74% (+8% this week)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <Brain className="w-4 h-4 text-purple-400" />
          <span>38.2 Total Hrs</span>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="space-y-4">
        {subjects.map((sub, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  {sub.hours}
                </span>
                <span className="font-bold text-indigo-400">{sub.progress}%</span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${sub.color} transition-all duration-700`}
                style={{ width: `${sub.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Performance Insight Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-purple-400">
          <Zap className="w-4 h-4 fill-purple-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            <strong>AI Recommendation:</strong> Spend 30 mins extra on <em>Organic Chemistry</em> today to boost exam readiness!
          </span>
        </div>
      </div>
    </div>
  );
};
