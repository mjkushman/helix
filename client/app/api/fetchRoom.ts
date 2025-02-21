export default async function createRoom(): Promise<string> {
  const response = await fetch("http://localhost:5000", { method: "POST" });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const { room }: { room: string } = await response.json();
  console.log("Created room: ", room);

  return room;
}
