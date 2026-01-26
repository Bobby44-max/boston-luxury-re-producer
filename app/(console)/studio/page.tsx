"use client";

import VideoStudio from "@/components/VideoStudio";

export default function StudioPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-400/[0.08] border border-emerald-400/20 rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
            Remotion + Firecrawl + AI
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2">AI Video Studio</h1>
        <p className="text-white/50">
          Paste any listing URL to generate a studio-grade property video in minutes.
        </p>
      </div>

      {/* VideoStudio Component */}
      <VideoStudio />
    </div>
  );
}
