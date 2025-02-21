import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import fetchRoom from "~/api/fetchRoom";

import { Navigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your AI Outreach Companion | Helix" },
    { name: "description", content: "Welcome to Helix!" },
  ];
}

export default function Home() {
  const [room, setRoom] = useState<string>();

  function handleStartChat() {
    fetchRoom().then(setRoom);
  }

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      {room ? (
        <Navigate to={`/${room}`} />
      ) : (
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleStartChat}
          >
            Start a Chat
          </button>{" "}
        </div>
      )}
    </div>
  );
}
