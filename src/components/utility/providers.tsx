"use client";

// External Dependencies
import { useState } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { type FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextAdapterApp from "next-query-params/app";
import { QueryParamProvider } from "use-query-params";
import { ClerkProvider } from "@clerk/nextjs";

export const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <NextThemesProvider {...props}>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <QueryParamProvider adapter={NextAdapterApp}>
              {children}
            </QueryParamProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </NextThemesProvider>
    </ClerkProvider>
  );
};
