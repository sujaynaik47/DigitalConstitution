const mongoose = require("mongoose");

const pollOptionSchema = new mongoose.Schema({
  optionId: { type: Number, required: true },
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  pollId: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  options: [pollOptionSchema],
  createdBy: { type: String, required: true }, // userId of the expert
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Poll", pollSchema);
 

// const mongoose = require("mongoose");

// const voteSchema = new mongoose.Schema({
//   problemId: { type: Number, required: true },
//   text: { type: String, required: true },
//   upvotes: { type: Number, default: 0 },
// });

// module.exports = mongoose.model("Vote", voteSchema);
