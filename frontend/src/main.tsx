import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthInitializer } from "@/components/auth/Auth-initializer";
import { AppearanceSync } from "@/components/AppearanceSync";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <AppearanceSync />
        <AuthInitializer>
          <App/>
        </AuthInitializer>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
);