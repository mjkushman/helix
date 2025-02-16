import type { Route } from "./+types/home";

import SequenceStep from "~/components/SequenceStep";
import { ChatInput } from "~/components/ChatInput";
import { ChatMessage } from "~/components/ChatMessage";
import { useEffect, useState } from "react";
import socket from "~/utils/socket";

type Message = {
  content: string;
  author: "agent" | "user";
};

type Step = {
  description: string;
  id: number;
};
type Sequence = {
  id: number;
  steps: Step[];
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your AI Outreach Companion | Helix" },
    { name: "description", content: "Welcome to Helix!" },
  ];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sequence, setSequence] = useState<Sequence | null>(initialSequence);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onMesssage(data: Message) {
      console.log("received message", data);

      setMessages((prev) => [...prev, data]);
    }

    function onConnect() {
      setIsConnected(true);
      console.log("connected");
    }
    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnected");
    }

    function onServerMessage(data: Message) {
      console.log("received server message", data);
      setMessages((prev) => [...prev, data]);
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

  const sendMessage = (content: string) => {
    let message = { content: content, author: "user" };
    socket.emit("message", { message, sequence });
  };

  function sendSequence() {
    socket.emit("sequence", sequence);
  }

  // update the description of a step
  function onSave(newDescription: string) {
    console.log(newDescription);
    // setSequence((prev) => {});
  }

  return (
    <div className="flex flex-row h-screen w-screen ">
      <div className="flex flex-col max-w-1/3 h-screen">
        <div className="m-2 rounded-lg border p-1 flex-1 flex flex-col">
          {isConnected ? <h1>CHAT</h1> : <div>CONNECTING</div>}
          <div className="overflow-y-auto flex-1 bg-green-200 flex flex-col">
            {messages &&
              messages.map((m, index) => (
                <ChatMessage
                  key={index}
                  content={m.content}
                  author={m.author}
                />
              ))}
          </div>
          <div className="relative mt-auto">
            <ChatInput onSendMessage={(message) => sendMessage(message)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-screen">
        <div className="m-2 rounded-lg border p-1 flex-1 flex flex-col">
          <h1>WORKSPACE</h1>
          <h1 className="mt-4">Your Secquence</h1>
          <div>
            {sequence &&
              sequence.steps.map((step) => (
                <SequenceStep
                  key={step.id}
                  description={step.description}
                  id={step.id}
                  onSave={onSave}
                />
              ))}
            {/*  steps displayed here */}
          </div>
        </div>
      </div>
    </div>
  );
}

const initialSequence: Sequence = {
  id: 1,
  steps: [
    { id: 1, description: "Step 1 description" },
    { id: 2, description: "Step 2 description" },
    { id: 3, description: "Step 3 description" },
  ],
};
