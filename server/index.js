import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Express and WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev simplicity
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Inject socket.io instance into requests so route controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Hospital Appointment System API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO Connections Handler
io.on("connection", (socket) => {
  console.log(`[Socket] A client connected: ${socket.id}`);

  // User joins their specific room (for direct messages and targeted status updates)
  socket.on("join", (roomName) => {
    socket.join(roomName);
    console.log(`[Socket] Client ${socket.id} joined room: ${roomName}`);
  });

  // Handle direct message events
  socket.on("send_message", async (data) => {
    const { senderId, senderName, receiverId, content } = data;

    try {
      // Create and save message
      const Message = mongoose.model("Message");
      const newMessage = new Message({
        senderId,
        senderName,
        receiverId,
        content,
      });

      await newMessage.save();

      // Deliver message to receiver room and sender room
      io.to(receiverId).emit("receive_message", newMessage);
      io.to(senderId).emit("receive_message", newMessage);

      console.log(`[Socket] Chat message sent from ${senderName} to room: ${receiverId}`);
    } catch (error) {
      console.error("[Socket] Message send failed:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Database Connection and Server Boot
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hospital";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("[MongoDB] Connected successfully");
    server.listen(PORT, () => {
      console.log(`[Server] Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[MongoDB] Connection error:", err.message);
    console.log("[Server] Running server in offline mock mode without Database connection.");
    // Still listen even if DB fails, allowing mock/fallback behavior if requested
    server.listen(PORT, () => {
      console.log(`[Server] Listening on port ${PORT} (Offline Mode)`);
    });
  });
