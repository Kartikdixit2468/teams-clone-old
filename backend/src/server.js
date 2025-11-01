import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import envRouter from "./routes/env.js";
import { initSocketHandlers } from "./socket/handlers.js";
import { config } from "./config/config.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "TeamsClone-RL Backend API",
    version: "1.0.0",
    endpoints: {
      env: "/env/*",
      health: "/health",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// RL Environment API routes
app.use("/env", envRouter);

// Initialize Socket.IO handlers
initSocketHandlers(io);

// Start server
httpServer.listen(config.port, () => {
  console.log(`🚀 TeamsClone-RL Backend running on port ${config.port}`);
  console.log(`📡 Socket.IO enabled`);
  console.log(`🤖 RL Environment API: http://localhost:${config.port}/env`);
});

export { io };
