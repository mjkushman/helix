import type { Sequence, Step } from "~/types/types";

export default async function updateSequence(
  sequence: Sequence
): Promise<Sequence> {
  console.log("updaing sequence: ");
  const response = await fetch(`http://localhost:5000/sequence/${sequence.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sequence),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const updatedSequence: Sequence = await response.json();
  console.log("updated sequence: ", updatedSequence);
  return updatedSequence;
}
