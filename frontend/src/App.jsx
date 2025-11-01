import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
// import LoginPage from './components/LoginPage';
import AuthFlow from './components/AuthFlow';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const handleAuthSuccess = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
    console.log("Authentication successful! Token:", newToken);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    console.log("Logged out.");
  };

  return (
    // <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          
          <Route
            path="/login"
            element={<AuthFlow onAuthSuccess={handleAuthSuccess} />}
          />
          
          <Route
            path="/register"
            element={<AuthFlow onAuthSuccess={handleAuthSuccess} />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    // </Router>
  );
}

export default App;