import React from 'react';

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-2xl rounded-xl">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">Help Center</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Find guides, tutorials, and support resources for all aspects of the platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 border rounded-lg hover:shadow-md transition duration-200">
            <span className="text-4xl mb-2 block">👤</span>
            <h3 className="font-semibold text-lg text-orange-600">User Guides</h3>
            <p className="text-sm text-gray-500">Learn how to create posts and vote.</p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-md transition duration-200">
            <span className="text-4xl mb-2 block">🛡️</span>
            <h3 className="font-semibold text-lg text-orange-600">Security & Trust</h3>
            <p className="text-sm text-gray-500">Information on data integrity.</p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-md transition duration-200">
            <span className="text-4xl mb-2 block">✉️</span>
            <h3 className="font-semibold text-lg text-orange-600">Contact Support</h3>
            <p className="text-sm text-gray-500">Reach out to our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;