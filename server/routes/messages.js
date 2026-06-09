import express from "express";
import Message from "../models/Message.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get message history between current user and another user/role (e.g. admin or doctor)
router.get("/history/:receiverId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    // Retrieve messages between these two parties
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
        // Fallback for general admin communications
        { senderId: userId, receiverId: "admin" },
        { senderId: "admin", receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
