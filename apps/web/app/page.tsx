import { client } from "../lib/rpc";

export default async function Home() {
  const res = await client.api.tasks.$get();

  const tasks = await res.json();

  console.log({ tasks });

  return <div className="">{JSON.stringify(tasks, null, 2)}</div>;
}
