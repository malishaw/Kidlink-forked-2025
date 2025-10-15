import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Teacher {
  id: string;
  classId: string | null;
  organizationId: string | null;
  userId: string | null;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface FilterParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  search?: string;
}

// React Query hook to fetch teachers by userId
export const useGetTeacherByUserId = (
  userId: string,
  params: FilterParams = {}
) => {
  return useQuery({
    queryKey: ["teacher", "user", userId, params],
    queryFn: async () => {
      try {
        const rpcClient = await getClient();

        // Check if rpcClient exists and has the expected structure
        if (!rpcClient) {
          throw new Error("RPC client is not available");
        }

        if (!rpcClient.api) {
          throw new Error("API is not available on RPC client");
        }

        // Try different possible API structures
        let response;

        // Option 1: Check if teacher endpoint exists directly
        if (rpcClient.api.teacher && rpcClient.api.teacher.user) {
          response = await rpcClient.api.teacher.user[":userId"].$get({
            param: { userId },
            query: {
              page: params.page?.toString() || "",
              limit: params.limit?.toString() || "",
              sort: params.sort || "desc",
              search: params.search || "",
            },
          });
        }
        // Option 2: Check if teachers endpoint exists (plural)
        else if (rpcClient.api.teachers && rpcClient.api.teachers.user) {
          response = await rpcClient.api.teachers.user[":userId"].$get({
            param: { userId },
            query: {
              page: params.page?.toString() || "",
              limit: params.limit?.toString() || "",
              sort: params.sort || "desc",
              search: params.search || "",
            },
          });
        }
        // Fallback: Direct fetch if RPC client structure is different
        else {
          console.warn("Using fallback fetch method");
          const searchParams = new URLSearchParams({
            page: params.page?.toString() || "",
            limit: params.limit?.toString() || "",
            sort: params.sort || "desc",
            search: params.search || "",
          });

          response = await fetch(
            `/api/teacher/user/${userId}?${searchParams}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message ||
                `HTTP ${response.status}: Failed to fetch teachers`
            );
          }

          const json = await response.json();
          return json as PaginatedResponse<Teacher>;
        }

        if (!response || !response.ok) {
          const errorData = await response?.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to fetch teachers by user ID"
          );
        }

        const json = await response.json();
        return json as PaginatedResponse<Teacher>;
      } catch (error) {
        console.error("Error in useGetTeacherByUserId:", error);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Server action version for server-side usage
// export async function getTeacherByUserId(
//   userId: string,
//   params: FilterParams = {}
// ): Promise<PaginatedResponse<Teacher>> {
//   try {
//     const rpcClient = await getClient();

//     if (!rpcClient || !rpcClient.api) {
//       // Fallback to direct fetch
//       const searchParams = new URLSearchParams({
//         page: params.page?.toString() || "",
//         limit: params.limit?.toString() || "",
//         sort: params.sort || "desc",
//         search: params.search || "",
//       });

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/teacher/user/${userId}?${searchParams}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `HTTP ${response.status}: Failed to fetch teachers`
//         );
//       }

//       const json = await response.json();
//       return json as PaginatedResponse<Teacher>;
//     }

//     // Try RPC client first
//     let response;

//     if (rpcClient.api.teacher && rpcClient.api.teacher.user) {
//       response = await rpcClient.api.teacher.user[":userId"].$get({
//         param: { userId },
//         query: {
//           page: params.page?.toString() || "",
//           limit: params.limit?.toString() || "",
//           sort: params.sort || "desc",
//           search: params.search || "",
//         },
//       });
//     } else if (rpcClient.api.teachers && rpcClient.api.teachers.user) {
//       response = await rpcClient.api.teachers.user[":userId"].$get({
//         param: { userId },
//         query: {
//           page: params.page?.toString() || "",
//           limit: params.limit?.toString() || "",
//           sort: params.sort || "desc",
//           search: params.search || "",
//         },
//       });
//     } else {
//       throw new Error("Teacher API endpoint not found in RPC client");
//     }

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(
//         errorData.message || "Failed to fetch teachers by user ID"
//       );
//     }

//     const json = await response.json();
//     return json as PaginatedResponse<Teacher>;
//   } catch (error) {
//     console.error("Error in getTeacherByUserId:", error);
//     throw error;
//   }
// }
