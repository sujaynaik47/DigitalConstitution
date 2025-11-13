const express = require("express");
const Poll = require("../models/voteModel");
const UserVote = require("../models/uservotes");
const User = require("../models/userModel");

const router = express.Router();

// Function to ensure default "Agree" poll exists
async function ensureDefaultPoll() {
  try {
    const defaultPoll = await Poll.findOne({ pollId: 1 });
    if (!defaultPoll) {
      const newPoll = new Poll({
        pollId: 1,
        question: "Do you agree with the current policy?",
        options: [
          { optionId: 1, text: "Agree", votes: 0 },
          { optionId: 2, text: "Disagree", votes: 0 }
        ],
        createdBy: "system",
        isActive: true
      });
      await newPoll.save();
      console.log("Default poll created");
    }
  } catch (error) {
    console.error("Error ensuring default poll:", error);
  }
}

// Call this when server starts
ensureDefaultPoll();

// GET /api/vote - Get all active polls
// Query params: userId (optional)
router.get("/", async (req, res) => {
  try {
    await ensureDefaultPoll();
    
    const userId = req.query.userId;
    const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });

    // Get user's votes if userId provided
    let userVotes = [];
    if (userId) {
      const votes = await UserVote.find({ userId });
      userVotes = votes.map(v => ({ pollId: v.pollId, optionId: v.optionId }));
      console.log(`User ${userId} has voted on ${userVotes.length} polls`);
    }

    return res.status(200).json({ polls, userVotes });
  } catch (err) {
    console.error("Error fetching polls:", err);
    return res.status(500).json({ error: "Failed to fetch polls" });
  }
});

// GET /api/vote/:pollId - Get specific poll details
router.get("/:pollId", async (req, res) => {
  try {
    const pollId = parseInt(req.params.pollId);
    const poll = await Poll.findOne({ pollId, isActive: true });
    
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    return res.status(200).json({ poll });
  } catch (err) {
    console.error("Error fetching poll:", err);
    return res.status(500).json({ error: "Failed to fetch poll" });
  }
});

// POST /api/vote - Submit a vote
// Body: { userId, pollId, optionId }
router.post("/", async (req, res) => {
  try {
    const { userId, pollId, optionId } = req.body;

    console.log("=== Vote Submission Request ===");
    console.log("User:", userId, "Poll:", pollId, "Option:", optionId);

    // Validate input
    if (!userId || !pollId || !optionId) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "userId, pollId, and optionId are required" });
    }

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // CRITICAL: Check if user already voted on this poll (FIRST CHECK)
    const existingVote = await UserVote.findOne({ userId, pollId });
    if (existingVote) {
      console.log("❌ User has already voted on this poll");
      console.log("Existing vote:", existingVote);
      return res.status(400).json({ error: "You have already voted on this poll" });
    }

    // Find the poll
    const poll = await Poll.findOne({ pollId, isActive: true });
    if (!poll) {
      console.log("❌ Poll not found:", pollId);
      return res.status(404).json({ error: "Poll not found" });
    }

    // Find the option and increment votes
    const option = poll.options.find(opt => opt.optionId === optionId);
    if (!option) {
      console.log("❌ Option not found:", optionId);
      return res.status(404).json({ error: "Option not found" });
    }

    // DOUBLE CHECK: Verify again that user hasn't voted (race condition protection)
    const doubleCheck = await UserVote.findOne({ userId, pollId });
    if (doubleCheck) {
      console.log("❌ Race condition detected - user already voted");
      return res.status(400).json({ error: "You have already voted on this poll" });
    }

    // Save user's vote FIRST (before incrementing poll votes)
    const userVote = new UserVote({ userId, pollId, optionId });
    await userVote.save();
    console.log("✅ User vote record created");

    // Then increment vote count
    option.votes += 1;
    await poll.save();
    console.log("✅ Poll vote count updated");

    console.log("=== Vote Submitted Successfully ===");
    console.log("Poll:", poll.question);
    console.log("Option:", option.text, "- Total votes:", option.votes);

    // Return updated poll with 200 status
    return res.status(200).json({ 
      poll, 
      message: "Vote submitted successfully" 
    });
  } catch (err) {
    console.error("❌ Error submitting vote:", err);
    return res.status(500).json({ error: "Failed to submit vote" });
  }
});

// POST /api/vote/create - Create a new poll (Experts only)
// Body: { userId, question, options: [{ text: "Option 1" }, { text: "Option 2" }] }
router.post("/create", async (req, res) => {
  try {
    const { userId, question, options } = req.body;

    console.log("=== Poll Creation Request ===");
    console.log("User:", userId, "Options count:", options?.length);

    if (!userId || !question || !options || !Array.isArray(options) || options.length < 2) {
      console.log("❌ Invalid poll creation data");
      return res.status(400).json({ 
        error: "userId, question, and at least 2 options are required" 
      });
    }

    // Find user and check if they are an Expert
    const user = await User.findOne({ userId });
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "Expert") {
      console.log("❌ User is not an Expert:", userId);
      return res.status(403).json({ error: "Only Experts can create polls" });
    }

    // Find the highest pollId and increment it
    const lastPoll = await Poll.findOne().sort({ pollId: -1 });
    const newPollId = lastPoll ? lastPoll.pollId + 1 : 1;

    // Create poll options with optionIds
    const pollOptions = options.map((opt, index) => ({
      optionId: index + 1,
      text: opt.text,
      votes: 0
    }));

    // Create new poll
    const newPoll = new Poll({
      pollId: newPollId,
      question: question,
      options: pollOptions,
      createdBy: userId,
      isActive: true
    });

    await newPoll.save();

    console.log("✅ Poll created successfully");
    console.log("Poll ID:", newPollId, "Question:", question);

    // Return all polls
    const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ 
      polls, 
      message: "Poll created successfully" 
    });
  } catch (err) {
    console.error("❌ Error creating poll:", err);
    return res.status(500).json({ error: "Failed to create poll" });
  }
});

// DELETE /api/vote/:pollId - Delete a poll (Experts only, only their own polls)
router.delete("/:pollId", async (req, res) => {
  try {
    const { userId } = req.body;
    const pollId = parseInt(req.params.pollId);

    console.log("=== Poll Deletion Request ===");
    console.log("User:", userId, "Poll:", pollId);

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Find user and check if they are an Expert
    const user = await User.findOne({ userId });
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "Expert") {
      console.log("❌ User is not an Expert:", userId);
      return res.status(403).json({ error: "Only Experts can delete polls" });
    }

    // Find poll and verify ownership
    const poll = await Poll.findOne({ pollId });
    if (!poll) {
      console.log("❌ Poll not found:", pollId);
      return res.status(404).json({ error: "Poll not found" });
    }

    if (poll.createdBy !== userId) {
      console.log("❌ User doesn't own this poll");
      return res.status(403).json({ error: "You can only delete your own polls" });
    }

    // Soft delete by setting isActive to false
    poll.isActive = false;
    await poll.save();

    console.log("✅ Poll deleted successfully:", pollId);

    return res.status(200).json({ message: "Poll deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting poll:", err);
    return res.status(500).json({ error: "Failed to delete poll" });
  }
});

module.exports = router;