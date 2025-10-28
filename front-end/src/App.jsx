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
// These global variables are provided by the environment.
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { 
      apiKey: "YOUR_FALLBACK_API_KEY", 
      authDomain: "YOUR_FALLBACK_AUTH_DOMAIN", 
      projectId: "YOUR_FALLBACK_PROJECT_ID" 
    };

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Icon Component ---
// A reusable component for our SVG icons
const Icon = ({ name, className }) => {
  const icons = {
    google: (
      <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.03-4.66 2.03-3.86 0-6.99-3.1-6.99-7.01s3.13-7.01 6.99-7.01c2.18 0 3.54.88 4.38 1.69l2.6-2.59C16.97 1.01 14.9 0 12.48 0 5.88 0 0 5.58 0 12.01s5.88 12.01 12.48 12.01c7.25 0 12.08-4.88 12.08-12.01 0-.76-.08-1.5-.2-2.22l-11.88.01z" fill="currentColor" />
      </svg>
    ),
  };
  
  return <span className={className}>{icons[name]}</span> || null;
};

// --- LoggedInView (Placeholder) ---
// A simple view to show after the user logs in
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
          You are successfully logged in. This is the placeholder page.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// --- LoginPage Component ---
// The main login page UI
const LoginPage = () => {
  const [loginType, setLoginType] = useState('citizen'); // 'citizen' or 'expert'
  const [message, setMessage] = useState(''); // For success/error messages

  // Google Login Handler
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setMessage("Redirecting to Google...");
      await signInWithPopup(auth, provider);
      // onAuthStateChanged in App will handle the view change
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setMessage("Login failed. Please try again.");
    }
  };

  // Expert Login Handler (Placeholder)
  const handleExpertLogin = (e) => {
    e.preventDefault();
    console.log("Expert login submitted (placeholder)");
    setMessage("Expert login is not yet implemented.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
        {/* Tricolor border accent */}
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="w-1/3 h-full bg-orange-500"></div>
          <div className="w-1/3 h-full bg-white"></div>
          <div className="w-1/3 h-full bg-green-600"></div>
        </div>

        <div className="flex flex-col items-center mb-6 pt-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png"
            alt="Emblem of India"
            className="h-16 w-16 object-contain mb-4" // <-- I've made this class more specific
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/ccc/333?text=Logo'; }}
          />
          <h1 className="text-2xl font-bold text-blue-900 text-center">
            Digital Constitution Platform
          </h1>
          <p className="text-sm text-gray-600 mt-1">A Platform for Civic Engagement</p>
        </div>

        {/* --- Login Type Tabs --- */}
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

        {/* --- Citizen Login --- */}
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

        {/* --- Expert Login Form --- */}
        {loginType === 'expert' && (
          <form onSubmit={handleExpertLogin}>
             <p className="text-center text-sm text-gray-700 mb-5">
              Login using your verified credentials.
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
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Login as Expert
            </button>
          </form>
        )}
        
        {/* --- Message Area --- */}
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
// This is the root component that manages auth state
export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Set up auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !user.isAnonymous) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out or anonymous
        setUser(null);

        // Handle initial auth check
        if (!isAuthReady) {
          try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              await signInWithCustomToken(auth, __initial_auth_token);
            } else {
              await signInAnonymously(auth);
            }
          } catch (error) {
            console.error("Error during initial sign-in:", error);
          }
        }
      }
      setIsAuthReady(true);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [isAuthReady]); // Note: isAuthReady dependency added

  // Show loading spinner
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

  // Show Login page or the simple "Logged In" view
  return (
    <>
      {user ? <LoggedInView user={user} /> : <LoginPage />}
    </>
  );
}

