import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen p-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 border-b pb-2">Terms of Service</h1>
      <h2 className="text-2xl font-semibold text-orange-600 mb-3">1. User Conduct</h2>
      <p className="text-gray-700 mb-4">
        Users must engage in respectful, constructive dialogue. Harassment, hate speech, or 
        misinformation will lead to account suspension. All content is subject to moderation 
        in accordance with national laws.
      </p>
      <h2 className="text-2xl font-semibold text-orange-600 mb-3">2. Voting Integrity</h2>
      <p className="text-gray-700">
        Only verified citizens may vote. Attempts to manipulate the voting system will be met 
        with severe penalties, including referral to relevant law enforcement agencies.
      </p>
      <p className="text-sm text-gray-500 mt-6">Last updated: November 2025</p>
    </div>
  );
};

export default TermsOfServicePage;