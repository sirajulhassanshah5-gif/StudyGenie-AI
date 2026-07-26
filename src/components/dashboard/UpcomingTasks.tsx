import React from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpcomingTasks: React.FC = () => {
  const navigate = useNavigate();

  const upcoming = [
    {
      title: 'Midterm Exam - Computer Systems',
      date: 'Tomorrow, 10:00 AM',
      type: 'Exam',
      priority: 'High',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Calculus Assignment 5 Submission',
      date: 'July 28, 11:59 PM',
      type: 'Assignment',
      priority: 'Medium',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Group Revision: Quantum Mechanics',
      date: 'July 29, 3:00 PM',
      type: 'Study Group',
      priority: 'Low',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Tasks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deadlines & study sessions</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/planner')}
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          View Planner
        </button>
      </div>

      <div className="space-y-3">
        {upcoming.map((item, idx) => (
          <div 
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between hover:border-indigo-500/40 transition-all text-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.date}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${item.color}`}>
                {item.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
