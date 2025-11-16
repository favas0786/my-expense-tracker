import { useState } from 'react';
import "./App.css";
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { useTheme } from './hooks/useTheme';

function App() {

  const { user, isLoading } = useAuth();
  
  const [showLogin, setShowLogin] = useState(true);


  useTheme();

  if (isLoading) {
    return (
      <div className="global-loader">
        <div className="spinner"></div>
      </div>
    );
  }


  if (user) {
    return <Dashboard />;
  }


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