// Backend code for ticket approval with XP rewards
// Add this to your ticket routes file

// Modified ticket approval route that awards XP
router.patch("/approve/:ticketId", isAuthenticated, async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    // Only admins can approve tickets
    if (!req.payload.admin) {
      return res.status(403).json({ message: "Only admins can approve tickets" });
    }

    const ticket = await Ticket.findById(ticketId).populate('userId');
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Apply the changes to the Spaeti
    const spaeti = await Spaeti.findById(ticket.spaetiId);
    if (!spaeti) {
      return res.status(404).json({ message: "Spaeti not found" });
    }

    // Apply changes from ticket to spaeti
    const changes = JSON.parse(ticket.changes);
    Object.keys(changes).forEach(key => {
      if (changes[key] !== undefined && changes[key] !== null) {
        spaeti[key] = changes[key];
      }
    });

    // Handle image update if provided
    if (ticket.image) {
      spaeti.image = ticket.image;
    }

    await spaeti.save();

    // Award XP to the user who submitted the change request
    const user = ticket.userId;
    if (user) {
      // Initialize XP if it doesn't exist
      if (user.xp === undefined || user.xp === null) {
        user.xp = 0;
      }
      
      // Award XP for approved update
      user.xp += 30; // XP_REWARDS.UPDATE_SPAETI equivalent
      await user.save();
    }

    // Mark ticket as approved and processed
    ticket.approved = true;
    ticket.processed = true;
    await ticket.save();

    res.status(200).json({
      message: "Ticket approved successfully and XP awarded",
      data: {
        ticket: ticket,
        spaeti: spaeti,
        xpAwarded: 30,
        user: user ? { _id: user._id, username: user.username, newXP: user.xp } : null
      }
    });

  } catch (error) {
    console.error("Error approving ticket:", error);
    res.status(500).json({ message: "Server error approving ticket" });
  }
});

// Modified Spaeti approval route that awards XP
router.patch("/spaetis/approve/:spaetiId", isAuthenticated, async (req, res) => {
  try {
    const { spaetiId } = req.params;
    
    // Only admins can approve Spaetis
    if (!req.payload.admin) {
      return res.status(403).json({ message: "Only admins can approve Spaetis" });
    }

    const spaeti = await Spaeti.findById(spaetiId).populate('creator');
    if (!spaeti) {
      return res.status(404).json({ message: "Spaeti not found" });
    }

    // Mark Spaeti as approved
    spaeti.approved = true;
    await spaeti.save();

    // Award XP to the creator
    const creator = spaeti.creator;
    if (creator) {
      // Initialize XP if it doesn't exist
      if (creator.xp === undefined || creator.xp === null) {
        creator.xp = 0;
      }
      
      // Award XP based on whether the Spaeti has an image
      const xpAmount = spaeti.image ? 50 : 40; // WITH_IMAGE : WITHOUT_IMAGE
      creator.xp += xpAmount;
      await creator.save();
    }

    res.status(200).json({
      message: "Spaeti approved successfully and XP awarded",
      data: {
        spaeti: spaeti,
        xpAwarded: spaeti.image ? 50 : 40,
        creator: creator ? { _id: creator._id, username: creator.username, newXP: creator.xp } : null
      }
    });

  } catch (error) {
    console.error("Error approving Spaeti:", error);
    res.status(500).json({ message: "Server error approving Spaeti" });
  }
});
