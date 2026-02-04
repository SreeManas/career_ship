import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RewardNotification from './components/RewardNotification';
import DailyCheckIn from './components/DailyCheckIn';
import ChatBot from './components/ChatBot';
import Login from './pages/Login';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import Dashboard from './pages/Dashboard';
import CommunityFeed from './pages/CommunityFeed';
import ChallengeQuiz from './pages/ChallengeQuiz';
import { hasCheckedInToday } from './services/dailyCheckIn';

// Wrapper component to handle daily check-in
const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);

  // Check if we should show daily check-in
  useEffect(() => {
    const checkDailyStatus = async () => {
      if (user && location.pathname !== '/login') {
        try {
          const hasChecked = await hasCheckedInToday(user.uid);
          if (!hasChecked) {
            // Small delay to let the page load first
            setTimeout(() => setShowDailyCheckIn(true), 1000);
          }
        } catch (error) {
          console.error('Error checking daily status:', error);
        }
      }
    };

    checkDailyStatus();
  }, [user, location.pathname]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global reward notification */}
      <RewardNotification />

      {/* Chatbot - only shows for logged in users */}
      <ChatBot />

      {/* Daily check-in dialog */}
      <DailyCheckIn
        open={showDailyCheckIn}
        onClose={() => setShowDailyCheckIn(false)}
      />

      <Routes>
        {/* Login page without navbar */}
        <Route path="/login" element={<Login />} />

        {/* Protected pages with navbar */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Navbar />
              <Roadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Navbar />
              <CommunityFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenge/:role?"
          element={
            <ProtectedRoute>
              <Navbar />
              <ChallengeQuiz />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <GamificationProvider>
          <LanguageProvider>
            <Router>
              <AppContent />
            </Router>
          </LanguageProvider>
        </GamificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

