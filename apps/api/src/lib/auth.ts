import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin as adminPlugin,
  bearer,
  openAPI,
  organization
} from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { ac, admin, member, owner } from "./permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    adminPlugin(),
    openAPI(),
    bearer(),
    organization({
      ac: ac,
      roles: {
        member,
        admin,
        owner
      },
      allowUserToCreateOrganization(user) {
        const isAdmin = (user as any)?.role === "admin";
        return isAdmin;
      },

      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`;
        console.log({ inviteLink });
        // TODO: implement sending email functionality
        // TODO: Implement sending notification functionality
      }
    })
  ]
});

export type Session = typeof auth.$Infer.Session;
