// Backend code for user XP management
// Add this to your user routes file (usually users.routes.js or similar)

// Route to update user XP
router.patch("/:userId/xp", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const { xpToAdd, reason } = req.body;

    // Verify the requesting user is the same user or an admin
    if (req.payload._id !== userId && !req.payload.admin) {
      return res.status(403).json({ message: "Not authorized to update this user's XP" });
    }

    // Find the user and update XP
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize XP if it doesn't exist
    if (user.xp === undefined || user.xp === null) {
      user.xp = 0;
    }

    // Add XP (ensure it doesn't go below 0)
    user.xp = Math.max(0, user.xp + xpToAdd);

    await user.save();

    res.status(200).json({
      message: "XP updated successfully",
      data: {
        user: user,
        xpAdded: xpToAdd,
        newXP: user.xp,
        reason: reason
      }
    });

  } catch (error) {
    console.error("Error updating user XP:", error);
    res.status(500).json({ message: "Server error updating XP" });
  }
});

// Route to get user's XP and level information
router.get("/:userId/xp", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('xp username');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize XP if it doesn't exist
    if (user.xp === undefined || user.xp === null) {
      user.xp = 0;
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
    res.status(500).json({ message: "Server error fetching XP" });
  }
});
