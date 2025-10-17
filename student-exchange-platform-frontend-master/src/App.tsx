import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Admin from './pages/admin';
import Navigation from './common/navigation-simple';

// Import student portal pages
import StudentProfile from './pages/profile';
import MatchmakingPage from './pages/matchmaking-fixed';
import Connections from './pages/connections';
import Chatbot from './pages/chatbot';

const App: React.FC = () => {
  // Mock authentication state
  const isAuthenticated = true; // In a real app, this would come from your auth context/state

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={isAuthenticated ? <StudentProfile /> : <Navigate to="/login" />} />
          <Route path="/matchmaking" element={isAuthenticated ? <MatchmakingPage /> : <Navigate to="/login" />} />
          <Route path="/connections" element={isAuthenticated ? <Connections /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
          <Route path="/chatbot" element={isAuthenticated ? <Chatbot /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
