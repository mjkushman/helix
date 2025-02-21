import type { Route } from "./+types/room";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { ChatMessage } from "~/components/ChatMessage";
import { ChatInput } from "~/components/ChatInput";
import SequenceStep from "~/components/SequenceStep";
import type { Message, Sequence } from "~/types/types";
import createSequence from "~/api/createSequence";
import fetchSequence from "~/api/fetchSequence";
import updateSequence from "~/api/updateSequence";
import fetchThreadMessages from "~/api/fetchThreadMessages";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your AI Outreach Companion | Helix" },
    { name: "description", content: "Work with your assistant" },
  ];
}

export default function Room({ params }: Route.ComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sequence, setSequence] = useState<Sequence | null>(null);

  const room = params.room;

  const socketURL =
    process.env.NODE_ENV === "production"
      ? undefined
      : `http://localhost:5000/?room=${room}`;

  // const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [threadId, setThreadId] = useState("");

  const socketio = io(socketURL, {
    auth: {
      room: room,
    },
  });
  useEffect(() => {
    socketio.on("connect", async () => {
      setIsConnected(true);
      // Check for existing sequence
      console.log("connected to socket");
      console.log("looking for an existing thread");
      fetchThreadMessages(room).then(setMessages);
      console.log("looking for an existing sequence");
      fetchSequence(room).then(setSequence);
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
      setMessages((prev) => [data, ...prev]);
    });

    // replaces the entire thread
    socketio.on("thread_update", (data: Message[]) => {
      console.log("received thread");
      console.log(data);
      setMessages(data);
      fetchSequence(room).then(setSequence);
    });
    socketio.on("sequence_update", ({ sequence }) => {
      console.log("received updated sequence", sequence);
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
      socketio.off("thread_update");
      socketio.off("server_message");
      socketio.off("sequence_update");
    };
  }, [threadId]);

  const sendMessage = (content: string) => {
    let message = { content: content, role: "user" };
    socketio.emit("message", message);
  };

  async function onNewSequence() {
    const sequence = await createSequence(room);
    setSequence(sequence);
  }

  async function onUpdateSequence() {
    const updatedSequence = await updateSequence(sequence);
    updateSequence(sequence).then(setSequence);
    setSequence(updatedSequence);
  }

  // Updates a step without saving it
  function onStepChange(stepNumber: number, message: string) {
    setSequence((prev) => ({
      ...prev!,
      steps: prev!.steps.map((step) =>
        step.stepNumber === stepNumber ? { ...step, message } : step
      ),
    }));
  }

  // Add a step to sequence
  function onAddStep() {
    setSequence((prev) => ({
      ...prev!,
      steps: [
        ...prev!.steps,
        { stepNumber: prev!.steps.length + 1, message: "" },
      ],
    }));
  }
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-row h-screen w-screen ">
      <div className="flex flex-col min-w-sm max-w-lg h-screen">
        <div className="m-2 rounded-lg border p-1 flex-1 flex flex-col max-h-screen">
          <h1 className="self-center">
            {" "}
            CHAT {isConnected ? "CONNECTED" : "CONNECTING..."}
          </h1>
          <div className="overflow-y-auto bg-blue-100 flex flex-col-reverse flex-grow">
            {messages &&
              messages.map((m, index) => (
                <ChatMessage key={index} content={m.content} role={m.role} />
              ))}
            <div ref={messagesEndRef} /> {/* Invisible element for scrolling */}
          </div>
          <div className="relative mt-auto">
            <ChatInput onSendMessage={(message) => sendMessage(message)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-screen">
        <div className="m-2 rounded-lg border p-1 flex-1 flex flex-col">
          <h1 className="self-center"> WORKSPACE</h1>

          <div className="flex flex-col h-full">
            {sequence?.id ? (
              <div>
                {sequence.steps.map((step) => (
                  <SequenceStep
                    key={step.stepNumber}
                    stepNumber={step.stepNumber}
                    message={step.message}
                    onStepChange={onStepChange}
                  />
                ))}

                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={onAddStep}
                >
                  Add Step
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center">
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={onNewSequence}
                >
                  Start a new sequence
                </button>
                <p>Or ask the assistant to create one for you</p>
              </div>
            )}
          </div>
          <div>
            {sequence && (
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={onUpdateSequence}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
