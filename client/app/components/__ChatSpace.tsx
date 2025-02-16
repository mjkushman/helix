// import { ChatInput } from "~/components/ChatInput";
// import { ChatMessage } from "~/components/ChatMessage";
// import { useEffect, useState } from "react";
// import socket from "~/utils/socket";

// type Message = {
//   content: string;
//   author: "agent" | "user";
// };

// export function ChatSpace() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isConnected, setIsConnected] = useState(socket.connected);

//   useEffect(() => {
//     function onMesssage(data: Message) {
//       console.log("received message", data);

//       setMessages((prev) => [...prev, data]);
//     }

//     function onConnect() {
//       setIsConnected(true);
//       console.log("connected");
//     }
//     function onDisconnect() {
//       setIsConnected(false);
//       console.log("disconnected");
//     }

//     function onServerMessage(data:Message) {
//       console.log("received server message", data);
//       setMessages((prev) => [...prev, data]);
//     }

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);
//     socket.on("message", onMesssage);
//     socket.on("server_message", onServerMessage);

//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("message");
//       socket.off("server_message");
//     };
//   }, []);

//   const sendMessage = (content: string) => {
//     socket.emit("message", { content: content, author: "user" });
//   };

//   return (
//     <div className="flex flex-col max-w-1/3 h-screen">
//       <div className="m-2 rounded-lg border p-1 flex-1 flex flex-col">
//         {isConnected ? <h1>CHAT</h1> : <div>CONNECTING</div>}
//         <div className="overflow-y-auto flex-1 bg-green-200 flex flex-col">
//           {messages &&
//             messages.map((m, index) => (
//               <ChatMessage
//                 key={index}
//                 content={m.content}
//                 author={m.author}
//               />
//             ))}
//         </div>
//         <div className="relative mt-auto">
//           <ChatInput onSendMessage={(message) => sendMessage(message)} />
//         </div>
//       </div>
//     </div>
//   );
// }
