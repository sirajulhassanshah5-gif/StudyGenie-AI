import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
=======
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
<<<<<<< HEAD
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
=======

export interface LoginPageProps {
  onSwitchToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
<<<<<<< HEAD
      setEmailError('Please enter a valid email address.');
=======
      setEmailError('Please enter a valid email address (e.g. name@example.com).');
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required.');
      return false;
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) validateEmail(val);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) validatePassword(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSuccess(false);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);

<<<<<<< HEAD
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      login(email, 'Alex Rivera');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }, 1000);
=======
    // Simulate API network request
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
    }, 1500);
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
  };

  return (
    <div className="space-y-6 w-full">
      {loginSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
<<<<<<< HEAD
          <span>Login successful! Redirecting to your Dashboard...</span>
=======
          <span>Login successful! Welcome back to StudyGenie AI.</span>
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
        </div>
      )}

      {/* Social Logins */}
      <div className="space-y-3">
        <SocialAuthButtons />
        
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-slate-950 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500 absolute">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="login-email-input"
          label="Email Address"
          type="email"
          placeholder="student@university.edu"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => validateEmail(email)}
          error={emailError}
          required
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          id="login-password-input"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          required
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              id="login-password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-400 hover:text-slate-200 p-1 focus:outline-none cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Options Row */}
        <div className="flex items-center justify-between text-xs py-1">
          <label className="flex items-center gap-2 cursor-pointer group text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              id="login-remember-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
            />
            <span>Remember me for 30 days</span>
          </label>

          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset link sent! (Frontend Demo)');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          id="login-submit-btn"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Sign In to Account
        </Button>
      </form>

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-400 pt-2">
        Don&apos;t have an account?{' '}
<<<<<<< HEAD
        <Link
          to="/register"
          className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
        >
          Create free account
        </Link>
=======
        <button
          type="button"
          id="switch-to-register-btn"
          onClick={onSwitchToRegister}
          className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
        >
          Create free account
        </button>
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
      </p>
    </div>
  );
};
