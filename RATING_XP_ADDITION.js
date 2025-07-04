// RATING ROUTES WITH XP REWARDS
// Add these to your ratings.routes.js file

const User = require("../models/User.model"); // Add this import if not already present

// XP reward amounts
const XP_REWARDS = {
  CREATE_RATING: 10,
};

// Helper function to award XP to a user
const awardXPToUser = async (userId, xpAmount, reason) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found for XP award: ${userId}`);
      return null;
    }

    // Initialize XP if it doesn't exist
    if (user.xp === undefined || user.xp === null) {
      user.xp = 0;
    }

    user.xp += xpAmount;
    await user.save();

    console.log(`XP awarded: ${xpAmount} to user ${user.username} for: ${reason}`);
    return { user, xpAwarded: xpAmount };
  } catch (error) {
    console.error("Error awarding XP:", error);
    return null;
  }
};

// Modified rating creation route that awards XP immediately
// REPLACE your existing POST route with this one:
router.post("", async (req, res) => {
  try {
    const createRating = await Rating.create(req.body);
    
    // Award XP immediately for creating a rating
    const xpResult = await awardXPToUser(
      req.body.user, 
      XP_REWARDS.CREATE_RATING, 
      "Created a rating"
    );

    res.status(201).json({
      message: "created rating" + (xpResult ? " and XP awarded" : ""),
      data: createRating,
      xpAwarded: xpResult ? xpResult.xpAwarded : 0,
      user: xpResult ? { 
        _id: xpResult.user._id, 
        username: xpResult.user.username, 
        newXP: xpResult.user.xp 
      } : null
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
