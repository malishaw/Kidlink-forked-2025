// "use server";

// import { getClient } from "@/lib/rpc/server";
// import type { notificationInsertType } from "../schemas";

// export async function createdNotification(data: notificationInsertType) {
//   const rpcClient = await getClient();

//   const response = await rpcClient.api.notification.$post({
//     json: data,
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     console.error("API Error Response:", errorData);

//     // Throw an error with full info (stringify if you want)
//     throw new Error(
//       errorData.message || JSON.stringify(errorData) || "Unknown error"
//     );
//   }

//   const createdNotification = await response.json();

//   return createdNotification;
// }

"use server"; // or export an async function

import { getClient } from "@/lib/rpc/server";
import type { notificationInsertType } from "../schemas";

export async function createNotification(data: notificationInsertType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.notification.$post({ json: data });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const createdNotification = await response.json();
  return createdNotification;
}
