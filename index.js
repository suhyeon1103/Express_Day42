const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouthes = require("./routes/auth");
const friendRoutes = require("./routes/friends");
const logger = require("./config/logger");
const helmet = require("helmet");
const authenticateSocket = require("./middleware/authenticateSocket");
const Message = require("./models/Message");
const { Socket } = require("dgram");

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use(helmet());
app.use(express.json());

app, use("/auth", authRoutes);
app.use("/friends", friendRoutes);

app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} $req.url`);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Internal Server Error" });
});

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.username}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.user.username} joined room: ${roomId}`);
  });

  socket.on("chatMessage", async ({ roomId, message }) => {
    const msg = await Message.create({
      sender: socket.user.id,
      content: message,
      roomId,
    });
    io.to(roomId).emit("message", {
      sender: socket.user.username,
      content: message,
      timestamp: msg.createdAt,
    });
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
