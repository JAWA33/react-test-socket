const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("received_message", data);
    //console.log(data);
  });
});

server.listen(3001, () => {
  console.log("Server is running ...");
});
