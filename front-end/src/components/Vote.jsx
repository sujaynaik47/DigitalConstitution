import React, { useState, useEffect } from "react";

const Vote = () => {
  const [polls, setPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch polls and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          console.error("No user found in localStorage");
          return;
        }

        const user = JSON.parse(storedUser);
        setUserId(user.userId);
        setUserRole(user.role);

        const response = await fetch(`http://localhost:5000/api/vote?userId=${user.userId}`);
        const data = await response.json();
        setPolls(data.polls);

        // Map user votes
        const votesMap = {};
        data.userVotes.forEach(vote => {
          votesMap[vote.pollId] = vote.optionId;
        });
        setUserVotes(votesMap);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectOption = (pollId, optionId) => {
    if (!userVotes[pollId]) {
      setSelectedOptions(prev => ({
        ...prev,
        [pollId]: optionId
      }));
    }
  };

  const handleSubmitVote = async (pollId) => {
    const selectedOptionId = selectedOptions[pollId];
    
    if (!selectedOptionId) {
      alert("❌ Please select an option first!");
      return;
    }

    if (!userId) {
      alert("❌ User not logged in!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          pollId: pollId,
          optionId: selectedOptionId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit vote");
      }

      const data = await response.json();
      
      // Update the specific poll in the polls array
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll.pollId === pollId ? data.poll : poll
        )
      );

      // Mark this poll as voted
      setUserVotes(prev => ({
        ...prev,
        [pollId]: selectedOptionId
      }));

      alert("✅ Your vote has been submitted!");
    } catch (error) {
      console.error("Vote submission failed:", error);
      alert(`❌ ${error.message}`);
    }
  };

  const handleAddOption = () => {
    setNewPollOptions([...newPollOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newPollOptions];
    updated[index] = value;
    setNewPollOptions(updated);
  };

  const handleCreatePoll = async () => {
    if (!newPollQuestion.trim()) {
      alert("❌ Please enter a poll question!");
      return;
    }

    const validOptions = newPollOptions.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("❌ Please provide at least 2 options!");
      return;
    }

    if (!userId) {
      alert("❌ User not logged in!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/vote/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          question: newPollQuestion,
          options: validOptions.map(text => ({ text }))
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create poll");
      }

      const data = await response.json();
      setPolls(data.polls);
      setNewPollQuestion("");
      setNewPollOptions(["", ""]);
      setShowCreateForm(false);
      alert("✅ Poll created successfully!");
    } catch (error) {
      console.error("Poll creation failed:", error);
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

      {userRole === "Expert" && (
        <div className="w-full max-w-3xl mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-md"
          >
            {showCreateForm ? "Cancel" : "Create New Poll ➕"}
          </button>

          {showCreateForm && (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Create New Poll</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Poll Question</label>
                <input
                  type="text"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="Enter your poll question..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Options</label>
                {newPollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {newPollOptions.length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddOption}
                  className="text-blue-600 font-medium hover:text-blue-800 mt-2"
                >
                  + Add Another Option
                </button>
              </div>

              <button
                onClick={handleCreatePoll}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Create Poll
              </button>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-3xl space-y-6">
        {polls.length > 0 ? (
          polls.map((poll) => {
            const hasVoted = userVotes[poll.pollId] !== undefined;
            const selectedOption = selectedOptions[poll.pollId] || userVotes[poll.pollId];
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

            return (
              <div key={poll.pollId} className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {poll.question}
                </h2>

                <div className="space-y-3 mb-4">
                  {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                    const isSelected = selectedOption === option.optionId;

                    return (
                      <div
                        key={option.optionId}
                        onClick={() => handleSelectOption(poll.pollId, option.optionId)}
                        className={`cursor-pointer border rounded-xl p-4 transition relative overflow-hidden
                          ${isSelected ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-50"}
                          ${hasVoted ? "pointer-events-none" : ""}`}
                      >
                        {hasVoted && (
                          <div
                            className="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        
                        <div className="relative flex justify-between items-center">
                          <p className="text-gray-800 font-medium">{option.text}</p>
                          <div className="flex items-center gap-3">
                            {hasVoted && (
                              <span className="text-blue-600 font-semibold">{percentage}%</span>
                            )}
                            <span className="text-gray-600 font-semibold bg-gray-200 px-3 py-1 rounded-full">
                              {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!hasVoted && (
                  <button
                    onClick={() => handleSubmitVote(poll.pollId)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Submit Vote ✅
                  </button>
                )}

                {hasVoted && (
                  <div className="text-center text-green-600 font-semibold py-2">
                    ✓ You have voted on this poll
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-3 text-center">
                  Total votes: {totalVotes}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <p className="text-gray-500 text-lg">No polls available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vote; 







// import React, { useState, useEffect } from "react";

// const Vote = () => {
//   const [problems, setProblems] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newProblemText, setNewProblemText] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [userId, setUserId] = useState("");

//   // Fetch user data and problems on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Get user from localStorage
//         const storedUser = localStorage.getItem("user");
//         if (!storedUser) {
//           console.error("No user found in localStorage");
//           return;
//         }

//         const user = JSON.parse(storedUser);
//         setUserId(user.userId);
//         setUserRole(user.role);

//         // Fetch problems and user's previous vote
//         const response = await fetch(`http://localhost:5000/api/vote?userId=${user.userId}`);
//         const data = await response.json();
//         setProblems(data.problems);
        
//         if (data.userVote) {
//           setSelectedOption(data.userVote);
//           setHasVoted(true);
//         } else if (data.problems.length > 0) {
//           // Auto-select first option (Agree) if user hasn't voted yet
//           setSelectedOption(data.problems[0].problemId);
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSelect = (id) => {
//     if (!hasVoted) {
//       setSelectedOption(id);
//     }
//   };

//   const handleDone = async () => {
//     if (selectedOption === null) {
//       alert("❌ Please select an option first!");
//       return;
//     }

//     if (!userId) {
//       alert("❌ User not logged in!");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/vote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: userId, voteId: selectedOption }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to submit vote");
//       }

//       const data = await response.json();
//       setProblems(data.problems);
//       setHasVoted(true);
//       alert("✅ Your vote has been submitted!");
//     } catch (error) {
//       console.error("Vote submission failed:", error);
//       alert(`❌ ${error.message}`);
//     }
//   };

//   const handleCreateVote = async () => {
//     if (!newProblemText.trim()) {
//       alert("❌ Please enter a problem description!");
//       return;
//     }

//     if (!userId) {
//       alert("❌ User not logged in!");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/vote/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: userId,
//           text: newProblemText
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create vote option");
//       }

//       const data = await response.json();
//       setProblems(data.problems);
//       setNewProblemText("");
//       setShowCreateForm(false);
//       alert("✅ Vote option created successfully!");
//     } catch (error) {
//       console.error("Vote creation failed:", error);
//       alert(`❌ ${error.message}`);
//     }
//   };

//   const topProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
//       <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

//       {userRole === "Expert" && (
//         <div className="w-full max-w-2xl mb-4">
//           <button
//             onClick={() => setShowCreateForm(!showCreateForm)}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
//           >
//             {showCreateForm ? "Cancel" : "Create New Vote Option ➕"}
//           </button>

//           {showCreateForm && (
//             <div className="bg-white p-4 rounded-xl shadow-md mt-3">
//               <h3 className="text-lg font-semibold mb-2 text-gray-700">Create New Voting Option</h3>
//               <input
//                 type="text"
//                 value={newProblemText}
//                 onChange={(e) => setNewProblemText(e.target.value)}
//                 placeholder="Enter problem description..."
//                 className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//               />
//               <button
//                 onClick={handleCreateVote}
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
//               >
//                 Create Vote Option
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
//           Choose the issue you feel is most important:
//         </h2>
//         {topProblems.length > 0 ? (
//           topProblems.map((problem) => (
//             <div
//               key={problem.problemId}
//               onClick={() => handleSelect(problem.problemId)}
//               className={`cursor-pointer border rounded-xl p-4 mb-3 flex justify-between items-center transition
//                 ${selectedOption === problem.problemId ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-100"}
//                 ${hasVoted ? "pointer-events-none opacity-70" : ""}`}
//             >
//               <p className="text-gray-800 font-medium">{problem.text}</p>
//               <span className="text-gray-600 font-semibold">{problem.upvotes}</span>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No voting options available yet.</p>
//         )}
//         <button
//           onClick={handleDone}
//           disabled={hasVoted || topProblems.length === 0}
//           className={`mt-4 w-full py-2 rounded-lg font-semibold ${
//             hasVoted || topProblems.length === 0
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           } text-white`}
//         >
//          ✅
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Vote;









// // import React, { useState, useEffect } from "react";

// // const Vote = () => {
// //   const [problems, setProblems] = useState([]);
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [hasVoted, setHasVoted] = useState(false);
// //   const [showCreateForm, setShowCreateForm] = useState(false);
// //   const [newProblemText, setNewProblemText] = useState("");
// //   const [userRole, setUserRole] = useState("");
// //   const [userId, setUserId] = useState("");

// //   // Fetch user data and problems on component mount
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         // Get user from localStorage
// //         const storedUser = localStorage.getItem("user");
// //         if (!storedUser) {
// //           console.error("No user found in localStorage");
// //           return;
// //         }

// //         const user = JSON.parse(storedUser);
// //         setUserId(user.userId);
// //         setUserRole(user.role);

// //         // Fetch problems and user's previous vote
// //         const response = await fetch(`http://localhost:5000/api/vote?userId=${user.userId}`);
// //         const data = await response.json();
// //         setProblems(data.problems);
        
// //         if (data.userVote) {
// //           setSelectedOption(data.userVote);
// //           setHasVoted(true);
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const handleSelect = (id) => {
// //     if (!hasVoted) {
// //       setSelectedOption(id);
// //     }
// //   };

// //   const handleDone = async () => {
// //     if (selectedOption === null) {
// //       alert("❌ Please select an option first!");
// //       return;
// //     }

// //     if (!userId) {
// //       alert("❌ User not logged in!");
// //       return;
// //     }

// //     try {
// //       const response = await fetch("http://localhost:5000/api/vote", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId: userId, voteId: selectedOption }),
// //       });

// //       if (!response.ok) {
// //         const error = await response.json();
// //         throw new Error(error.error || "Failed to submit vote");
// //       }

// //       const data = await response.json();
// //       setProblems(data.problems);
// //       setHasVoted(true);
// //       alert("✅ Your vote has been submitted!");
// //     } catch (error) {
// //       console.error("Vote submission failed:", error);
// //       alert(`❌ ${error.message}`);
// //     }
// //   };

// //   const handleCreateVote = async () => {
// //     if (!newProblemText.trim()) {
// //       alert("❌ Please enter a problem description!");
// //       return;
// //     }

// //     if (!userId) {
// //       alert("❌ User not logged in!");
// //       return;
// //     }

// //     try {
// //       const response = await fetch("http://localhost:5000/api/vote/create", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           userId: userId,
// //           text: newProblemText
// //         }),
// //       });

// //       if (!response.ok) {
// //         const error = await response.json();
// //         throw new Error(error.error || "Failed to create vote option");
// //       }

// //       const data = await response.json();
// //       setProblems(data.problems);
// //       setNewProblemText("");
// //       setShowCreateForm(false);
// //       alert("✅ Vote option created successfully!");
// //     } catch (error) {
// //       console.error("Vote creation failed:", error);
// //       alert(`❌ ${error.message}`);
// //     }
// //   };

// //   const topProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
// //       <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

// //       {userRole === "Expert" && (
// //         <div className="w-full max-w-2xl mb-4">
// //           <button
// //             onClick={() => setShowCreateForm(!showCreateForm)}
// //             className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
// //           >
// //             {showCreateForm ? "Cancel" : "Create New Vote Option ➕"}
// //           </button>

// //           {showCreateForm && (
// //             <div className="bg-white p-4 rounded-xl shadow-md mt-3">
// //               <h3 className="text-lg font-semibold mb-2 text-gray-700">Create New Voting Option</h3>
// //               <input
// //                 type="text"
// //                 value={newProblemText}
// //                 onChange={(e) => setNewProblemText(e.target.value)}
// //                 placeholder="Enter problem description..."
// //                 className="w-full border border-gray-300 rounded-lg p-2 mb-2"
// //               />
// //               <button
// //                 onClick={handleCreateVote}
// //                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
// //               >
// //                 Create Vote Option
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
// //         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
// //           Choose the issue you feel is most important:
// //         </h2>
// //         {topProblems.length > 0 ? (
// //           topProblems.map((problem) => (
// //             <div
// //               key={problem.problemId}
// //               onClick={() => handleSelect(problem.problemId)}
// //               className={`cursor-pointer border rounded-xl p-4 mb-3 flex justify-between items-center transition
// //                 ${selectedOption === problem.problemId ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-100"}
// //                 ${hasVoted ? "pointer-events-none opacity-70" : ""}`}
// //             >
// //               <p className="text-gray-800 font-medium">{problem.text}</p>
// //               <span className="text-gray-600 font-semibold">{problem.upvotes}</span>
// //             </div>
// //           ))
// //         ) : (
// //           <p className="text-center text-gray-500">No voting options available yet.</p>
// //         )}
// //         <button
// //           onClick={handleDone}
// //           disabled={hasVoted || topProblems.length === 0}
// //           className={`mt-4 w-full py-2 rounded-lg font-semibold ${
// //             hasVoted || topProblems.length === 0
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-blue-600 hover:bg-blue-700"
// //           } text-white`}
// //         >
// //           Done ✅
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Vote;

// import React, { useState, useEffect } from "react";

// const Vote = () => {
//   const [polls, setPolls] = useState([]);
//   const [userVotes, setUserVotes] = useState({});
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newPollQuestion, setNewPollQuestion] = useState("");
//   const [newPollOptions, setNewPollOptions] = useState(["", ""]);
//   const [userRole, setUserRole] = useState("");
//   const [userId, setUserId] = useState("");

//   // Fetch polls and user data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedUser = localStorage.getItem("user");
//         if (!storedUser) {
//           console.error("No user found in localStorage");
//           return;
//         }

//         const user = JSON.parse(storedUser);
//         setUserId(user.userId);
//         setUserRole(user.role);

//         const response = await fetch(`http://localhost:5000/api/vote?userId=${user.userId}`);
//         const data = await response.json();
//         setPolls(data.polls);

//         // Map user votes
//         const votesMap = {};
//         data.userVotes.forEach(vote => {
//           votesMap[vote.pollId] = vote.optionId;
//         });
//         setUserVotes(votesMap);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSelectOption = (pollId, optionId) => {
//     if (!userVotes[pollId]) {
//       setSelectedOptions(prev => ({
//         ...prev,
//         [pollId]: optionId
//       }));
//     }
//   };

//   const handleSubmitVote = async (pollId) => {
//     const selectedOptionId = selectedOptions[pollId];
    
//     if (!selectedOptionId) {
//       alert("❌ Please select an option first!");
//       return;
//     }

//     if (!userId) {
//       alert("❌ User not logged in!");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/vote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: userId,
//           pollId: pollId,
//           optionId: selectedOptionId
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to submit vote");
//       }

//       const data = await response.json();
      
//       // Update the specific poll in the polls array
//       setPolls(prevPolls => 
//         prevPolls.map(poll => 
//           poll.pollId === pollId ? data.poll : poll
//         )
//       );

//       // Mark this poll as voted
//       setUserVotes(prev => ({
//         ...prev,
//         [pollId]: selectedOptionId
//       }));

//       alert("✅ Your vote has been submitted!");
//     } catch (error) {
//       console.error("Vote submission failed:", error);
//       alert(`❌ ${error.message}`);
//     }
//   };

//   const handleAddOption = () => {
//     setNewPollOptions([...newPollOptions, ""]);
//   };

//   const handleRemoveOption = (index) => {
//     if (newPollOptions.length > 2) {
//       setNewPollOptions(newPollOptions.filter((_, i) => i !== index));
//     }
//   };

//   const handleOptionChange = (index, value) => {
//     const updated = [...newPollOptions];
//     updated[index] = value;
//     setNewPollOptions(updated);
//   };

//   const handleCreatePoll = async () => {
//     if (!newPollQuestion.trim()) {
//       alert("❌ Please enter a poll question!");
//       return;
//     }

//     const validOptions = newPollOptions.filter(opt => opt.trim() !== "");
//     if (validOptions.length < 2) {
//       alert("❌ Please provide at least 2 options!");
//       return;
//     }

//     if (!userId) {
//       alert("❌ User not logged in!");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/vote/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: userId,
//           question: newPollQuestion,
//           options: validOptions.map(text => ({ text }))
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create poll");
//       }

//       const data = await response.json();
//       setPolls(data.polls);
//       setNewPollQuestion("");
//       setNewPollOptions(["", ""]);
//       setShowCreateForm(false);
//       alert("✅ Poll created successfully!");
//     } catch (error) {
//       console.error("Poll creation failed:", error);
//       alert(`❌ ${error.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
//       <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

//       {userRole === "Expert" && (
//         <div className="w-full max-w-3xl mb-6">
//           <button
//             onClick={() => setShowCreateForm(!showCreateForm)}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-md"
//           >
//             {showCreateForm ? "Cancel" : "Create New Poll ➕"}
//           </button>

//           {showCreateForm && (
//             <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">Create New Poll</h3>
              
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Poll Question</label>
//                 <input
//                   type="text"
//                   value={newPollQuestion}
//                   onChange={(e) => setNewPollQuestion(e.target.value)}
//                   placeholder="Enter your poll question..."
//                   className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Options</label>
//                 {newPollOptions.map((option, index) => (
//                   <div key={index} className="flex gap-2 mb-2">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, e.target.value)}
//                       placeholder={`Option ${index + 1}`}
//                       className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     {newPollOptions.length > 2 && (
//                       <button
//                         onClick={() => handleRemoveOption(index)}
//                         className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
//                       >
//                         ✕
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 <button
//                   onClick={handleAddOption}
//                   className="text-blue-600 font-medium hover:text-blue-800 mt-2"
//                 >
//                   + Add Another Option
//                 </button>
//               </div>

//               <button
//                 onClick={handleCreatePoll}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
//               >
//                 Create Poll
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       <div className="w-full max-w-3xl space-y-6">
//         {polls.length > 0 ? (
//           polls.map((poll) => {
//             const hasVoted = userVotes[poll.pollId] !== undefined;
//             const selectedOption = selectedOptions[poll.pollId] || userVotes[poll.pollId];
//             const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

//             return (
//               <div key={poll.pollId} className="bg-white p-6 rounded-2xl shadow-lg">
//                 <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//                   {poll.question}
//                 </h2>

//                 <div className="space-y-3 mb-4">
//                   {poll.options.map((option) => {
//                     const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
//                     const isSelected = selectedOption === option.optionId;

//                     return (
//                       <div
//                         key={option.optionId}
//                         onClick={() => handleSelectOption(poll.pollId, option.optionId)}
//                         className={`cursor-pointer border rounded-xl p-4 transition relative overflow-hidden
//                           ${isSelected ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-50"}
//                           ${hasVoted ? "pointer-events-none" : ""}`}
//                       >
//                         {hasVoted && (
//                           <div
//                             className="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-500"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         )}
                        
//                         <div className="relative flex justify-between items-center">
//                           <p className="text-gray-800 font-medium">{option.text}</p>
//                           <div className="flex items-center gap-3">
//                             {hasVoted && (
//                               <span className="text-blue-600 font-semibold">{percentage}%</span>
//                             )}
//                             <span className="text-gray-600 font-semibold bg-gray-200 px-3 py-1 rounded-full">
//                               {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {!hasVoted && (
//                   <button
//                     onClick={() => handleSubmitVote(poll.pollId)}
//                     className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
//                   >
//                     Submit Vote ✅
//                   </button>
//                 )}

//                 {hasVoted && (
//                   <div className="text-center text-green-600 font-semibold py-2">
//                     ✓ You have voted on this poll
//                   </div>
//                 )}

//                 <div className="text-sm text-gray-500 mt-3 text-center">
//                   Total votes: {totalVotes}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
//             <p className="text-gray-500 text-lg">No polls available yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Vote; 







// // import React, { useState, useEffect } from "react";

// // const Vote = () => {
// //   const [problems, setProblems] = useState([]);
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [hasVoted, setHasVoted] = useState(false);
// //   const [showCreateForm, setShowCreateForm] = useState(false);
// //   const [newProblemText, setNewProblemText] = useState("");
// //   const [userRole, setUserRole] = useState("");
// //   const [userId, setUserId] = useState("");

// //   // Fetch user data and problems on component mount
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         // Get user from localStorage
// //         const storedUser = localStorage.getItem("user");
// //         if (!storedUser) {
// //           console.error("No user found in localStorage");
// //           return;
// //         }

// //         const user = JSON.parse(storedUser);
// //         setUserId(user.userId);
// //         setUserRole(user.role);

// //         // Fetch problems and user's previous vote
// //         const response = await fetch(`http://localhost:5000/api/vote?userId=${user.userId}`);
// //         const data = await response.json();
// //         setProblems(data.problems);
        
// //         if (data.userVote) {
// //           setSelectedOption(data.userVote);
// //           setHasVoted(true);
// //         } else if (data.problems.length > 0) {
// //           // Auto-select first option (Agree) if user hasn't voted yet
// //           setSelectedOption(data.problems[0].problemId);
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const handleSelect = (id) => {
// //     if (!hasVoted) {
// //       setSelectedOption(id);
// //     }
// //   };

// //   const handleDone = async () => {
// //     if (selectedOption === null) {
// //       alert("❌ Please select an option first!");
// //       return;
// //     }

// //     if (!userId) {
// //       alert("❌ User not logged in!");
// //       return;
// //     }

// //     try {
// //       const response = await fetch("http://localhost:5000/api/vote", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId: userId, voteId: selectedOption }),
// //       });

// //       if (!response.ok) {
// //         const error = await response.json();
// //         throw new Error(error.error || "Failed to submit vote");
// //       }

// //       const data = await response.json();
// //       setProblems(data.problems);
// //       setHasVoted(true);
// //       alert("✅ Your vote has been submitted!");
// //     } catch (error) {
// //       console.error("Vote submission failed:", error);
// //       alert(`❌ ${error.message}`);
// //     }
// //   };

// //   const handleCreateVote = async () => {
// //     if (!newProblemText.trim()) {
// //       alert("❌ Please enter a problem description!");
// //       return;
// //     }

// //     if (!userId) {
// //       alert("❌ User not logged in!");
// //       return;
// //     }

// //     try {
// //       const response = await fetch("http://localhost:5000/api/vote/create", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           userId: userId,
// //           text: newProblemText
// //         }),
// //       });

// //       if (!response.ok) {
// //         const error = await response.json();
// //         throw new Error(error.error || "Failed to create vote option");
// //       }

// //       const data = await response.json();
// //       setProblems(data.problems);
// //       setNewProblemText("");
// //       setShowCreateForm(false);
// //       alert("✅ Vote option created successfully!");
// //     } catch (error) {
// //       console.error("Vote creation failed:", error);
// //       alert(`❌ ${error.message}`);
// //     }
// //   };

// //   const topProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
// //       <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

// //       {userRole === "Expert" && (
// //         <div className="w-full max-w-2xl mb-4">
// //           <button
// //             onClick={() => setShowCreateForm(!showCreateForm)}
// //             className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
// //           >
// //             {showCreateForm ? "Cancel" : "Create New Vote Option ➕"}
// //           </button>

// //           {showCreateForm && (
// //             <div className="bg-white p-4 rounded-xl shadow-md mt-3">
// //               <h3 className="text-lg font-semibold mb-2 text-gray-700">Create New Voting Option</h3>
// //               <input
// //                 type="text"
// //                 value={newProblemText}
// //                 onChange={(e) => setNewProblemText(e.target.value)}
// //                 placeholder="Enter problem description..."
// //                 className="w-full border border-gray-300 rounded-lg p-2 mb-2"
// //               />
// //               <button
// //                 onClick={handleCreateVote}
// //                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
// //               >
// //                 Create Vote Option
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
// //         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
// //           Choose the issue you feel is most important:
// //         </h2>
// //         {topProblems.length > 0 ? (
// //           topProblems.map((problem) => (
// //             <div
// //               key={problem.problemId}
// //               onClick={() => handleSelect(problem.problemId)}
// //               className={`cursor-pointer border rounded-xl p-4 mb-3 flex justify-between items-center transition
// //                 ${selectedOption === problem.problemId ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-100"}
// //                 ${hasVoted ? "pointer-events-none opacity-70" : ""}`}
// //             >
// //               <p className="text-gray-800 font-medium">{problem.text}</p>
// //               <span className="text-gray-600 font-semibold">{problem.upvotes}</span>
// //             </div>
// //           ))
// //         ) : (
// //           <p className="text-center text-gray-500">No voting options available yet.</p>
// //         )}
// //         <button
// //           onClick={handleDone}
// //           disabled={hasVoted || topProblems.length === 0}
// //           className={`mt-4 w-full py-2 rounded-lg font-semibold ${
// //             hasVoted || topProblems.length === 0
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-blue-600 hover:bg-blue-700"
// //           } text-white`}
// //         >
// //          ✅
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Vote;









// // // import React, { useState, useEffect } from "react";

// // // const Vote = () => {
// // //   const [problems, setProblems] = useState([]);
// // //   const [selectedOption, setSelectedOption] = useState(null);
// // //   const [hasVoted, setHasVoted] = useState(false);
// // //   const [showCreateForm, setShowCreateForm] = useState(false);
// // //   const [newProblemText, setNewProblemText] = useState("");
// // //   const [userRole, setUserRole] = useState("");
// // //   const [userId, setUserId] = useState("");

// // //   // Fetch user data and problems on component mount
// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         // Get user from localStorage
// // //         const storedUser = localStorage.getItem("user");
// // //         if (!storedUser) {
// // //           console.error("No user found in localStorage");
// // //           return;
// // //         }

// // //         const user = JSON.parse(storedUser);
// // //         setUserId(user.userId);
// // //         setUserRole(user.role);

// // //         // Fetch problems and user's previous vote
// // //         const response = await fetch(`http://localhost:5000/api/vote?userId=${user.userId}`);
// // //         const data = await response.json();
// // //         setProblems(data.problems);
        
// // //         if (data.userVote) {
// // //           setSelectedOption(data.userVote);
// // //           setHasVoted(true);
// // //         }
// // //       } catch (error) {
// // //         console.error("Failed to fetch data:", error);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   const handleSelect = (id) => {
// // //     if (!hasVoted) {
// // //       setSelectedOption(id);
// // //     }
// // //   };

// // //   const handleDone = async () => {
// // //     if (selectedOption === null) {
// // //       alert("❌ Please select an option first!");
// // //       return;
// // //     }

// // //     if (!userId) {
// // //       alert("❌ User not logged in!");
// // //       return;
// // //     }

// // //     try {
// // //       const response = await fetch("http://localhost:5000/api/vote", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ userId: userId, voteId: selectedOption }),
// // //       });

// // //       if (!response.ok) {
// // //         const error = await response.json();
// // //         throw new Error(error.error || "Failed to submit vote");
// // //       }

// // //       const data = await response.json();
// // //       setProblems(data.problems);
// // //       setHasVoted(true);
// // //       alert("✅ Your vote has been submitted!");
// // //     } catch (error) {
// // //       console.error("Vote submission failed:", error);
// // //       alert(`❌ ${error.message}`);
// // //     }
// // //   };

// // //   const handleCreateVote = async () => {
// // //     if (!newProblemText.trim()) {
// // //       alert("❌ Please enter a problem description!");
// // //       return;
// // //     }

// // //     if (!userId) {
// // //       alert("❌ User not logged in!");
// // //       return;
// // //     }

// // //     try {
// // //       const response = await fetch("http://localhost:5000/api/vote/create", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({
// // //           userId: userId,
// // //           text: newProblemText
// // //         }),
// // //       });

// // //       if (!response.ok) {
// // //         const error = await response.json();
// // //         throw new Error(error.error || "Failed to create vote option");
// // //       }

// // //       const data = await response.json();
// // //       setProblems(data.problems);
// // //       setNewProblemText("");
// // //       setShowCreateForm(false);
// // //       alert("✅ Vote option created successfully!");
// // //     } catch (error) {
// // //       console.error("Vote creation failed:", error);
// // //       alert(`❌ ${error.message}`);
// // //     }
// // //   };

// // //   const topProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

// // //   return (
// // //     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
// // //       <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

// // //       {userRole === "Expert" && (
// // //         <div className="w-full max-w-2xl mb-4">
// // //           <button
// // //             onClick={() => setShowCreateForm(!showCreateForm)}
// // //             className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
// // //           >
// // //             {showCreateForm ? "Cancel" : "Create New Vote Option ➕"}
// // //           </button>

// // //           {showCreateForm && (
// // //             <div className="bg-white p-4 rounded-xl shadow-md mt-3">
// // //               <h3 className="text-lg font-semibold mb-2 text-gray-700">Create New Voting Option</h3>
// // //               <input
// // //                 type="text"
// // //                 value={newProblemText}
// // //                 onChange={(e) => setNewProblemText(e.target.value)}
// // //                 placeholder="Enter problem description..."
// // //                 className="w-full border border-gray-300 rounded-lg p-2 mb-2"
// // //               />
// // //               <button
// // //                 onClick={handleCreateVote}
// // //                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
// // //               >
// // //                 Create Vote Option
// // //               </button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
// // //         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
// // //           Choose the issue you feel is most important:
// // //         </h2>
// // //         {topProblems.length > 0 ? (
// // //           topProblems.map((problem) => (
// // //             <div
// // //               key={problem.problemId}
// // //               onClick={() => handleSelect(problem.problemId)}
// // //               className={`cursor-pointer border rounded-xl p-4 mb-3 flex justify-between items-center transition
// // //                 ${selectedOption === problem.problemId ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-100"}
// // //                 ${hasVoted ? "pointer-events-none opacity-70" : ""}`}
// // //             >
// // //               <p className="text-gray-800 font-medium">{problem.text}</p>
// // //               <span className="text-gray-600 font-semibold">{problem.upvotes}</span>
// // //             </div>
// // //           ))
// // //         ) : (
// // //           <p className="text-center text-gray-500">No voting options available yet.</p>
// // //         )}
// // //         <button
// // //           onClick={handleDone}
// // //           disabled={hasVoted || topProblems.length === 0}
// // //           className={`mt-4 w-full py-2 rounded-lg font-semibold ${
// // //             hasVoted || topProblems.length === 0
// // //               ? "bg-gray-400 cursor-not-allowed"
// // //               : "bg-blue-600 hover:bg-blue-700"
// // //           } text-white`}
// // //         >
// // //           Done ✅
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Vote;










// // // import React, { useState, useEffect } from "react";

// // import React, { useState, useEffect } from "react";

// // const Vote = () => {
// //   const [problems, setProblems] = useState([]);
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [hasVoted, setHasVoted] = useState(false);

// //   // Fetch problems from backend
// //   useEffect(() => {
// //     const fetchProblems = async () => {
// //       try {
// //         const response = await fetch("http://localhost:5000/api/problems");
// //         const data = await response.json();
// //         setProblems(data);
// //       } catch (error) {
// //         console.error("Failed to fetch problems:", error);
// //       }
// //     };

// //     fetchProblems();
// //   }, []);

// //   const handleSelect = (id) => {
// //     if (!hasVoted) {
// //       setSelectedOption(id);
// //     }
// //   };

// //   const handleDone = async () => {
// //     if (selectedOption === null) {
// //       alert("❌ Please select an option first!");
// //       return;
// //     }

// //     try {
// //       const response = await fetch("http://localhost:5000/api/vote", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ voteId: selectedOption }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to submit vote");
// //       }

// //       const updated = await response.json();
// //       setProblems(updated); // assuming backend returns updated list
// //       setHasVoted(true);
// //       alert("✅ Your vote has been submitted!");
// //     } catch (error) {
// //       console.error("Vote submission failed:", error);
// //       alert("❌ Failed to submit vote. Please try again.");
// //     }
// //   };

// //   const topProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
// //       <h1 className="text-4xl font-bold text-blue-700 mb-6">Voting Page 🗳️</h1>

// //       <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
// //         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
// //           Choose the issue you feel is most important:
// //         </h2>

// //         {topProblems.map((problem) => (
// //           <div
// //             key={problem.id}
// //             onClick={() => handleSelect(problem.id)}
// //             className={`cursor-pointer border rounded-xl p-4 mb-3 flex justify-between items-center transition
// //               ${selectedOption === problem.id ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-100"}
// //               ${hasVoted ? "pointer-events-none opacity-70" : ""}`}
// //           >
// //             <p className="text-gray-800 font-medium">{problem.text}</p>
// //             <span className="text-gray-600 font-semibold">{problem.upvotes}</span>
// //           </div>
// //         ))}

// //         <button
// //           onClick={handleDone}
// //           className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
// //         >
// //           Done ✅
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Vote;
