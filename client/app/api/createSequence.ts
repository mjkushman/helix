import type { Sequence } from "~/types/types";

export default async function createSequence(
  threadId: string
): Promise<Sequence> {
  const response = await fetch(`http://localhost:5000/sequence`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ thread_id: threadId }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const sequence: Sequence = await response.json();
  console.log("created sequence: ", sequence);
  return sequence;
}
