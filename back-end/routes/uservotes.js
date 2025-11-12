const express = require("express");
const Vote = require("../models/voteModel");
const UserVote = require("../models/uservotes");

const router = express.Router();

// GET /api/vote?userId=...
// Returns all problems + user's previous vote (if any)
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const problems = await Vote.find({}).sort({ upvotes: -1 });

    let userVote = null;
    if (userId) {
      const vote = await UserVote.findOne({ userId });
      if (vote) userVote = vote.problemId;
    }

    res.json({ problems, userVote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
});

// POST /api/vote
// Body: { userId, voteId }
router.post("/", async (req, res) => {
  try {
    const { userId, voteId } = req.body;

    if (!userId || !voteId) {
      return res.status(400).json({ error: "userId and voteId are required" });
    }

    // Check if user already voted
    const existingVote = await UserVote.findOne({ userId });
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted" });
    }

    // Increment the vote count for the selected option
    const problem = await Vote.findOne({ problemId: voteId });
    if (!problem) return res.status(404).json({ error: "Vote option not found" });

    problem.upvotes += 1;
    await problem.save();

    // Save user's vote
    const userVote = new UserVote({ userId, problemId: voteId });
    await userVote.save();

    // Return updated problems
    const problems = await Vote.find({}).sort({ upvotes: -1 });
    res.json({ problems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit vote" });
  }
});

module.exports = router;
