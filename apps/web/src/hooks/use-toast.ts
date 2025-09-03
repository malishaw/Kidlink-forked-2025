import { useCallback } from "react";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  // Replace this with your actual toast logic or connect to a UI library
  const toast = useCallback((options: ToastOptions) => {
    // For now, just log to console
    console.log("Toast:", options);
    // You can integrate with a toast library here
  }, []);
  return { toast };
}
