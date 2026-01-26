"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Placeholder for when Convex isn't configured yet
const PLACEHOLDER_URL = "https://placeholder.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || PLACEHOLDER_URL;
  const isConfigured = process.env.NEXT_PUBLIC_CONVEX_URL !== undefined;

  const client = useMemo(() => {
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  // If Convex isn't configured, render children without provider
  // This allows the app to work without Convex during initial setup
  if (!isConfigured) {
    return (
      <>
        {children}
        {/* Dev warning - only shows in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 z-[9999] p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-xs max-w-xs">
            <strong>Convex not configured.</strong>
            <br />
            Run <code className="bg-black/30 px-1 rounded">npx convex dev</code> to set up.
          </div>
        )}
      </>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
