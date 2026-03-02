"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Globe,
  Loader2,
  Sparkles,
  Play,
  Download,
  CheckCircle2,
  AlertCircle,
  Film,
  Clock,
  Volume2,
  Wand2,
  RefreshCw,
} from "lucide-react";

const INTELLIGENCE_MODES = [
  { id: "video", name: "AI Video Producer", icon: Film, desc: "Cinematic property showcases" },
  { id: "geo-audit", name: "GEO & AEO Audit", icon: Globe, desc: "AI citability & search scores" },
  { id: "design-dna", name: "Design DNA Cloner", icon: Wand2, desc: "Extract UI & Shadcn specs" },
  { id: "agent-research", name: "Agentic Research", icon: Sparkles, desc: "Autonomous competitor mapping" },
];

const VIDEO_TYPES = [
  { id: "property-showcase", name: "Property Showcase", duration: "30s", aspect: "16:9" },
  { id: "social-short", name: "Social Short", duration: "9s", aspect: "9:16" },
  { id: "just-listed", name: "Just Listed", duration: "12s", aspect: "9:16" },
];

type JobStatus =
  | "idle"
  | "pending"
  | "scraping"
  | "scraped"
  | "generating"
  | "script_ready"
  | "voiceover"
  | "voiceover_ready"
  | "rendering"
  | "complete"
  | "error";

const STATUS_LABELS: Record<JobStatus, string> = {
  idle: "Ready",
  pending: "Starting...",
  scraping: "Extracting property data...",
  scraped: "Property data extracted",
  generating: "Writing script...",
  script_ready: "Script complete",
  voiceover: "Generating voiceover...",
  voiceover_ready: "Voiceover ready",
  rendering: "Rendering video...",
  complete: "Complete!",
  error: "Error occurred",
};

const STATUS_PROGRESS: Record<JobStatus, number> = {
  idle: 0,
  pending: 5,
  scraping: 15,
  scraped: 25,
  generating: 40,
  script_ready: 50,
  voiceover: 60,
  voiceover_ready: 70,
  rendering: 85,
  complete: 100,
  error: 0,
};

// --- Result Components ---

const GEOAuditResult = ({ data }: { data: any }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="p-6 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-accent-indigo mb-1">GEO Citability Score</h3>
        <p className="text-sm text-white/50">How effectively AI models can cite this content</p>
      </div>
      <div className="text-4xl font-black text-accent-indigo">{data.citatonScore}%</div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Optimization Gaps</h4>
        <ul className="space-y-3">
          {data.contentGaps?.map((gap: string, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-white/70">
              <AlertCircle className="w-4 h-4 text-accent-rose shrink-0" />
              {gap}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">AEO Tactics</h4>
        <ul className="space-y-3">
          {data.aeoTactics?.map((tactic: string, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-white/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {tactic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const DesignDNAResult = ({ data }: { data: any }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <h3 className="text-lg font-bold mb-2">Visual Signature</h3>
      <p className="text-white/60 leading-relaxed italic">"{data.visualSignature}"</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Color Palette */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Color Palette</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data.theme?.colors || {}).map(([name, hex]: [any, any]) => (
            <div key={name} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: hex }} />
              <div>
                <div className="text-[10px] text-white/40 uppercase font-bold">{name}</div>
                <div className="text-xs font-mono">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Typography Scale</h4>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-4">
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold mb-1">Display Font</div>
            <div className="text-xl" style={{ fontFamily: data.theme?.typography?.display }}>
              {data.theme?.typography?.display}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold mb-1">Body Font</div>
            <div className="text-sm opacity-60" style={{ fontFamily: data.theme?.typography?.body }}>
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Shadcn Config Export */}
    <div className="p-4 rounded-xl bg-black border border-white/[0.1] font-mono text-[11px] overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/40">// shadcn-config.json</span>
        <button 
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data.shadcnConfig, null, 2))}
          className="text-accent-indigo hover:text-white transition-colors"
        >
          Copy JSON
        </button>
      </div>
      <pre className="text-emerald-400">{JSON.stringify(data.shadcnConfig, null, 2)}</pre>
    </div>
  </div>
);

export default function StudioPage() {
  const searchParams = useSearchParams();

  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [intelMode, setIntelMode] = useState("video");
  const [videoType, setVideoType] = useState(searchParams.get("type") || "property-showcase");
  const [agentPrompt, setAgentPrompt] = useState("");
  
  const [status, setStatus] = useState<JobStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [intelResult, setIntelResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<any>(null);

  // Poll for job status (Only for video mode)
  useEffect(() => {
    if (!jobId || status === "complete" || status === "error" || intelMode !== "video") return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/video/status?id=${jobId}`);
        const data = await response.json();

        if (data.status) {
          setStatus(data.status as JobStatus);
          setProgress(data.progress || STATUS_PROGRESS[data.status as JobStatus]);
        }

        if (data.propertyData) {
          setPropertyData(data.propertyData);
        }

        if (data.status === "complete" && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          clearInterval(pollInterval);
        }

        if (data.status === "error" || data.error) {
          setError(data.error || "An error occurred");
          setStatus("error");
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error("Status poll error:", err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [jobId, status, intelMode]);

  const handleProcess = async () => {
    if (!url.trim() && intelMode !== "agent-research") return;

    setStatus("pending");
    setProgress(5);
    setError(null);
    setVideoUrl(null);
    setIntelResult(null);
    setPropertyData(null);

    try {
      // Use upgraded endpoint for intelligence modes
      const endpoint = intelMode === "video" ? "/api/video/generate" : "/api/scrape";
      const body = intelMode === "video" 
        ? { listingUrl: url, videoType }
        : { url, type: intelMode, prompt: agentPrompt };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start process");
      }

      if (intelMode === "video") {
        setJobId(data.jobId);
        setStatus("scraping");
      } else {
        setIntelResult(data.data);
        setStatus("complete");
        setProgress(100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Process failed");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setJobId(null);
    setVideoUrl(null);
    setIntelResult(null);
    setError(null);
    setPropertyData(null);
  };

  const isGenerating = status !== "idle" && status !== "complete" && status !== "error";

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Intelligence Studio
        </h1>
        <p className="text-white/40">
          From video production to autonomous web intelligence
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Intelligence Mode */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
              Intelligence Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INTELLIGENCE_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = intelMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setIntelMode(mode.id)}
                    disabled={isGenerating}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isActive
                        ? "bg-accent-indigo/10 border-accent-indigo/40 ring-1 ring-accent-indigo/20"
                        : "border-white/[0.06] hover:border-white/[0.12]"
                    } disabled:opacity-50`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isActive ? "text-accent-indigo" : "text-white/20"}`} />
                    <div className="font-semibold text-xs mb-1">{mode.name}</div>
                    <div className="text-[10px] text-white/30 leading-tight">{mode.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* URL Input */}
          {intelMode !== "agent-research" && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Source URL
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste URL to analyze..."
                  disabled={isGenerating}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-4 pl-12 pr-4 text-[15px] placeholder:text-white/20 focus:outline-none focus:border-white/20 disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Agent Prompt */}
          {intelMode === "agent-research" && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Research Objective
              </label>
              <textarea
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Describe what you want the agent to find..."
                disabled={isGenerating}
                rows={4}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-[15px] placeholder:text-white/20 focus:outline-none focus:border-white/20 disabled:opacity-50 resize-none"
              />
            </div>
          )}

          {/* Video Options (Conditional) */}
          {intelMode === "video" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Format
                </label>
                <div className="space-y-2">
                  {VIDEO_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setVideoType(type.id)}
                      disabled={isGenerating}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        videoType === type.id
                          ? "bg-white/[0.05] border-white/20"
                          : "border-white/[0.06] hover:border-white/[0.12]"
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-3">
                        <Film className={`w-4 h-4 ${videoType === type.id ? "text-white" : "text-white/30"}`} />
                        <span className="font-medium text-sm">{type.name}</span>
                      </div>
                      <div className="text-[10px] text-white/30">
                        {type.duration} · {type.aspect}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Execute Button */}
          <button
            onClick={isGenerating ? undefined : (status === "complete" || status === "error" ? handleReset : handleProcess)}
            disabled={(!url.trim() && intelMode !== "agent-research") && status === "idle"}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isGenerating
                ? "bg-white/[0.05] text-white/50 cursor-wait"
                : "btn-premium-solid"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : status === "complete" ? (
              <>
                <RefreshCw className="w-5 h-5" />
                New Analysis
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {intelMode === "video" ? "Generate Video" : "Extract Intelligence"}
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Strategic Output */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Output Display */}
          <div className="min-h-[400px] rounded-2xl bg-black border border-white/[0.06] overflow-hidden relative p-8 flex flex-col">
            {!isGenerating && status === "idle" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <Sparkles className="w-12 h-12 mb-4" />
                <p className="font-medium">Strategic output will appear here</p>
                <p className="text-sm">Select a mode and provide a source URL</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent-indigo/10 flex items-center justify-center mb-6 animate-pulse">
                  <Loader2 className="w-8 h-8 text-accent-indigo animate-spin" />
                </div>
                <h3 className="text-xl font-bold mb-2">Synthesizing Web Intelligence</h3>
                <p className="text-white/40 max-w-sm">
                  Gemini 1.5 Pro is analyzing the source DNA using million-token multimodal reasoning...
                </p>
                
                {/* Micro-Progress */}
                <div className="w-full max-w-md mt-12">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30 mb-2">
                    <span>{STATUS_LABELS[status]}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-indigo transition-all duration-500" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {status === "complete" && (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {intelMode === "video" && videoUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
                    <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
                  </div>
                )}
                
                {intelMode === "geo-audit" && <GEOAuditResult data={intelResult} />}
                {intelMode === "design-dna" && <DesignDNAResult data={intelResult} />}
                {intelMode === "agent-research" && (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold mb-4">Autonomous Research Brief</h3>
                    <div className="text-white/70 leading-relaxed whitespace-pre-wrap">{intelResult}</div>
                  </div>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-accent-rose" />
                </div>
                <h3 className="text-xl font-bold text-accent-rose mb-2">Intelligence Failure</h3>
                <p className="text-white/40 max-w-sm mb-6">{error}</p>
                <button onClick={handleReset} className="btn-premium-solid text-xs">Reset Studio</button>
              </div>
            )}
          </div>

          {/* Utility Actions (When Complete) */}
          {status === "complete" && (
            <div className="flex gap-4 animate-fade-in">
              <button className="flex-1 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] font-bold text-sm hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                {intelMode === "video" ? "Download Video" : "Export Report"}
              </button>
              <button className="flex-1 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] font-bold text-sm hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-indigo" />
                Refine with AI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
