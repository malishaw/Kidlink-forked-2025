// "use server";

// import { getClient } from "@/lib/rpc/server";
// import type { commentInsertType } from "../schemas";

// export async function createdComment(data: commentInsertType) {
//   const rpcClient = await getClient();

//   const response = await rpcClient.api.comment.$post({
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

//   const createdComment = await response.json();

//   return createdComment;
// }

"use server"; // or export an async function

import { getClient } from "@/lib/rpc/server";
import type { postCommentInsertType } from "../schemas";

export async function createComment(data: postCommentInsertType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.comment.$post({ json: data });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const createdComment = await response.json();
  return createdComment;
}
