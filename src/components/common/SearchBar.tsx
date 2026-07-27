import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value: customValue,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search...',
  className = '',
  sizeVariant = 'md',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = customValue !== undefined ? customValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (customValue === undefined) setInternalValue(val);
    onChange?.(val);
  };

  const handleClear = () => {
    if (customValue === undefined) setInternalValue('');
    onChange?.('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
    }
  };

  const sizeStyles = {
    sm: 'py-1.5 pl-8 pr-8 text-xs',
    md: 'py-2.5 pl-10 pr-10 text-sm',
    lg: 'py-3.5 pl-12 pr-12 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3.5',
    lg: 'w-5 h-5 left-4',
  };

  const clearIconSizes = {
    sm: 'right-2.5',
    md: 'right-3.5',
    lg: 'right-4',
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search
        className={`absolute text-slate-400 dark:text-slate-500 pointer-events-none ${iconSizes[sizeVariant]}`}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${sizeStyles[sizeVariant]}`}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${clearIconSizes[sizeVariant]}`}
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
