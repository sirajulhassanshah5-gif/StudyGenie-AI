import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface ThemeToggleProps {
  variant?: 'button' | 'switch' | 'badge';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        id="theme-toggle-switch"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`pointer-events-none flex h-6 w-6 transform items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-md ring-0 transition duration-300 ease-in-out ${
            isDark ? 'translate-x-6 text-amber-400' : 'translate-x-0 text-slate-700'
          }`}
        >
          {isDark ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm backdrop-blur-md cursor-pointer active:scale-95 ${className}`}
    >
      <div className="relative w-4 h-4 overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-4 h-4 text-amber-400 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-4 h-4 text-slate-700 dark:text-slate-300 transition-all duration-300 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </button>
  );
};
