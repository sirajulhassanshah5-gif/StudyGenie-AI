import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id?: string;
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-900 dark:text-emerald-200',
      iconColor: 'text-emerald-500',
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-500/30',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-900 dark:text-rose-200',
      iconColor: 'text-rose-500',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/30',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-900 dark:text-amber-200',
      iconColor: 'text-amber-500',
    },
    info: {
      icon: Info,
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-900 dark:text-indigo-200',
      iconColor: 'text-indigo-500',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${config.bg} ${config.border} ${config.text} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && <p className="text-xs opacity-90 mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
