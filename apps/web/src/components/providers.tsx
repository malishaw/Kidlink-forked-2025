"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <NuqsAdapter>{children}</NuqsAdapter>
    </NextThemesProvider>
  );
}
