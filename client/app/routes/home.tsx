import type { Route } from "./+types/home";
import { ChatSpace } from "~/components/ChatSpace";
import { WorkSpace } from "~/components/WorkSpace";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-row h-screen w-screen ">
      <ChatSpace />
      <WorkSpace />
    </div>
  );
}
