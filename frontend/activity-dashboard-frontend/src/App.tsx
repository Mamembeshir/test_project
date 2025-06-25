import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Profile } from './components/Profile';
import { ActivityChart } from './components/ActivityChart';
import { UserAnalytics } from './components/UserAnalytics';
import { Navigation } from './components/Navigation';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Simple router component
const Router = () => {
  const { user, loading } = useAuth();
  const path = window.location.pathname;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    if (path === '/register') {
      return <RegisterForm />;
    }
    return <LoginForm />;
  }

  return (
    <div>
      <Navigation />
      {path === '/' && <Profile />}
      {path === '/analytics' && <UserAnalytics />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
