// Backend XP Routes for Express.js
// Add these routes to your users.routes.js file or create a separate xp.routes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User.model'); // Adjust path to your User model
const { isAuthenticated } = require('../middleware/jwt.middleware'); // Adjust path to your auth middleware

// Route to update user XP
router.patch("/:userId/xp", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const { xpToAdd, reason } = req.body;

    // Verify the requesting user is the same user or an admin
    if (req.payload._id !== userId && !req.payload.admin) {
      return res.status(403).json({ 
        message: "Not authorized to update this user's XP" 
      });
    }

    // Validate XP amount
    if (typeof xpToAdd !== 'number' || isNaN(xpToAdd)) {
      return res.status(400).json({ 
        message: "Invalid XP amount provided" 
      });
    }

    // Find the user and update XP
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Initialize XP if it doesn't exist
    if (user.xp === undefined || user.xp === null) {
      user.xp = 0;
    }

    // Store previous XP for response
    const previousXP = user.xp;

    // Add XP (ensure it doesn't go below 0)
    user.xp = Math.max(0, user.xp + xpToAdd);

    await user.save();

    console.log(`XP awarded: ${xpToAdd} to user ${user.username} (${userId}) for: ${reason}`);

    res.status(200).json({
      message: "XP updated successfully",
      data: {
        user: {
          _id: user._id,
          username: user.username,
          previousXP: previousXP,
          newXP: user.xp
        },
        xpAdded: xpToAdd,
        reason: reason || "XP award"
      }
    });

  } catch (error) {
    console.error("Error updating user XP:", error);
    res.status(500).json({ 
      message: "Server error updating XP",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route to get user's XP and level information
router.get("/:userId/xp", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('xp username');
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Initialize XP if it doesn't exist
    if (user.xp === undefined || user.xp === null) {
      user.xp = 0;
      await user.save();
    }

    res.status(200).json({
      message: "XP information retrieved successfully",
      data: {
        userId: user._id,
        username: user.username,
        xp: user.xp
      }
    });

  } catch (error) {
    console.error("Error fetching user XP:", error);
    res.status(500).json({ 
      message: "Server error fetching XP",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route to get XP leaderboard (optional feature)
router.get("/leaderboard", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topUsers = await User.find({ xp: { $exists: true, $ne: null } })
      .select('username xp image')
      .sort({ xp: -1 })
      .limit(limit);

    res.status(200).json({
      message: "Leaderboard retrieved successfully",
      data: topUsers
    });

  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ 
      message: "Server error fetching leaderboard",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
