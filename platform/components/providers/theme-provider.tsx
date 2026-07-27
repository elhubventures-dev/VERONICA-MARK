"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

import { Toaster } from "@/components/ui/sonner";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * App-wide theme + toast provider.
 * Persists light/dark/system preference and mounts Sonner toasts.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
      <Toaster />
    </NextThemesProvider>
  );
}
