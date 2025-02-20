import type { Route } from "./+types/room";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { ChatMessage } from "~/components/ChatMessage";
import { ChatInput } from "~/components/ChatInput";
import SequenceStep from "~/components/SequenceStep";


type Message = {
  content: string;
  role: "assistant" | "user";
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
    { name: "description", content: "Work with your assistant" },
  ];
}

export default function Room({ params }: Route.ComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sequence, setSequence] = useState<Sequence | null>(initialSequence);


  const room = params.room;

  const socketURL =
    process.env.NODE_ENV === "production"
      ? undefined
      : `http://localhost:5000/?room=${room}`;

  // const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [threadId, setThreadId] = useState("");

	const socketio = io(socketURL);
  useEffect(() => {

    socketio.on("connect", () => {
      setIsConnected(true);
      console.log("connected to socket");
    });

    socketio.on("refused", ({ message }: { message: string }) => {
      console.log("message");
    });

    socketio.on("disconnect", () => {
      setIsConnected(false);
      console.log("disconnected from socket");
    });

    socketio.on("message", (data: Message) => {
      console.log("received message", data);
      setMessages((prev) => [...prev, data]);
    });

    // replaces the entire thread
    socketio.on("thread_messages", (data: Message[]) => {
      console.log("received thread");
			console.log(data)
      setMessages(data);
    });
    socketio.on("sequence_update", (data) => {
      console.log("received updated sequence", data);
    });
    socketio.on("server_message", (data: Message) => {
      console.log("received server message", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketio.off("connect");
      socketio.off("refused");
      socketio.off("disconnect");
      socketio.off("message");
      socketio.off("thread_messages");
      socketio.off("server_message");
      socketio.off("sequence_update");
    };
  }, [threadId]);

  const sendMessage = (content: string) => {
    let message = { content: content, author: "user" };
    socketio.emit("message", { message, sequence });
  };

  function sendSequence() {
    socketio.emit("sequence", sequence);
  }

  // update the description of a step
  function onSave(newDescription: string) {
    console.log(newDescription);
  }

  return (
    <div className="flex flex-row h-screen w-screen ">
      <div className="flex flex-col max-w-1/3 h-screen">
        <div className="m-2 rounded-lg border p-1 flex-1 flex flex-col">
          {isConnected ? <h1>CHAT</h1> : <div>CONNECTING</div>}
          <div className="overflow-y-auto flex-1 bg-green-200 flex flex-col">
            {messages &&
              messages.map((m, index) => (
                <ChatMessage key={index} content={m.content} role={m.role} />
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
