import { getUserType } from "@/lib/helpers/get-user-type";

export default async function AccountPageLayout({
  hotel,
  user
}: {
  hotel?: React.ReactNode;
  user?: React.ReactNode;
}) {
  const userType = await getUserType();

  return <div>{userType === "hotelOwner" ? hotel : user}</div>;
}
