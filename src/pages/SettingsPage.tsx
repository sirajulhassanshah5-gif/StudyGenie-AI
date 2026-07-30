import React, { useState } from 'react';
import { Settings, User, Bell, Moon, Sun, Bot, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || '');
  const [aiModel, setAiModel] = useState('StudyGenie Pro (Gemini 2.5)');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white/70 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Settings & Preferences</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage account, AI settings, and themes</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Settings */}
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Academic Field / Major</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* AI & Theme Settings */}
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-500" />
            AI & Theme Preferences
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Default AI Tutor Model</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="StudyGenie Pro (Gemini 2.5)">StudyGenie Pro (Fast STEM Explanations)</option>
                <option value="StudyGenie Ultra (GPT-4o)">StudyGenie Ultra (Deep Proofs & Code)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">App Theme</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Currently using {theme} mode</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-[11px]"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Daily Study Reminders</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive quiz & goal milestone alerts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully!
            </span>
          ) : (
            <span />
          )}

          <Button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center space-x-2 shadow-lg shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
