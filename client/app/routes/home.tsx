import type { Route } from "./+types/home";
import { useEffect, useState } from "react";

import { Navigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your AI Outreach Companion | Helix" },
    { name: "description", content: "Welcome to Helix!" },
  ];
}

export default function Home() {
  const [room, setRoom] = useState<Promise<string>>();
  async function fetchRoom() {
    let response = await fetch("http://localhost:5000");
    const room = await response.json();
    setRoom(room);
  }

  useEffect(() => {
    fetchRoom();
  }, []);

  return (
    <div className="flex flex-row h-screen w-screen ">
      {room && <Navigate to={`/${room}`} />} Loading...
    </div>
  );
}
// thread_zRuGyaJsRMXM7GjwOA4lZ2fC
