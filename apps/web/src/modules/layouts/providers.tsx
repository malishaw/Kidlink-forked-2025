"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";

// React-Query Client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <main>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </QueryClientProvider>
      </main>
    </ThemeProvider>
  );
}
