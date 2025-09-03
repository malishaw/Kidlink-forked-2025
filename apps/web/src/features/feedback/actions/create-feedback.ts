// "use server";

// import { getClient } from "@/lib/rpc/server";
// import type { feedbackInsertType } from "../schemas";

// export async function createdFeedback(data: feedbackInsertType) {
//   const rpcClient = await getClient();

//   const response = await rpcClient.api.feedback.$post({
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

//   const createdFeedback = await response.json();

//   return createdFeedback;
// }

"use server"; // or export an async function

import { getClient } from "@/lib/rpc/server";
import type { feedbackInsertType } from "../schemas";

export async function createFeedback(data: feedbackInsertType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.feedbacks.$post({ json: data });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const createdFeedback = await response.json();
  return createdFeedback;
}
