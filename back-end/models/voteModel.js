const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  problemId: { type: Number, required: true },
  text: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Vote", voteSchema);
