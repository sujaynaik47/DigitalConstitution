import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen p-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 border-b pb-2">Privacy Policy</h1>
      <h2 className="text-2xl font-semibold text-orange-600 mb-3">Data Collection</h2>
      <p className="text-gray-700 mb-4">
        We collect identity data solely for citizen verification to ensure voting and participation integrity. 
        We do not sell or share personal data with third-party advertisers. Your post history and vote 
        records are public and anonymized where required by law.
      </p>
      <h2 className="text-2xl font-semibold text-orange-600 mb-3">Data Security</h2>
      <p className="text-gray-700">
        All sensitive personal information is encrypted and stored securely on government-regulated servers. 
        Voting records are secured using cryptographic hashing.
      </p>
      <p className="text-sm text-gray-500 mt-6">Last updated: November 2025</p>
    </div>
  );
};

export default PrivacyPolicyPage;