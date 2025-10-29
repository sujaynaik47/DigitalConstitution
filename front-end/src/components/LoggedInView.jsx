import React from 'react';
import Icon from './Icon.jsx';

const LoggedInView = ({ user, onLogout }) => {
  const userName = user.displayName || "User";

  const handleLogout = () => {
    console.log("Simulating logout...");
    onLogout();
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

export default LoggedInView;