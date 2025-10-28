// This file is located at `front-end/src/App.jsx`

import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- Firebase Configuration ---
// This is SAFE. It loads the keys from your .env file.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replaced import.meta.env for Canvas preview
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Icon Component ---
const Icon = ({ name, className }) => {
  const icons = {
    google: (
      <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.03-4.66 2.03-3.86 0-6.99-3.1-6.99-7.01s3.13-7.01 6.99-7.01c2.18 0 3.54.88 4.38 1.69l2.6-2.59C16.97 1.01 14.9 0 12.48 0 5.88 0 0 5.58 0 12.01s5.88 12.01 12.48 12.01c7.25 0 12.08-4.88 12.08-12.01 0-.76-.08-1.5-.2-2.22l-11.88.01z" fill="currentColor" />
      </svg>
    ),
    logout: ( // This is needed for the LoggedInView
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  };
  
  return <span className={className}>{icons[name]}</span> || null;
};

// --- LoggedInView (Placeholder) ---
// A simple view to show after the user logs in.
// This is needed for the login test to pass.
const LoggedInView = ({ user }) => {
  const userName = user.displayName || "User";

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-700 mb-6">
          You are successfully logged in. The dashboard page will be built here.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          <Icon name="logout" className="w-5 h-5 inline-block mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};


// --- LoginPage Component ---
const LoginPage = () => {
  const [loginType, setLoginType] = useState('citizen'); // 'citizen' or 'expert'
  const [expertMode, setExpertMode] = useState('login'); // 'login', 'signup', or 'forgot'
  const [message, setMessage] = useState(''); // For success/error messages

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setMessage("Redirecting to Google...");
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setMessage("Login failed. Please try again.");
    }
  };

  const handleExpertSubmit = (e) => {
    e.preventDefault();
    if (expertMode === 'login') {
      console.log("Expert login submitted (placeholder)");
      setMessage("Expert login is not yet implemented.");
    } else if (expertMode === 'signup') {
      console.log("Expert registration submitted (placeholder)");
      setMessage("Expert registration is not yet implemented.");
    } else {
      console.log("Forgot password submitted (placeholder)");
      setMessage("Password reset email sent (placeholder).");
    }
  };
  
  const getExpertTitle = () => {
    if (expertMode === 'login') return 'Login using your verified credentials.';
    if (expertMode === 'signup') return 'Create your verified expert account.';
    if (expertMode === 'forgot') return 'Reset your password.';
    return '';
  };
  
  const getSubmitButtonText = () => {
    if (expertMode === 'login') return 'Login as Expert';
    if (expertMode === 'signup') return 'Register Expert Account';
    if (expertMode === 'forgot') return 'Send Reset Email';
    return '';
  };
  
  const getToggleText = () => {
    if (expertMode === 'login') {
      return "Expert or Lawmaker? Request a verified account.";
    }
    if (expertMode === 'signup') {
      return "Already verified? Login here.";
    }
    if (expertMode === 'forgot') {
      return "Back to Login";
    }
  };

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
            alt="Emblem of India"
            className="h-16 w-16 object-contain mb-4"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/ccc/333?text=Logo'; }}
          />
          <h1 className="text-2xl font-bold text-blue-900 text-center">
            Digital Constitution Platform
          </h1>
          <p className="text-sm text-gray-600 mt-1">A Platform for Civic Engagement</p>
        </div>

        <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setLoginType('citizen')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
              loginType === 'citizen'
                ? 'bg-white shadow text-blue-800'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => setLoginType('expert')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-all duration-300 ${
              loginType === 'expert'
                ? 'bg-white shadow text-blue-800'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Expert / Lawmaker
          </button>
        </div>

        {loginType === 'citizen' && (
          <div className="flex flex-col items-center">
            <p className="text-center text-sm text-gray-700 mb-5">
              Join the discussion using your Google account.
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300 flex items-center justify-center gap-3"
            >
              <Icon name="google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        )}

        {loginType === 'expert' && (
          <form onSubmit={handleExpertSubmit}>
             <p className="text-center text-sm text-gray-700 mb-5">
              {getExpertTitle()}
            </p>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Verified Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your.email@gov.in"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {expertMode !== 'forgot' && (
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            {expertMode === 'signup' && (
              <div className="mb-4">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label> {/* <-- This was the line with the typo, now fixed */}
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            {expertMode === 'login' && (
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={() => setExpertMode('forgot')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              {getSubmitButtonText()}
            </button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setExpertMode(expertMode === 'login' ? 'signup' : (expertMode === 'signup' ? 'login' : 'login'))}
                className="text-sm text-blue-600 hover:underline"
              >
                {getToggleText()}
              </button>
            </div>

          </form>
        )}
        
        {message && (
          <p className="text-center text-sm text-blue-700 mt-4">{message}</p>
        )}
      </div>

      <footer className="text-center mt-8 text-xs text-gray-600">
        <p>© 2025 Digital Constitution Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Set up auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !user.isAnonymous) {
        setUser(user);
      } else {
        setUser(null);
        if (!isAuthReady) {
          try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              await signInWithCustomToken(auth, __initial_auth_token);
            } else {
              await signInAnonymously(auth);
            }
          } catch (error)
 {
            console.error("Error during initial sign-in:", error);
          }
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [isAuthReady]);

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
      {user ? <LoggedInView user={user} /> : <LoginPage />}
    </>
  );
}


