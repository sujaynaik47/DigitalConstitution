import React from 'react';

const OurMissionPage = () => {
  return (
    <div className="min-h-screen p-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 border-b pb-2">Our Mission</h1>
      <p className="text-gray-700 text-lg mb-4">
        Our mission is to establish the world's most participatory digital democracy platform. 
        We strive to ensure the foundational documents of our nation, including the Constitution, 
        evolve through a collaborative, secure, and fully auditable public process.
      </p>
      <blockquote className="mt-8 p-4 border-l-4 border-green-500 bg-gray-50 italic text-xl text-gray-600">
        "To empower every citizen with a direct, verifiable stake in their nation's legal future."
      </blockquote>
    </div>
  );
};

export default OurMissionPage;