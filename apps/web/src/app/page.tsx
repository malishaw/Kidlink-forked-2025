import { client } from "@/lib/rpc";

export default async function Home() {
  const res = await client.api.tasks.$get();

  const tasks = await res.json();

  return (
    <div>
      <h2>{JSON.stringify(tasks, null, 2)}</h2>
    </div>
  );
}
