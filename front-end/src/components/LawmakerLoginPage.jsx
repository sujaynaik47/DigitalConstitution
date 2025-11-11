import React from 'react';

const LawmakerLoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-lg border-t-4 border-blue-800">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Lawmaker Portal Access</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">Official ID</label>
            <input 
              type="text" 
              id="id" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              placeholder="e.g., MP-12345"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Log In Securely
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          <a href="/support" className="text-blue-600 hover:text-blue-800">Need Assistance?</a>
        </p>
      </div>
    </div>
  );
};

export default LawmakerLoginPage;