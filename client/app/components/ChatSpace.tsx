import { ChatInput } from "~/components/ChatInput";
import { ChatMessage } from "~/components/ChatMessage";
import { useEffect, useState } from "react";
import socket from "~/utils/socket";

export function ChatSpace() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onMesssage(data) {
      setMessages((prev) => [...prev, data.data]);
    }

    function onConnect() {
      setIsConnected(true);
      console.log("connected");
    }
    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnected");
    }

    function onServerMessage(data) {
      setMessages((prev) => [...prev, data.data]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMesssage);
    socket.on("server_message", onServerMessage);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("server_message");
    };
  }, []);

  const sendMessage = (message: string) => {
    socket.emit("message", { data: message });
  };

  return (
    <div className="flex flex-col max-w-1/3 h-screen">
      <div className="m-2 rounded-lg border p-1 flex-1 flex flex-col">
        {isConnected ? <h1>CHAT</h1> : <div>CHAT DISCONNECTED</div>}
        <div className="overflow-y-auto flex-1 bg-green-200 flex flex-col">
          <ChatMessage message="Hello!" sender="user" />
          <ChatMessage message="Hello!" sender="agent" />
          <ChatMessage message="Hello!" sender="user" />
          <ChatMessage message="Hello!" sender="agent" />
        </div>
        <div className="relative mt-auto">
          <ChatInput onSendMessage={(message) => sendMessage(message)} />
        </div>
      </div>
    </div>
  );
}
