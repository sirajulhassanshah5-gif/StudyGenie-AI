import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
=======
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
<<<<<<< HEAD
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

=======

export interface RegisterPageProps {
  onSwitchToLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Errors state
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const validateFullName = (val: string): boolean => {
    if (!val.trim()) {
      setFullNameError('Full name is required.');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validateEmail = (val: string): boolean => {
    if (!val) {
      setEmailError('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
<<<<<<< HEAD
      setEmailError('Please enter a valid email.');
=======
      setEmailError('Please enter a valid email (e.g. alex@university.edu).');
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError('Password is required.');
      return false;
    }
    if (val.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (val: string): boolean => {
    if (!val) {
      setConfirmError('Please confirm your password.');
      return false;
    }
    if (val !== password) {
      setConfirmError('Passwords do not match.');
      return false;
    }
    setConfirmError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess(false);

    const isNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!agreeTerms) {
      setTermsError('You must agree to the Terms of Service & Privacy Policy.');
    } else {
      setTermsError('');
    }

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid || !agreeTerms) {
      return;
    }

    setIsLoading(true);

<<<<<<< HEAD
    setTimeout(() => {
      setIsLoading(false);
      setRegisterSuccess(true);
      login(email, fullName);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1200);
=======
    // Simulate API registration request
    setTimeout(() => {
      setIsLoading(false);
      setRegisterSuccess(true);
    }, 1800);
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
  };

  return (
    <div className="space-y-6 w-full">
      {registerSuccess ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Registration Successful!</h3>
          <p className="text-xs text-slate-300">
<<<<<<< HEAD
            Welcome to StudyGenie AI, <span className="font-semibold text-emerald-400">{fullName}</span>! Your account has been created. Redirecting to dashboard...
          </p>
=======
            Welcome to StudyGenie AI, <span className="font-semibold text-emerald-400">{fullName}</span>! Your account has been created.
          </p>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onSwitchToLogin}
            className="mt-2"
          >
            Proceed to Sign In
          </Button>
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
        </div>
      ) : (
        <>
          {/* Social Registrations */}
          <div className="space-y-3">
            <SocialAuthButtons />

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-slate-950 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500 absolute">
                Or register with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="register-fullname-input"
              label="Full Name"
              type="text"
              placeholder="Alex Morgan"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fullNameError) validateFullName(e.target.value);
              }}
              onBlur={() => validateFullName(fullName)}
              error={fullNameError}
              required
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              id="register-email-input"
              label="Email Address"
              type="email"
              placeholder="alex@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              error={emailError}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                id="register-password-input"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                error={passwordError}
                required
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    id="register-password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-200 p-1 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-slate-200">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full flex-1 transition-all duration-300 ${
                        strength.score >= 1 ? strength.color : 'bg-slate-800'
                      }`}
                    />
                    <div
                      className={`h-full flex-1 transition-all duration-300 ${
                        strength.score >= 2 ? strength.color : 'bg-slate-800'
                      }`}
                    />
                    <div
                      className={`h-full flex-1 transition-all duration-300 ${
                        strength.score >= 3 ? strength.color : 'bg-slate-800'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              id="register-confirm-password-input"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) validateConfirmPassword(e.target.value);
              }}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              error={confirmError}
              required
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            />

            {/* Terms & Privacy Agreement */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  id="register-terms-checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (e.target.checked) setTermsError('');
                  }}
                  className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 mt-0.5 cursor-pointer shrink-0"
                />
                <span>
                  I agree to the{' '}
                  <a href="#terms" onClick={(e) => e.preventDefault()} className="text-indigo-400 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-indigo-400 hover:underline">
                    Privacy Policy
                  </a>.
                </span>
              </label>
              {termsError && <p className="text-xs text-rose-500 font-medium">{termsError}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              id="register-submit-btn"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Create Free Account
            </Button>
          </form>

          {/* Switch to Login */}
          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
<<<<<<< HEAD
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Sign in
            </Link>
=======
            <button
              type="button"
              id="switch-to-login-btn"
              onClick={onSwitchToLogin}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Sign in
            </button>
>>>>>>> 170f2920a479c94cf3366ac1d149dde6b963c63f
          </p>
        </>
      )}
    </div>
  );
};
