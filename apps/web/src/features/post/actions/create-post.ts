// "use server";

// import { getClient } from "@/lib/rpc/server";
// import type { postInsertType } from "../schemas";

// export async function createdPost(data: postInsertType) {
//   const rpcClient = await getClient();

//   const response = await rpcClient.api.post.$post({
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

//   const createdPost = await response.json();

//   return createdPost;
// }

"use server"; // or export an async function

import { getClient } from "@/lib/rpc/server";
import type { postInsertType } from "../schemas";

export async function createPost(data: postInsertType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.post.$post({ json: data });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const createdPost = await response.json();
  return createdPost;
}
