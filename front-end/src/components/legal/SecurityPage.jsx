import React from 'react';

const SecurityPage = () => {
  return (
    <div className="min-h-screen p-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 border-b pb-2">Security Overview</h1>
      <h2 className="text-2xl font-semibold text-orange-600 mb-3">Blockchain Integrity</h2>
      <p className="text-gray-700 mb-4">
        The core constitutional amendment records are stored on a private, permissioned blockchain, 
        making all amendments and votes tamper-proof and verifiable by designated authorities.
      </p>
      <h2 className="text-2xl font-semibold text-orange-600 mb-3">Bug Bounty Program</h2>
      <p className="text-gray-700">
        We operate a continuous bug bounty program, inviting ethical hackers to test our security 
        protocols and report vulnerabilities responsibly.
      </p>
      <p className="text-sm text-gray-500 mt-6">For security disclosures, please contact: security@digitalplatform.gov</p>
    </div>
  );
};

export default SecurityPage;