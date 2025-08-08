"use client";

import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { store } from "./store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider>
        <ColorModeProvider>
          {children}
        </ColorModeProvider>
      </ChakraProvider>
    </ReduxProvider>
  );
}
