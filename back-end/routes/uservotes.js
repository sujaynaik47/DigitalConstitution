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
    }

    res.json({ polls, userVotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
});


// GET /api/vote/:pollId - Get specific poll details
router.get("/:pollId", async (req, res) => {
  try {
    const pollId = parseInt(req.params.pollId);  // FIXED: added .params
    const poll = await Poll.findOne({ pollId, isActive: true });
    
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    res.json({ poll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch poll" });
  }
});

// // GET /api/vote/:pollId - Get specific poll details
// router.get("/:pollId", async (req, res) => {
//   try {
//     const pollId = parseInt(req.pollId);
//     const poll = await Poll.findOne({ pollId, isActive: true });
    
//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found" });
//     }

//     res.json({ poll });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch poll" });
//   }
// });

// POST /api/vote - Submit a vote
// Body: { userId, pollId, optionId }
router.post("/", async (req, res) => {
  try {
    const { userId, pollId, optionId } = req.body;

    if (!userId || !pollId || !optionId) {
      return res.status(400).json({ error: "userId, pollId, and optionId are required" });
    }

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user already voted on this poll
    const existingVote = await UserVote.findOne({ userId, pollId });
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted on this poll" });
    }

    // Find the poll
    const poll = await Poll.findOne({ pollId, isActive: true });
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Find the option and increment votes
    const option = poll.options.find(opt => opt.optionId === optionId);
    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    option.votes += 1;
    await poll.save();

    // Save user's vote
    const userVote = new UserVote({ userId, pollId, optionId });
    await userVote.save();

    // Return updated poll
    res.json({ poll, message: "Vote submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit vote" });
  }
});

// POST /api/vote/create - Create a new poll (Experts only)
// Body: { userId, question, options: [{ text: "Option 1" }, { text: "Option 2" }] }
router.post("/create", async (req, res) => {
  try {
    const { userId, question, options } = req.body;

    if (!userId || !question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        error: "userId, question, and at least 2 options are required" 
      });
    }

    // Find user and check if they are an Expert
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "Expert") {
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

    // Return all polls
    const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ polls, message: "Poll created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create poll" });
  }
});

// DELETE /api/vote/:pollId - Delete a poll (Experts only, only their own polls)
router.delete("/:pollId", async (req, res) => {
  try {
    const { userId } = req.body;
    const pollId = parseInt(req.params.pollId);

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Find user and check if they are an Expert
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "Expert") {
      return res.status(403).json({ error: "Only Experts can delete polls" });
    }

    // Find poll and verify ownership
    const poll = await Poll.findOne({ pollId });
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    if (poll.createdBy !== userId) {
      return res.status(403).json({ error: "You can only delete your own polls" });
    }

    // Soft delete by setting isActive to false
    poll.isActive = false;
    await poll.save();

    res.json({ message: "Poll deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete poll" });
  }
});

module.exports = router;








// const express = require("express");
// const Vote = require("../models/voteModel");
// const UserVote = require("../models/uservotes");
// const User = require("../models/userModel");

// const router = express.Router();

// // Function to ensure default "Agree" option exists
// async function ensureDefaultVoteOption() {
//   try {
//     const agreeOption = await Vote.findOne({ problemId: 1 });
//     if (!agreeOption) {
//       const defaultVote = new Vote({
//         problemId: 1,
//         text: "Agree",
//         upvotes: 0
//       });
//       await defaultVote.save();
//       console.log("Default 'Agree' voting option created");
//     }
//   } catch (error) {
//     console.error("Error ensuring default vote option:", error);
//   }
// }

// // Call this when server starts or when this route is first accessed
// ensureDefaultVoteOption();

// // GET /api/vote?userId=...
// // Returns all problems + user's previous vote (if any)
// router.get("/", async (req, res) => {
//   try {
//     // Ensure default option exists
//     await ensureDefaultVoteOption();
    
//     const userId = req.query.userId;
//     const problems = await Vote.find({}).sort({ upvotes: -1 });

//     let userVote = null;
//     if (userId) {
//       const vote = await UserVote.findOne({ userId });
//       if (vote) userVote = vote.problemId;
//     }

//     res.json({ problems, userVote });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch votes" });
//   }
// });

// // POST /api/vote
// // Body: { userId, voteId }
// // All users (Expert and Citizen) can vote
// router.post("/", async (req, res) => {
//   try {
//     const { userId, voteId } = req.body;

//     if (!userId || !voteId) {
//       return res.status(400).json({ error: "userId and voteId are required" });
//     }

//     // Check if user exists
//     const user = await User.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if user already voted
//     const existingVote = await UserVote.findOne({ userId });
//     if (existingVote) {
//       return res.status(400).json({ error: "You have already voted" });
//     }

//     // Increment the vote count for the selected option
//     const problem = await Vote.findOne({ problemId: voteId });
//     if (!problem) return res.status(404).json({ error: "Vote option not found" });

//     problem.upvotes += 1;
//     await problem.save();

//     // Save user's vote
//     const userVote = new UserVote({ userId, problemId: voteId });
//     await userVote.save();

//     // Return updated problems
//     const problems = await Vote.find({}).sort({ upvotes: -1 });
//     res.json({ problems });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to submit vote" });
//   }
// });

// // POST /api/vote/create
// // Body: { userId, text }
// // Only Experts can create new voting options
// router.post("/create", async (req, res) => {
//   try {
//     const { userId, text } = req.body;

//     if (!userId || !text) {
//       return res.status(400).json({ error: "userId and text are required" });
//     }

//     // Find user and check if they are an Expert
//     const user = await User.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if user role is "Expert" (case-sensitive match)
//     if (user.role !== "Expert") {
//       return res.status(403).json({ error: "Only Experts can create new voting options" });
//     }

//     // Find the highest problemId and increment it
//     const lastProblem = await Vote.findOne().sort({ problemId: -1 });
//     const newProblemId = lastProblem ? lastProblem.problemId + 1 : 1;

//     // Create new vote option
//     const newVote = new Vote({
//       problemId: newProblemId,
//       text: text,
//       upvotes: 0
//     });

//     await newVote.save();

//     // Return updated problems
//     const problems = await Vote.find({}).sort({ upvotes: -1 });
//     res.json({ problems, message: "Vote option created successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create vote option" });
//   }
// });

// module.exports = router;








// // const express = require("express");
// // const Vote = require("../models/voteModel");
// // const UserVote = require("../models/uservotes");
// // const User = require("../models/userModel");

// // const router = express.Router();

// // // GET /api/vote?userId=...
// // // Returns all problems + user's previous vote (if any)
// // router.get("/", async (req, res) => {
// //   try {
// //     const userId = req.query.userId;
// //     const problems = await Vote.find({}).sort({ upvotes: -1 });

// //     let userVote = null;
// //     if (userId) {
// //       const vote = await UserVote.findOne({ userId });
// //       if (vote) userVote = vote.problemId;
// //     }

// //     res.json({ problems, userVote });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to fetch votes" });
// //   }
// // });

// // // POST /api/vote
// // // Body: { userId, voteId }
// // // All users (Expert and Citizen) can vote
// // router.post("/", async (req, res) => {
// //   try {
// //     const { userId, voteId } = req.body;

// //     if (!userId || !voteId) {
// //       return res.status(400).json({ error: "userId and voteId are required" });
// //     }

// //     // Check if user exists
// //     const user = await User.findOne({ userId });
// //     if (!user) {
// //       return res.status(404).json({ error: "User not found" });
// //     }

// //     // Check if user already voted
// //     const existingVote = await UserVote.findOne({ userId });
// //     if (existingVote) {
// //       return res.status(400).json({ error: "You have already voted" });
// //     }

// //     // Increment the vote count for the selected option
// //     const problem = await Vote.findOne({ problemId: voteId });
// //     if (!problem) return res.status(404).json({ error: "Vote option not found" });

// //     problem.upvotes += 1;
// //     await problem.save();

// //     // Save user's vote
// //     const userVote = new UserVote({ userId, problemId: voteId });
// //     await userVote.save();

// //     // Return updated problems
// //     const problems = await Vote.find({}).sort({ upvotes: -1 });
// //     res.json({ problems });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to submit vote" });
// //   }
// // });

// // // POST /api/vote/create
// // // Body: { userId, text }
// // // Only Experts can create new voting options
// // router.post("/create", async (req, res) => {
// //   try {
// //     const { userId, text } = req.body;

// //     if (!userId || !text) {
// //       return res.status(400).json({ error: "userId and text are required" });
// //     }

// //     // Find user and check if they are an Expert
// //     const user = await User.findOne({ userId });
// //     if (!user) {
// //       return res.status(404).json({ error: "User not found" });
// //     }

// //     // Check if user role is "Expert" (case-sensitive match)
// //     if (user.role !== "Expert") {
// //       return res.status(403).json({ error: "Only Experts can create new voting options" });
// //     }

// //     // Find the highest problemId and increment it
// //     const lastProblem = await Vote.findOne().sort({ problemId: -1 });
// //     const newProblemId = lastProblem ? lastProblem.problemId + 1 : 1;

// //     // Create new vote option
// //     const newVote = new Vote({
// //       problemId: newProblemId,
// //       text: text,
// //       upvotes: 0
// //     });

// //     await newVote.save();

// //     // Return updated problems
// //     const problems = await Vote.find({}).sort({ upvotes: -1 });
// //     res.json({ problems, message: "Vote option created successfully" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to create vote option" });
// //   }
// // });

// // module.exports = router;







// // // const express = require("express");
// // // const Vote = require("../models/voteModel");
// // // const UserVote = require("../models/uservotes");
// // // const User = require("../models/userModel");

// // // const router = express.Router();

// // // // GET /api/vote?userId=...
// // // // Returns all problems + user's previous vote (if any)
// // // router.get("/", async (req, res) => {
// // //   try {
// // //     const userId = req.query.userId;
// // //     const problems = await Vote.find({}).sort({ upvotes: -1 });

// // //     let userVote = null;
// // //     if (userId) {
// // //       const vote = await UserVote.findOne({ userId });
// // //       if (vote) userVote = vote.problemId;
// // //     }

// // //     res.json({ problems, userVote });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: "Failed to fetch votes" });
// // //   }
// // // });

// // // // POST /api/vote
// // // // Body: { userId, voteId }
// // // router.post("/", async (req, res) => {
// // //   try {
// // //     const { userId, voteId } = req.body;

// // //     if (!userId || !voteId) {
// // //       return res.status(400).json({ error: "userId and voteId are required" });
// // //     }

// // //     // Check if user already voted
// // //     const existingVote = await UserVote.findOne({ userId });
// // //     if (existingVote) {
// // //       return res.status(400).json({ error: "You have already voted" });
// // //     }

// // //     // Increment the vote count for the selected option
// // //     const problem = await Vote.findOne({ problemId: voteId });
// // //     if (!problem) return res.status(404).json({ error: "Vote option not found" });

// // //     problem.upvotes += 1;
// // //     await problem.save();

// // //     // Save user's vote
// // //     const userVote = new UserVote({ userId, problemId: voteId });
// // //     await userVote.save();

// // //     // Return updated problems
// // //     const problems = await Vote.find({}).sort({ upvotes: -1 });
// // //     res.json({ problems });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: "Failed to submit vote" });
// // //   }
// // // });

// // // // POST /api/vote/create
// // // // Body: { userId, text }
// // // // Only experts can create new voting options
// // // router.post("/create", async (req, res) => {
// // //   try {
// // //     const { userId, text } = req.body;

// // //     if (!userId || !text) {
// // //       return res.status(400).json({ error: "userId and text are required" });
// // //     }

// // //     // Find user and check if they are an expert
// // //     const user = await User.findOne({ userId });
// // //     if (!user) {
// // //       return res.status(404).json({ error: "User not found" });
// // //     }

// // //     if (user.role !== "expert") {
// // //       return res.status(403).json({ error: "Only experts can create new voting options" });
// // //     }

// // //     // Find the highest problemId and increment it
// // //     const lastProblem = await Vote.findOne().sort({ problemId: -1 });
// // //     const newProblemId = lastProblem ? lastProblem.problemId + 1 : 1;

// // //     // Create new vote option
// // //     const newVote = new Vote({
// // //       problemId: newProblemId,
// // //       text: text,
// // //       upvotes: 0
// // //     });

// // //     await newVote.save();

// // //     // Return updated problems
// // //     const problems = await Vote.find({}).sort({ upvotes: -1 });
// // //     res.json({ problems, message: "Vote option created successfully" });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: "Failed to create vote option" });
// // //   }
// // // });

// // // module.exports = 
// // // router;






// const express = require("express");
// const Vote = require("../models/voteModel");
// const UserVote = require("../models/uservotes");

// const router = express.Router();

// // GET /api/vote?userId=...
// // Returns all problems + user's previous vote (if any)
// router.get("/", async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const problems = await Vote.find({}).sort({ upvotes: -1 });

//     let userVote = null;
//     if (userId) {
//       const vote = await UserVote.findOne({ userId });
//       if (vote) userVote = vote.problemId;
//     }

//     res.json({ problems, userVote });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch votes" });
//   }
// });

// // POST /api/vote
// // Body: { userId, voteId }
// router.post("/", async (req, res) => {
//   try {
//     const { userId, voteId } = req.body;

//     if (!userId || !voteId) {
//       return res.status(400).json({ error: "userId and voteId are required" });
//     }

//     // Check if user already voted
//     const existingVote = await UserVote.findOne({ userId });
//     if (existingVote) {
//       return res.status(400).json({ error: "You have already voted" });
//     }

//     // Increment the vote count for the selected option
//     const problem = await Vote.findOne({ problemId: voteId });
//     if (!problem) return res.status(404).json({ error: "Vote option not found" });

//     problem.upvotes += 1;
//     await problem.save();

//     // Save user's vote
//     const userVote = new UserVote({ userId, problemId: voteId });
//     await userVote.save();

//     // Return updated problems
//     const problems = await Vote.find({}).sort({ upvotes: -1 });
//     res.json({ problems });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to submit vote" });
//   }
// });

// module.exports = router;
