"use server";

import { getClient } from "@/lib/rpc/server";

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  image?: string;
  callbackURL?: string;
  rememberMe?: boolean;
}

export interface SignUpResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export async function signUpUser(data: SignUpRequest): Promise<{
  success: boolean;
  data?: SignUpResponse;
  error?: string;
}> {
  try {
    const rpc = await getClient();

    console.log("Making sign-up request with data:", data);

    // Add type assertion to handle potential undefined
    const authClient = (rpc as any).auth;
    if (!authClient) {
      throw new Error("Auth client not available");
    }

    const response = await authClient["sign-up"].email.$post({
      json: {
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image || "",
        callbackURL: data.callbackURL || "",
        rememberMe: data.rememberMe ?? true,
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      // Log the response text to see what we're getting
      const responseText = await response.text();
      console.error("Error response:", responseText);

      // Try to parse as JSON, but handle HTML responses
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse error response as JSON:", parseError);
        return {
          success: false,
          error: `Server error: ${response.status} ${response.statusText}`,
        };
      }

      return {
        success: false,
        error: errorData.message || "Failed to create user",
      };
    }

    const responseText = await response.text();
    console.log("Success response:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse success response as JSON:", parseError);
      return {
        success: false,
        error: "Invalid response format from server",
      };
    }

    return {
      success: true,
      data: result as SignUpResponse,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function createTeacher(email: string, password: string) {
  return signUpUser({
    name: "teacher",
    email,
    password,
    rememberMe: true,
  });
}

export async function createParent(email: string, password: string) {
  return signUpUser({
    name: "parent",
    email,
    password,
    rememberMe: true,
  });
}
