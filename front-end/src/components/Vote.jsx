// import React, { useState, useEffect } from "react";

import React, { useState, useEffect } from "react";

const Vote = () => {
  const [problems, setProblems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/problems");
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      }
    };

    fetchProblems();
  }, []);

  const handleSelect = (id) => {
    if (!hasVoted) {
      setSelectedOption(id);
    }
  };

  const handleDone = async () => {
    if (selectedOption === null) {
      alert("❌ Please select an option first!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteId: selectedOption }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      const updated = await response.json();
      setProblems(updated); // assuming backend returns updated list
      setHasVoted(true);
      alert("✅ Your vote has been submitted!");
    } catch (error) {
      console.error("Vote submission failed:", error);
      alert("❌ Failed to submit vote. Please try again.");
    }
  };

  const topProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Choose the issue you feel is most important:
        </h2>

        {topProblems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => handleSelect(problem.id)}
            className={`cursor-pointer border rounded-xl p-4 mb-3 flex justify-between items-center transition
              ${selectedOption === problem.id ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-100"}
              ${hasVoted ? "pointer-events-none opacity-70" : ""}`}
          >
            <p className="text-gray-800 font-medium">{problem.text}</p>
            <span className="text-gray-600 font-semibold">{problem.upvotes}</span>
          </div>
        ))}

        <button
          onClick={handleDone}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Done ✅
        </button>
      </div>
    </div>
  );
};

export default Vote;
