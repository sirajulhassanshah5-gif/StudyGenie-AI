import React from 'react';
import { Plus, Bot, HelpCircle, Layers, Timer, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Note',
      desc: 'Summarize with AI',
      icon: Plus,
      path: '/notes',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Ask AI Tutor',
      desc: 'Instant explanation',
      icon: Bot,
      path: '/ai-chat',
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: 'Start AI Quiz',
      desc: 'Test knowledge',
      icon: HelpCircle,
      path: '/quiz',
      color: 'from-amber-500 to-rose-600',
    },
    {
      title: 'Revision Deck',
      desc: 'Smart flashcards',
      icon: Layers,
      path: '/flashcards',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Pomodoro Timer',
      desc: 'Focus 25 mins',
      icon: Timer,
      path: '/planner',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(act.path)}
              className="group p-4 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all text-left flex flex-col justify-between space-y-3"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
