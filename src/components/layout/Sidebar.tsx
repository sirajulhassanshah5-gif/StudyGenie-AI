import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  HelpCircle, 
  Layers, 
  Calendar, 
  Settings, 
  Sparkles, 
  LogOut, 
  LogIn,
  UserPlus,
  Moon, 
  Sun,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { profile, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Notes', path: '/notes', icon: BookOpen },
    { label: 'AI Chat', path: '/ai-chat', icon: Bot, highlight: true },
    { label: 'Quiz', path: '/quiz', icon: HelpCircle },
    { label: 'Flashcards', path: '/flashcards', icon: Layers },
    { label: 'Planner', path: '/planner', icon: Calendar },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const authItems = [
    { label: 'Sign In / Login', path: '/login', icon: LogIn },
    { label: 'Create Account', path: '/register', icon: UserPlus },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 backdrop-blur-xl
        flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800/80">
          <NavLink to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                StudyGenie
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-indigo-400 block -mt-1 uppercase">
                AI Assistant
              </span>
            </div>
          </NavLink>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* Main App Navigation */}
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Navigation</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="space-y-1.5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Account & Access</p>
            {authItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'bg-slate-200 dark:bg-slate-800 text-indigo-500 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User Card & Settings */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          {/* Theme Toggle Quick Switch */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400">
              Toggle
            </span>
          </button>

          {/* Profile snippet */}
          {isAuthenticated && profile ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-center space-x-3 overflow-hidden">
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40 flex-shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{profile.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{profile.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Sign In to Account
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
