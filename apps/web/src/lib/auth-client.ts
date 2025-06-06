import { adminClient, apiKeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { env } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient(), apiKeyClient()],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    }
  }
});
