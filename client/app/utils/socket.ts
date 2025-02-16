import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000"; // Flask is on port 5000

  const socket = io(URL);
  
  socket.on("connect", () => {
  console.log("Connected to the socket");
});

socket.on("disconnect", () => {
  console.log("Disconnected from the socket");
});

export default socket;
