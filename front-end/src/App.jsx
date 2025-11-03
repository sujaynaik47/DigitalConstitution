//App.jsx

import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage.jsx';
import ProfileView from './components/ProfileView.jsx';

import Ap from './components/Home.jsx';

export default function App() {
  const [user, setUser] = useState(null); // null = logged out, {object} = logged in
  const [isAuthReady, setIsAuthReady] = useState(false); // Used to show a loading spinner

  // Simulate checking for a user session on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 500); // 0.5 second loading 

    return () => clearTimeout(timer);
  }, []);

  // This function is passed to LoginPage
  const handleLogin = (fakeUser) => {
    setUser(fakeUser);
  };

  // This function is passed to LoggedInView
  const handleLogout = () => {
    setUser(null);
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
    <>
      {user ? <Ap user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
      <ProfileView initialUser={user} />
    </>
  );
}