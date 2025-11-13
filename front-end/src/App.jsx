//App.jsx

import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage.jsx';
import Ap from './components/Home.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [user, setUser] = useState(null); // null = logged out, {object} = logged in
  const [isAuthReady, setIsAuthReady] = useState(false); // Used to show a loading spinner

  // Simulate checking for a user session on load
  useEffect(() => {
    // Check local storage for a user
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 500); // 0.5 second loading 

    return () => clearTimeout(timer);
  }, []);

  // This function is passed to LoginPage
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    // Note: The LoginPage already saves to localStorage
  };

  // This function is passed to LoggedInView
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-700 mt-4">Loading Platform...</p>
        </div>
      </div>
    );
  }

  return (
    // AnimatePresence is the wrapper that enables exit animations
    <AnimatePresence mode="wait">
      {user ? (
        // --- This is your main app ---
        <motion.div
          key="main-app" // A unique key
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Ap user={user} onLogout={handleLogout} />
        </motion.div>
      ) : (
        // --- This is your login page ---
        <motion.div
          key="login-page" // A unique key
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoginPage onLogin={handleLogin} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
