import { ac, admin, member, owner } from "@nextplate/api/auth-permissions";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { env } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient(),
    organizationClient({
      ac: ac,
      roles: {
        owner,
        admin,
        member
      }
    })
  ],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    }
  }
});
