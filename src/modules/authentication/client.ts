import { toast } from "sonner";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

import { env } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL!,
  plugins: [adminClient()],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    }
  }
});
