import React, { useState } from 'react';
import Icon from './Icon.jsx';

const LoginPage = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('citizen');
  const [expertMode, setExpertMode] = useState('login');
  const [message, setMessage] = useState('');

  const handleGoogleLogin = async () => {
    setMessage("Simulating Google login...");
    setTimeout(() => {
      onLogin({ displayName: 'Citizen User' });
    }, 500);
  };

  const handleExpertSubmit = (e) => {
    e.preventDefault();
    if (expertMode === 'login') {
      setMessage("Simulating expert login...");
      setTimeout(() => {
        onLogin({ displayName: 'Expert User' });
      }, 500);
    } else if (expertMode === 'signup') {
      setMessage("Simulating expert registration...");
      setTimeout(() => {
        onLogin({ displayName: 'New Expert User' });
      }, 500);
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
        {/* Tricolor border accent */}
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="w-1/3 h-full bg-orange-500"></div>
          <div className="w-1/3 h-full bg-white"></div>
          <div className="w-1/3 h-full bg-green-600"></div>
        </div>

        {/* Header */}
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

        {/* Citizen Form */}
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

        {/* Expert Form */}
        {loginType === 'expert' && (
          <form onSubmit={handleExpertSubmit}>
             <p className="text-center text-sm text-gray-700 mb-5">
              {getExpertTitle()}
            </p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Verified Email
              </label>
              <input
                type="email" id="email" placeholder="your.email@gov.in"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {expertMode !== 'forgot' && (
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password" id="password" placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {expertMode === 'signup' && (
              <div className="mb-4">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password" id="confirm-password" placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {expertMode === 'login' && (
              <div className="text-right mb-4">
                <button type="button" onClick={() => setExpertMode('forgot')} className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
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

export default LoginPage;