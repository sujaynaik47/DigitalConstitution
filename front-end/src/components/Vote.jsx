// // src/components/Vote.jsx
// import React from "react";

// const Vote = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
//       <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>
//       <p className="text-gray-600 text-lg">This is where users can cast their votes.</p>
//     </div>
//   );
// };

// export default Vote;
import React, { useState, useEffect } from "react";

const Vote = ({ role }) => {
  const [problems, setProblems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [newProblem, setNewProblem] = useState("");

  // --- Simulated stored data (you can later connect this to a backend) ---
  useEffect(() => {
    // Example problems initially
    const exampleProblems = [
      { id: 1, text: "Increase transparency in public fund usage", upvotes: 12 },
      { id: 2, text: "Improve digital literacy in rural areas", upvotes: 8 },
      { id: 3, text: "Reduce corruption in local administration", upvotes: 10 },
      { id: 4, text: "Enhance cybersecurity for government websites", upvotes: 6 },
      { id: 5, text: "Simplify tax filing system", upvotes: 9 },
    ];

    setProblems(exampleProblems);
  }, []);

  // --- Citizen Actions ---
  const handleVote = (id) => {
    if (!hasVoted) {
      setSelectedOption(id);
      setHasVoted(true);
      alert("✅ Vote submitted successfully!");
    } else {
      alert("❌ You’ve already voted once.");
    }
  };

  // --- Expert Actions ---
  const handleAddProblem = () => {
    if (newProblem.trim()) {
      setProblems([
        ...problems,
        { id: Date.now(), text: newProblem, upvotes: 0 },
      ]);
      setNewProblem("");
    }
  };

  const handleUpvoteProblem = (id) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
      )
    );
  };

  // --- Filter top 5 problems (for citizens) ---
  const topProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

      {/* --- Citizen Interface --- */}
      {role === "citizen" && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            Choose the issue you feel is most important:
          </h2>

          {topProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => handleVote(problem.id)}
              className={`cursor-pointer border rounded-xl p-4 mb-3 transition ${
                selectedOption === problem.id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <p className="text-gray-800 font-medium">{problem.text}</p>
            </div>
          ))}

          <button
            onClick={() => {
              if (!hasVoted) alert("Please select an option first!");
              else alert("Vote locked! You can’t vote again.");
            }}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Done ✅
          </button>
        </div>
      )}

      {/* --- Expert Interface --- */}
      {role === "expert" && (
        <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            Add or Upvote Problem Statements 🧠
          </h2>

          <div className="flex gap-3 mb-5">
            <input
              type="text"
              value={newProblem}
              onChange={(e) => setNewProblem(e.target.value)}
              placeholder="Enter a new problem statement..."
              className="flex-grow border border-gray-300 rounded-lg p-2 outline-none"
            />
            <button
              onClick={handleAddProblem}
              className="bg-green-600 text-white px-4 rounded-lg font-medium hover:bg-green-700"
            >
              Add
            </button>
          </div>

          <div>
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="flex justify-between items-center border-b border-gray-200 py-2"
              >
                <p className="text-gray-800">{problem.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">{problem.upvotes}</span>
                  <button
                    onClick={() => handleUpvoteProblem(problem.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    ⬆ Upvote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Fallback (no role found) --- */}
      {!role && (
        <p className="text-gray-500 mt-10 text-lg">
          Please sign in as a citizen or expert to access voting features.
        </p>
      )}
    </div>
  );
};

export default Vote;