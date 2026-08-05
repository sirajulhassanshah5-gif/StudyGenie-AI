import React from 'react';
import { Sparkles } from 'lucide-react';
import { TodayGoal } from '../components/dashboard/TodayGoal';
import { StudyProgress } from '../components/dashboard/StudyProgress';
import { RecentNotes } from '../components/dashboard/RecentNotes';
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 lg:p-8 border border-indigo-500/30 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Study Assistant Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {profile?.name.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            You've studied <strong>3.5 hours today</strong>. Your exam readiness index is up by 8%. Keep up the strong momentum!
          </p>
        </div>

        {/* Top Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Total Study Time</p>
            <p className="text-lg font-bold text-white">38.5 hrs</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-slate-400">AI Notes Summarized</p>
            <p className="text-lg font-bold text-indigo-400">24 Notes</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Quizzes Mastered</p>
            <p className="text-lg font-bold text-purple-400">18 Passed</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Current Streak</p>
            <p className="text-lg font-bold text-amber-400">Active 🔥</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <QuickActions />

      {/* Grid Layout: Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          <TodayGoal />
          <RecentNotes />
        </div>

        {/* Right 1 Column */}
        <div className="space-y-8">
          <StudyProgress />
          <UpcomingTasks />
        </div>
      </div>
    </div>
  );
};
