import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { formatDistanceToNow } from "date-fns";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const res = await client.api.tasks.$get();
  const tasks = await res.json();

  async function handleAddNew(data: FormData) {
    "use server";

    const name = data.get("taskName")?.toString().trim();

    if (!name) {
      throw new Error("Task name is required");
    }

    await client.api.tasks.$post({
      json: { name, done: false }
    });

    // Revalidate the page to show the new task
    revalidatePath("/");
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>

        <div>
          <form className="flex items-center gap-4" action={handleAddNew}>
            <Input name="taskName" placeholder="New task name" />
            <Button type="submit">Add New Task</Button>
          </form>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 flex justify-center">
            <p className="text-muted-foreground">
              No tasks found. Create one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className={"p-0"}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="h-full">
                  <CardTitle>{task.name}</CardTitle>
                  <CardDescription>
                    {formatDistanceToNow(task.createdAt)}
                  </CardDescription>
                </div>
                <Badge variant={task.done ? "default" : "destructive"}>
                  {task.done ? "Completed" : "Active"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
