const mongoose = require("mongoose");

const userVoteSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // one vote per user
  problemId: { type: Number, required: true }, // which problem the user voted for
});

module.exports = mongoose.model("UserVote", userVoteSchema);
