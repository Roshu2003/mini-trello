require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
// const workspaceRoutes = require("./routes/workspace");
// const boardRoutes = require("./routes/board");

const auth = require("./middleware/auth");
// const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// connect db
connectDB(process.env.MONGO_URI);

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
// app.use("/api/workspaces", workspaceRoutes);
// app.use("/api/boards", boardRoutes);

// health
// app.get("/api/health", (req, res) => res.json({ ok: true }));

// app.use(errorHandler);

// Socket.io: simple room per board
// io.on("connection", (socket) => {
//   console.log("socket connected", socket.id);

//   // join board room: client should emit { boardId }
//   socket.on("joinBoard", ({ boardId }) => {
//     socket.join(`board_${boardId}`);
//     console.log(`${socket.id} joined board_${boardId}`);
//   });

//   socket.on("leaveBoard", ({ boardId }) => {
//     socket.leave(`board_${boardId}`);
//   });

//   socket.on("cardUpdated", ({ boardId, card }) => {
//     // broadcast to other clients
//     socket.to(`board_${boardId}`).emit("cardUpdated", card);
//   });

//   socket.on("cardCreated", ({ boardId, card }) => {
//     socket.to(`board_${boardId}`).emit("cardCreated", card);
//   });

//   // similarly for comments, lists, etc.
// });

// When HTTP handlers make changes you should also emit via io.
// To keep controllers lean, you can import `io` via app.set or a small emitter module.
// Example pattern here: set io on app so controllers can access it if desired:
// app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
