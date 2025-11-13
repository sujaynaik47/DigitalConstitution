import React, { useState, useEffect } from "react";

const Vote = () => {
  const [polls, setPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);
  const [newPollEndTime, setNewPollEndTime] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState({});

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

        // Map user votes with timestamp
        const votesMap = {};
        data.userVotes.forEach(vote => {
          votesMap[vote.pollId] = {
            optionId: vote.optionId,
            votedAt: vote.votedAt
          };
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

    // Find the selected option text for confirmation
    const poll = polls.find(p => p.pollId === pollId);
    const selectedOption = poll?.options.find(opt => opt.optionId === selectedOptionId);
    
    // Confirmation dialog
    const confirmed = window.confirm(
      `You are choosing: "${selectedOption?.text}"\n\n⚠️ This action cannot be undone. Do you want to proceed?`
    );
    
    if (!confirmed) {
      return;
    }

    setLoading(prev => ({ ...prev, [pollId]: true }));

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit vote");
      }
      
      // Update the specific poll in the polls array
      setPolls(prevPolls => 
        prevPolls.map(p => 
          p.pollId === pollId ? data.poll : p
        )
      );

      // Mark this poll as voted with timestamp
      setUserVotes(prev => ({
        ...prev,
        [pollId]: {
          optionId: selectedOptionId,
          votedAt: data.votedAt
        }
      }));

      // Clear the selected option for this poll
      setSelectedOptions(prev => {
        const updated = { ...prev };
        delete updated[pollId];
        return updated;
      });

      alert(`✅ Your vote for "${selectedOption?.text}" has been submitted successfully!`);
    } catch (error) {
      console.error("Vote submission error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [pollId]: false }));
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
          options: validOptions.map(text => ({ text })),
          endTime: newPollEndTime || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create poll");
      }

      setPolls(data.polls);
      setNewPollQuestion("");
      setNewPollOptions(["", ""]);
      setNewPollEndTime("");
      setShowCreateForm(false);
      alert("✅ Poll created successfully!");
    } catch (error) {
      console.error("Poll creation failed:", error);
      alert(`❌ ${error.message}`);
    }
  };

  const isPollEnded = (endTime) => {
    if (!endTime) return false;
    return new Date() > new Date(endTime);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  End Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newPollEndTime}
                  onChange={(e) => setNewPollEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty for no end time
                </p>
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
            const selectedOption = selectedOptions[poll.pollId] || userVotes[poll.pollId]?.optionId;
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const isLoading = loading[poll.pollId];
            const pollEnded = isPollEnded(poll.endTime);

            return (
              <div 
                key={poll.pollId} 
                className={`p-6 rounded-2xl shadow-lg ${
                  pollEnded ? 'bg-gray-200 border-4 border-red-400' : 'bg-white'
                }`}
              >
                {pollEnded && (
                  <div className="bg-red-500 text-white text-center py-2 px-4 rounded-lg mb-4 font-bold">
                    🔒 VOTING CLOSED
                  </div>
                )}

                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  {poll.question}
                </h2>

                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Created:</span> {formatDateTime(poll.createdAt)}
                  </p>
                  {poll.endTime && (
                    <p className={`text-sm font-medium ${
                      pollEnded ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      <span className="font-semibold">{pollEnded ? '🔒 Ended:' : '⏰ Ends:'}</span> {formatDateTime(poll.endTime)}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                    const isSelected = selectedOption === option.optionId;

                    return (
                      <div
                        key={option.optionId}
                        onClick={() => !pollEnded && handleSelectOption(poll.pollId, option.optionId)}
                        className={`border rounded-xl p-4 transition relative overflow-hidden
                          ${isSelected ? "border-green-600 bg-green-50" : "border-gray-300"}
                          ${pollEnded ? "opacity-60 cursor-not-allowed" : hasVoted ? "pointer-events-none opacity-80" : "cursor-pointer hover:bg-gray-50"}`}
                      >
                        {hasVoted && (
                          <div
                            className="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        
                        <div className="relative flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-800 font-medium">{option.text}</p>
                            {hasVoted && userVotes[poll.pollId]?.optionId === option.optionId && (
                              <span className="text-green-600 font-bold">✓ Your Vote</span>
                            )}
                          </div>
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

                {!hasVoted && !pollEnded && (
                  <button
                    onClick={() => handleSubmitVote(poll.pollId)}
                    disabled={isLoading || !selectedOptions[poll.pollId]}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isLoading || !selectedOptions[poll.pollId]
                        ? "bg-gray-400 cursor-not-allowed text-gray-600"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isLoading ? "Submitting..." : !selectedOptions[poll.pollId] ? "Select an option to vote" : "Submit Vote ✅"}
                  </button>
                )}

                {hasVoted && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4">
                    <div className="text-center text-green-700 font-semibold mb-2">
                      ✓ You have already voted on this poll
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      Voted on: {formatDateTime(userVotes[poll.pollId]?.votedAt)}
                    </div>
                  </div>
                )}

                {pollEnded && !hasVoted && (
                  <div className="text-center bg-red-50 text-red-700 font-semibold py-3 rounded-lg border-2 border-red-200">
                    🔒 This poll has ended
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