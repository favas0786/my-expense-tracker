import { useState } from 'react';
import "./App.css";
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { useTheme } from './hooks/useTheme';

function App() {
  // Get the current user and loading state
  const { user, isLoading } = useAuth();
  
  // Manage which auth form to show
  const [showLogin, setShowLogin] = useState(true);

  // Initialize theme
  useTheme();

  // Show a global loading spinner
  if (isLoading) {
    return (
      <div className="global-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  // If a user is logged in, show the Dashboard
  if (user) {
    return <Dashboard />;
  }

  // If no user, show the Login or Sign Up form
  return (
    <div className="auth-page">
      {showLogin ? (
        <Login onToggleForm={() => setShowLogin(false)} />
      ) : (
        <SignUp onToggleForm={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;