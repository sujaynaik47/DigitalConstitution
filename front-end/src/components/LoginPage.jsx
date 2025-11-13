// LoginPage.jsx

import React, { useEffect, useState } from 'react';
// --- 1. IMPORT FRAMER MOTION ---
import { motion, AnimatePresence } from 'framer-motion';

// --- ICON COMPONENT ---
const Icon = ({ name, className }) => {
  if (name === 'google') {
    return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.4H24v7.9h10.9c-.8 5-4.7 8.5-10.9 8.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.4 0 6.4 1.4 8.6 3.6l5.9-5.9C36.6 5.8 30.7 3 24 3 13.5 3 4.8 11.7 4.8 22s8.7 19 19.2 19c11.3 0 19.5-8.5 19.5-18.7 0-1.2-.2-2.3-.4-3.4z"/>
        <path fill="#FF3D00" d="M6.5 22c0-2.4.6-4.7 1.7-6.7l-6-4.6C1.9 14.8 1 18.2 1 22s.9 7.2 2.2 10.3l6-4.6c-1-2-1.7-4.3-1.7-6.7z"/>
        <path fill="#4CAF50" d="M24 41c5.9 0 10.9-2.4 14.5-6.5l-6-4.6c-1.9 2.4-4.7 3.9-8.5 3.9-6.6 0-12-5.4-12-12h-6c0 10.5 8.7 19 19.2 19z"/>
        <path fill="#1976D2" d="M43.6 20.4c.1 1.2.2 2.3.2 3.4 0 1.2-.1 2.4-.3 3.5H24v-7.9h19.6c.1.9.2 1.9.2 3.4z"/>
      </svg>
    );
  }
  return <div className={className}></div>;
};

// --- UTILITY TO DECODE GOOGLE TOKEN ---
const decodeJwtToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return { name: "Guest User", email: "guest@example.com" };
  }
};

// --- MAIN LOGIN COMPONENT ---
const LoginPage = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('citizen');
  const [expertMode, setExpertMode] = useState('login');
  const [message, setMessage] = useState('Please sign in to continue.');

  const GOOGLE_CLIENT_ID = "643839752757-02lgp6m87gddf941rr30vi8u4jfibgni.apps.googleusercontent.com";

  // ✅ Handle Google Sign-in Response
  const handleGoogleResponse = async (response) => {
    const userObject = decodeJwtToken(response.credential);
    console.log("Google User:", userObject);

    try {
      // ✅ Send user data to backend for registration/login
      const res = await fetch("http://localhost:5000/api/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userObject.name,
          email: userObject.email,
          picture: userObject.picture,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Google login failed");
        return;
      }

      // ✅ CRITICAL: Store the complete user object from backend (includes userId)
      console.log("Backend response user data:", data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMessage(`Welcome, ${data.user.name || userObject.name}!`);
      onLogin({ 
        displayName: data.user.name || userObject.name, 
        email: data.user.email,
        userId: data.user.userId 
      });

    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Error connecting to backend");
    }
  };

  // ✅ Initialize Google Button
  useEffect(() => {
    if (loginType !== 'citizen') return;

    const loadGoogleScript = () => {
      if (window.google) {
        initializeGSI();
        return;
      }
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = initializeGSI;
    };

    const initializeGSI = () => {
      if (window.google && document.getElementById("googleSignInDiv")) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", text: "signin_with" }
        );
      }
    };

    loadGoogleScript();
  }, [loginType]);

  // ✅ Expert form submit handler
  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password?.value;

    try {
      if (expertMode === 'login') {
        const res = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Login failed");

        // ✅ CRITICAL: Store the complete user object from backend (includes userId)
        console.log("Backend response user data:", data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        setMessage("Login successful!");
        onLogin({ 
          displayName: data.user.name || "Expert User", 
          email: data.user.email,
          userId: data.user.userId 
        });

      } else if (expertMode === 'signup') {
        const confirmPassword = e.target['confirm-password'].value;
        if (password !== confirmPassword)
          return alert("Passwords do not match!");

        const res = await fetch("http://localhost:5000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: email.split('@')[0] }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Signup failed");

        // ✅ CRITICAL: Store the complete user object from backend (includes userId)
        console.log("Backend response user data:", data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        setMessage("Registration successful!");
        onLogin({ 
          displayName: data.user.name || "New Expert", 
          email: data.user.email,
          userId: data.user.userId 
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  // UI Helpers
  const getExpertTitle = () => expertMode === 'login'
    ? 'Login using your verified credentials.'
    : expertMode === 'signup'
    ? 'Create your verified expert account.'
    : 'Reset your password.';

  const getSubmitButtonText = () =>
    expertMode === 'login'
      ? 'Login as Expert'
      : expertMode === 'signup'
      ? 'Register Expert Account'
      : 'Send Reset Email';

  const getToggleText = () =>
    expertMode === 'login'
      ? "Expert or Lawmaker? Request a verified account."
      : expertMode === 'signup'
      ? "Already verified? Login here."
      : "Back to Login";

  const toggleExpertMode = () => {
    if (expertMode === 'login') setExpertMode('signup');
    else setExpertMode('login');
  };

  // --- 2. DEFINE ANIMATION VARIANTS ---
  const formVariants = {
    hidden: { opacity: 0, x: -50, transition: { duration: 0.3 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };


  // --- JSX ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="w-1/3 h-full bg-orange-500"></div>
          <div className="w-1/3 h-full bg-white"></div>
          <div className="w-1/3 h-full bg-green-600"></div>
        </div>

        <div className="flex flex-col items-center mb-6 pt-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png"
            alt="Emblem"
            className="h-16 w-16 mb-4"
          />
          <h1 className="text-2xl font-bold text-blue-900 text-center">
            Digital Constitution Platform
          </h1>
          <p className="text-sm text-gray-600 mt-1">A Platform for Civic Engagement</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setLoginType('citizen')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
              loginType === 'citizen' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => setLoginType('expert')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
              loginType === 'expert' ? 'bg-white shadow text-blue-800' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Expert / Lawmaker
          </button>
        </div>

        {/* --- 3. WRAP TAB CONTENT --- */}
        {/* This div helps set a consistent height so the box doesn't jump */}
        <div className="relative" style={{ minHeight: '250px' }}> 
          <AnimatePresence mode="wait">
            {/* Citizen (Google) */}
            {loginType === 'citizen' && (
              <motion.div
                key="citizen"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full" // Add this to prevent layout shift
              >
                <div className="flex flex-col items-center">
                  <p className="text-center text-sm text-gray-700 mb-5">
                    Join the discussion using your Google account.
                  </p>
                  <div id="googleSignInDiv" className="w-full"></div>
                </div>
              </motion.div>
            )}

            {/* Expert */}
            {loginType === 'expert' && (
              <motion.div
                key="expert"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full" // Add this to prevent layout shift
              >
                <form onSubmit={handleExpertSubmit}>
                  <p className="text-center text-sm text-gray-700 mb-5">{getExpertTitle()}</p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verified Email</label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-2 border rounded" />
                  </div>

                  {expertMode !== 'forgot' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="password" id="password" name="password" required className="w-full px-4 py-2 border rounded" />
                    </div>
                  )}

                  {expertMode === 'signup' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input type="password" id="confirm-password" name="confirm-password" required className="w-full px-4 py-2 border rounded" />
                    </div>
                  )}

                  <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    {getSubmitButtonText()}
                  </button>

                  <div className="text-center mt-4">
                    <button type="button" onClick={toggleExpertMode} className="text-sm text-blue-600 hover:underline">
                      {getToggleText()}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {message && <p className="text-center text-sm text-blue-700 mt-4">{message}</p>}
      </div>

      <footer className="text-center mt-8 text-xs text-gray-600">
        <p>© 2025 Digital Constitution Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
