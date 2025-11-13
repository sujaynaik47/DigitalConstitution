const mongoose = require("mongoose");

const userVoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pollId: { type: Number, required: true }, // FIXED: Changed from problemId
  optionId: { type: Number, required: true },
  votedAt: { type: Date, default: Date.now } // NEW: Timestamp of vote
});

// FIXED: Compound unique index - user can vote once per poll
userVoteSchema.index({ userId: 1, pollId: 1 }, { unique: true });

module.exports = mongoose.model("UserVote", userVoteSchema);