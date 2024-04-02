"use client";

// External Dependencies
import { useState } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TooltipProvider>
    </NextThemesProvider>
  );
};
