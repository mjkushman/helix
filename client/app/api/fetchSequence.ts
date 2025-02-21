import type { Sequence } from "~/types/types";

export default async function fetchSequence(
  threadId: string
): Promise<Sequence> {
  const response = await fetch(`http://localhost:5000/sequence/${threadId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const sequence: Sequence = await response.json();
  // console.log("fetched sequence: ", sequence);

  return sequence;
}
