import { useState } from 'react';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

type AuthView = 'login' | 'register';

function App() {
  const [view, setView] = useState<AuthView>('login');

  return (
    <AuthLayout
      title={view === 'login' ? 'Welcome back' : 'Create your account'}
      subtitle={
        view === 'login'
          ? 'Sign in to continue your study journey with AI.'
          : 'Start your AI-powered learning adventure for free.'
      }
    >
      {view === 'login' ? (
        <LoginPage onSwitchToRegister={() => setView('register')} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setView('login')} />
      )}
    </AuthLayout>
  );
}

export default App;
