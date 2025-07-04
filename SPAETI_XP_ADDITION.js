// ADDITIONAL ROUTES FOR SPAETI APPROVAL WITH XP
// Add these to your spaetis.routes.js file

const User = require("../models/User.model"); // Add this import if not already present

// XP reward amounts
const XP_REWARDS = {
  CREATE_SPAETI_WITH_IMAGE: 50,
  CREATE_SPAETI_WITHOUT_IMAGE: 40,
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

// Modified Späti approval route that awards XP
// REPLACE your existing approval route with this one:
router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSpaeti = await Spaeti.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('creator');

    // If this is an approval (approved field is being set to true), award XP
    if (req.body.approved === true && updatedSpaeti && updatedSpaeti.creator) {
      const xpAmount = updatedSpaeti.image ? 
        XP_REWARDS.CREATE_SPAETI_WITH_IMAGE : 
        XP_REWARDS.CREATE_SPAETI_WITHOUT_IMAGE;
      
      const reason = updatedSpaeti.image ? 
        "Späti with image approved" : 
        "Späti without image approved";

      const xpResult = await awardXPToUser(updatedSpaeti.creator._id, xpAmount, reason);
      
      res.status(200).json({ 
        message: "updated spaeti" + (xpResult ? " and XP awarded" : ""), 
        data: updatedSpaeti,
        xpAwarded: xpResult ? xpResult.xpAwarded : 0,
        creator: xpResult ? { 
          _id: xpResult.user._id, 
          username: xpResult.user.username, 
          newXP: xpResult.user.xp 
        } : null
      });
    } else {
      // Regular update without XP
      res.status(200).json({ message: "updated spaeti", data: updatedSpaeti });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
