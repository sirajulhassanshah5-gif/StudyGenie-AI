import React, { useState } from 'react';
import { Search, Bell, Menu, Plus, LogIn, UserPlus } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'AI Quiz Ready', desc: 'Physics Ch 4 Quiz generated', time: '5m ago', unread: true },
    { id: 2, title: 'Goal Milestone', desc: 'Study streak unlocked! 🔥', time: '1h ago', unread: true },
    { id: 3, title: 'Upcoming Task', desc: 'Calculus Assignment due tomorrow', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, quizzes, AI topics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right: Quick Action, Notifications, Auth, Theme, Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick New Note Button */}
        <button
          onClick={() => navigate('/notes')}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>

        {/* Notification Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Auth Links / Profile Avatar */}
        {isAuthenticated && profile ? (
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all"
            title="Account Settings"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-500" />
              <span>Login</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
