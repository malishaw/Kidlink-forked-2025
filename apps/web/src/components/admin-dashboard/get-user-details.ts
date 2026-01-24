import { authClient } from "@/lib/auth-client";

export function getUserDetails() {
  const { data: session } = authClient.useSession();
  return {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "",
    avatar: session?.user?.avatar || "/avatars/shadcn.jpg",
  };
}
