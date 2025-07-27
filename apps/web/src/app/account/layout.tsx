import { authClient } from "@/lib/auth-client";
import { AccountLayout } from "@/modules/layouts/account-layout";
import { headers } from "next/headers";

export default async function AccountPageLayout({
  dashboard,
  auth
}: {
  dashboard?: React.ReactNode;
  auth?: React.ReactNode;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  return (
    <AccountLayout>
      {session.data && !session.error ? dashboard : auth}
    </AccountLayout>
  );
}
