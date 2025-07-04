// Backend Approval Routes with XP Rewards for Express.js
// Add these modifications to your existing spaetis.routes.js and tickets.routes.js

const express = require('express');
const router = express.Router();
const Spaeti = require('../models/Spaeti.model'); // Adjust path to your Spaeti model
const Ticket = require('../models/Ticket.model'); // Adjust path to your Ticket model
const User = require('../models/User.model'); // Adjust path to your User model
const { isAuthenticated } = require('../middleware/jwt.middleware'); // Adjust path

// XP reward amounts (should match frontend values)
const XP_REWARDS = {
  CREATE_SPAETI_WITH_IMAGE: 50,
  CREATE_SPAETI_WITHOUT_IMAGE: 40,
  UPDATE_SPAETI: 30,
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

// Modified Späti approval route that awards XP
router.patch("/approve/:spaetiId", isAuthenticated, async (req, res) => {
  try {
    const { spaetiId } = req.params;
    
    // Only admins can approve Spätis
    if (!req.payload.admin) {
      return res.status(403).json({ 
        message: "Only admins can approve Spätis" 
      });
    }

    const spaeti = await Spaeti.findById(spaetiId).populate('creator');
    if (!spaeti) {
      return res.status(404).json({ 
        message: "Späti not found" 
      });
    }

    // Check if already approved
    if (spaeti.approved) {
      return res.status(400).json({ 
        message: "Späti is already approved" 
      });
    }

    // Mark Späti as approved
    spaeti.approved = true;
    await spaeti.save();

    let xpResult = null;
    
    // Award XP to the creator if they exist
    if (spaeti.creator) {
      // Award XP based on whether the Späti has an image
      const xpAmount = spaeti.image ? 
        XP_REWARDS.CREATE_SPAETI_WITH_IMAGE : 
        XP_REWARDS.CREATE_SPAETI_WITHOUT_IMAGE;
      
      const reason = spaeti.image ? 
        "Späti with image approved" : 
        "Späti without image approved";

      xpResult = await awardXPToUser(spaeti.creator._id, xpAmount, reason);
    }

    res.status(200).json({
      message: "Späti approved successfully" + (xpResult ? " and XP awarded" : ""),
      data: {
        spaeti: spaeti,
        xpAwarded: xpResult ? xpResult.xpAwarded : 0,
        creator: xpResult ? { 
          _id: xpResult.user._id, 
          username: xpResult.user.username, 
          newXP: xpResult.user.xp 
        } : null
      }
    });

  } catch (error) {
    console.error("Error approving Späti:", error);
    res.status(500).json({ 
      message: "Server error approving Späti",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Modified ticket approval route that awards XP
router.post("/tickets/:ticketId/approve", isAuthenticated, async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    // Only admins can approve tickets
    if (!req.payload.admin) {
      return res.status(403).json({ 
        message: "Only admins can approve tickets" 
      });
    }

    const ticket = await Ticket.findById(ticketId).populate('userId');
    if (!ticket) {
      return res.status(404).json({ 
        message: "Ticket not found" 
      });
    }

    // Check if already processed
    if (ticket.processed) {
      return res.status(400).json({ 
        message: "Ticket has already been processed" 
      });
    }

    // Apply the changes to the Späti
    const spaeti = await Spaeti.findById(ticket.spaetiId);
    if (!spaeti) {
      return res.status(404).json({ 
        message: "Späti not found" 
      });
    }

    // Parse and apply changes from ticket to spaeti
    let changes;
    try {
      changes = typeof ticket.changes === 'string' ? 
        JSON.parse(ticket.changes) : 
        ticket.changes;
    } catch (parseError) {
      return res.status(400).json({ 
        message: "Invalid changes format in ticket" 
      });
    }

    // Apply changes to spaeti
    Object.keys(changes).forEach(key => {
      if (changes[key] !== undefined && changes[key] !== null) {
        // Handle special field mappings if needed
        if (key === 'proposedSterni') {
          spaeti.sternAvg = changes[key];
        } else {
          spaeti[key] = changes[key];
        }
      }
    });

    // Handle image update if provided
    if (ticket.image) {
      spaeti.image = ticket.image;
    }

    await spaeti.save();

    let xpResult = null;

    // Award XP to the user who submitted the change request
    if (ticket.userId) {
      xpResult = await awardXPToUser(
        ticket.userId._id, 
        XP_REWARDS.UPDATE_SPAETI, 
        "Change request approved"
      );
    }

    // Mark ticket as approved and processed
    ticket.approved = true;
    ticket.processed = true;
    ticket.processedAt = new Date();
    await ticket.save();

    res.status(200).json({
      message: "Ticket approved successfully" + (xpResult ? " and XP awarded" : ""),
      data: {
        ticket: ticket,
        spaeti: spaeti,
        xpAwarded: xpResult ? xpResult.xpAwarded : 0,
        user: xpResult ? { 
          _id: xpResult.user._id, 
          username: xpResult.user.username, 
          newXP: xpResult.user.xp 
        } : null
      }
    });

  } catch (error) {
    console.error("Error approving ticket:", error);
    res.status(500).json({ 
      message: "Server error approving ticket",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Modified rating creation route that awards XP immediately
router.post("/ratings", isAuthenticated, async (req, res) => {
  try {
    const { stars, comment, spaeti: spaetiId } = req.body;
    const userId = req.payload._id;

    // Validate required fields
    if (!stars || !spaetiId) {
      return res.status(400).json({ 
        message: "Stars and spaeti ID are required" 
      });
    }

    // Check if Späti exists
    const spaeti = await Spaeti.findById(spaetiId);
    if (!spaeti) {
      return res.status(404).json({ 
        message: "Späti not found" 
      });
    }

    // Create the rating
    const Rating = require('../models/Rating.model'); // Adjust path
    const newRating = new Rating({
      user: userId,
      stars: parseInt(stars),
      comment: comment?.trim() || "",
      spaeti: spaetiId,
      date: new Date()
    });

    await newRating.save();

    // Add rating to spaeti's rating array
    spaeti.rating.push(newRating._id);
    await spaeti.save();

    // Award XP immediately for creating a rating
    const xpResult = await awardXPToUser(
      userId, 
      XP_REWARDS.CREATE_RATING, 
      "Created a rating"
    );

    res.status(201).json({
      message: "Rating created successfully" + (xpResult ? " and XP awarded" : ""),
      data: {
        rating: newRating,
        xpAwarded: xpResult ? xpResult.xpAwarded : 0,
        user: xpResult ? { 
          _id: xpResult.user._id, 
          username: xpResult.user.username, 
          newXP: xpResult.user.xp 
        } : null
      }
    });

  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ 
      message: "Server error creating rating",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
