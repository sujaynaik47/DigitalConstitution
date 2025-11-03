import React from 'react';

const OpinionFeed = () => {
  return (
    <div className="py-12 bg-white shadow-lg rounded-xl mt-8 p-10 text-center">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-4">🗳️ Opinion & Voting Central</h2>
      <p className="text-xl text-gray-600 mb-6">
        Review current proposed amendments and cast your provisional vote.
      </p>
      {/* Placeholder for future voting/opinion features */}
      <div className="mt-8 border-t pt-4">
        <p className="text-gray-500">Feature under development. Content will display active voting issues.</p>
        <button className="mt-4 bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600">
          Load Latest Proposal
        </button>
      </div>
    </div>
  );
};

export default OpinionFeed;