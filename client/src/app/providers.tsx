/* ---------------------------------------------------------------------------
   Component: Providers
   Purpose:
     - Wraps the application with global state providers.
     - Currently integrates the Redux StoreProvider for global state management.
   Notes:
     - Marked as "use client" so it can run client-side (needed for hooks/state).
     - Can be extended to include other providers (e.g., ThemeProvider, QueryClientProvider).
   Props:
     - children: React.ReactNode → Any nested content that should have access
       to the provided state/context.
--------------------------------------------------------------------------- */

"use client";

import React from "react";
import StoreProvider from "@/state/redux"; // Redux provider for application-wide state

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    // Wraps children in the Redux store so all components can access global state
    <StoreProvider>
      {children}
    </StoreProvider>
  );
};

export default Providers;
