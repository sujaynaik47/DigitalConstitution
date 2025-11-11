import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen p-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 border-b pb-2">About Our Digital Platform</h1>
      <p className="text-gray-700 text-lg mb-4">
        We are a transparent, citizen-centric platform designed to modernize constitutional discourse. 
        Our goal is to bridge the gap between citizens, lawmakers, and policy experts, ensuring 
        that every voice contributes to the nation's digital governance.
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-3">Core Values</h2>
        <ul className="list-disc list-inside text-gray-600 ml-4">
          <li>Transparency and Accountability</li>
          <li>Inclusivity and Accessibility</li>
          <li>Informed Civic Engagement</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUsPage;