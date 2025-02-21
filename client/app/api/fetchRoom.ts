export default async function fetchRoom(): Promise<string> {
  console.log("Fetching room...");
  const response = await fetch("http://localhost:5000");
  const { room }: { room: string } = await response.json();
  console.log(room);
  return room;
}
