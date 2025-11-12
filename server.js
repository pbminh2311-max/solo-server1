const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "https://spontaneous-cocada-d3e216.netlify.app",
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("Người chơi kết nối:", socket.id);

  socket.on("move", (data) => {
    socket.broadcast.emit("move", data);
  });

  socket.on("disconnect", () => {
    console.log("Ngắt kết nối:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server chạy tại cổng ${PORT}`));
