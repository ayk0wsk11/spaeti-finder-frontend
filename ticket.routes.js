// routes/ticket.routes.js

const router = require("express").Router();
const Ticket = require("../models/Ticket.model");
const Spaeti = require("../models/Spaeti.model");
const { isAuthenticated, isAdmin } = require("../middleware/jwt.middleware");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ─── Create a new ticket ───────────────────────────────────────────────────────
router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const { spaetiId, changes, userId } = req.body;
    let imageUrl = null;

    // If an image was uploaded, upload it to Cloudinary
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
          } else {
            imageUrl = result.secure_url;
          }
        }
      );
      uploadStream.end(req.file.buffer);

      // Wait for upload to complete
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else {
              imageUrl = result.secure_url;
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });
    }

    // Parse changes if it's a string (from FormData)
    const parsedChanges = typeof changes === 'string' ? JSON.parse(changes) : changes;
    
    // Add image URL to changes if uploaded
    if (imageUrl) {
      parsedChanges.image = imageUrl;
    }

    const ticket = await Ticket.create({
      spaetiId,
      changes: parsedChanges,
      userId,
    });
    
    res.status(201).json({ message: "Ticket created", data: ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── List pending tickets ───────────────────────────────────────────────────────
router.get("/", isAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: "pending" })
      .populate("userId spaetiId")
      .lean();

    tickets.forEach((ticket) => {
      delete ticket.userId.email;
      delete ticket.userId.password;
      delete ticket.userId.admin;
    });

    res.status(200).json({ message: "Pending tickets", data: tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Approve a ticket ──────────────────────────────────────────────────────────
router.post("/:id/approve", isAdmin, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const spaeti = await Spaeti.findById(ticket.spaetiId);
    if (!spaeti) return res.status(404).json({ error: "Späti not found" });

    // 1) Parse the proposedSterni (might come in as a string)
    const raw = ticket.changes.get ? ticket.changes.get("proposedSterni") : ticket.changes.proposedSterni;
    const proposed = raw != null ? parseFloat(raw) : NaN;

    if (!isNaN(proposed)) {
      // ensure history array exists
      spaeti.sterniHistory = spaeti.sterniHistory || [];
      spaeti.sterniHistory.push(proposed);

      // recompute average
      const sum = spaeti.sterniHistory.reduce((a, b) => a + b, 0);
      spaeti.sternAvg = +(sum / spaeti.sterniHistory.length).toFixed(2);
    }

    // 2) Apply any other field changes
    const changes = ticket.changes.toObject ? ticket.changes.toObject() : ticket.changes;
    for (const [key, value] of Object.entries(changes)) {
      if (key === "proposedSterni") continue;
      spaeti[key] = value;
    }

    // 3) Save updated Späti and mark ticket approved
    await spaeti.save();
    ticket.status = "approved";
    await ticket.save();

    res
      .status(200)
      .json({ message: "Ticket approved and Späti updated", data: spaeti });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ─── Reject a ticket ───────────────────────────────────────────────────────────
router.post("/:id/reject", isAdmin, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.status = "rejected";
    const updatedTicket = await ticket.save();
    res.status(200).json({ message: "Ticket rejected", data: updatedTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
