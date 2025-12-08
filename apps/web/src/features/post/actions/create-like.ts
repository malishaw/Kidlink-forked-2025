// "use server";

// import { getClient } from "@/lib/rpc/server";
// import type { likeInsertType } from "../schemas";

// export async function createdLike(data: likeInsertType) {
//   const rpcClient = await getClient();

//   const response = await rpcClient.api.like.$post({
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

//   const createdLike = await response.json();

//   return createdLike;
// }

"use server"; // or export an async function

import { getClient } from "@/lib/rpc/server";
import type { postLikeInsertType } from "../schemas";

export async function createLike(data: postLikeInsertType) {
  try {
    const rpcClient = await getClient();

    if (!rpcClient || !rpcClient.api) {
      throw new Error("RPC client not initialized");
    }

    const response = await rpcClient.api["post-like"].$post({ json: data });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to like post");
    }

    const createdLike = await response.json();
    return createdLike;
  } catch (error: any) {
    console.error("Error creating like:", error);
    throw new Error(error.message || "Failed to like post");
  }
}
