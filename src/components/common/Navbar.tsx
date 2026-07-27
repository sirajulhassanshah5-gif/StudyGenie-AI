import React from 'react';

export interface NavbarProps {
  logo?: React.ReactNode;
  brandName?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  actions?: React.ReactNode;
  onMenuToggle?: () => void;
  className?: string;
  sticky?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  brandName = 'StudyGenie',
  leftContent,
  rightContent,
  actions,
  onMenuToggle,
  className = '',
  sticky = true,
}) => {
  return (
    <header
      className={`w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 transition-colors ${
        sticky ? 'sticky top-0' : 'relative'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            {onMenuToggle && (
              <button
                type="button"
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none lg:hidden"
                aria-label="Toggle Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
              {logo}
              {brandName && (
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {brandName}
                </span>
              )}
            </div>

            {leftContent}
          </div>

          <div className="flex items-center gap-3">
            {rightContent}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      </div>
    </header>
  );
};
