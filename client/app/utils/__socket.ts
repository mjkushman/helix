// import { useLocation } from "react-router";
// import { io, Socket } from "socket.io-client";

// const getThreadId = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   return searchParams.get("thread_id");
// };


// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000"; // Flask is on port 5000

// let socket: Socket;

// const initSocket = () => {
//   const thread_id = getThreadId();
//   socket = io(URL, {
//     query: {
//       thread_id: thread_id || "",
//     },
//   });

//   socket.on("connect", () => {
//     console.log("Connected to the socket");
//     // console.log("sid:", sid);
//   });

//   socket.on("disconnect", () => {
//     console.log("Disconnected from the socket");
//   });
//   // socket.on('session', (thread_id)=>{
//   //   // console.log('thread_id session', thread_id)
//   // })
// };

// export { initSocket, socket };
