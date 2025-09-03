import { getClient } from "../rpc/server";

type GetUserReturnT = "user" | "hotelOwner" | "systemAdmin" | "children" | null;

export async function getUserType(): Promise<GetUserReturnT> {
  const rpcClient = await getClient();

  const response = await rpcClient.api.system["check-user-type"].$get({});

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching user type:", errorData);
    return null;
  }

  const responseData = await response.json();

  return responseData.userType;
}
