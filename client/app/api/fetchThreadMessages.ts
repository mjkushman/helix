import type { Message } from "~/types/types";

export default async function fetchThreadMessages(
  threadId: string
): Promise<Message[]> {
  const response = await fetch(`http://localhost:5000/thread/${threadId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const thread: Message[] = await response.json();
  console.log("fetched thread: ", thread);

  return thread;
}
