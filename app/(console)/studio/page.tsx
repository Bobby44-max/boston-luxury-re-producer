"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Loader2,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Film,
  Wand2,
  RefreshCw,
  ChevronRight,
  Zap,
  Layout,
  Search,
  Maximize2,
  Mic
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
  idle: "Awaiting Input",
  pending: "Initializing Fleet...",
  scraping: "Extracting Web DNA...",
  scraped: "DNA Extraction Complete",
  generating: "Synthesizing Narrative...",
  script_ready: "Narrative Locked",
  voiceover: "Generating AI Vocals...",
  voiceover_ready: "Vocals Synchronized",
  rendering: "Rendering 4K Cinema...",
  complete: "Production Complete",
  error: "Strategic Failure",
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
    <div className="premium-glass p-8 rounded-[2rem] border border-blue-500/20 flex items-center justify-between group overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-space font-bold text-blue-400 mb-1 tracking-tight">GEO Citability Score</h3>
        <p className="text-sm text-white/40 font-light">How effectively AI models can cite this content</p>
      </div>
      <div className="relative z-10 text-6xl font-space font-black text-blue-400 tabular-nums">{data.citationScore}%</div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="premium-glass p-6 rounded-3xl border border-white/5">
        <h4 className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-rose-500" />
          Optimization Gaps
        </h4>
        <ul className="space-y-4">
          {data.contentGaps?.map((gap: string, i: number) => (
            <li key={i} className="flex gap-4 text-sm text-white/60 font-light leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-rose-500/50 mt-2 shrink-0"></span>
              {gap}
            </li>
          ))}
        </ul>
      </div>
      <div className="premium-glass p-6 rounded-3xl border border-white/5">
        <h4 className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          Strategic Tactics
        </h4>
        <ul className="space-y-4">
          {data.aeoTactics?.map((tactic: string, i: number) => (
            <li key={i} className="flex gap-4 text-sm text-white/60 font-light leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-emerald-500/50 mt-2 shrink-0"></span>
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
    <div className="premium-glass p-8 rounded-[2rem] border border-white/5">
      <h3 className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Visual Signature</h3>
      <p className="text-2xl font-space font-light text-white leading-tight italic">"{data.visualSignature}"</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Color Palette */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em] ml-2">Color Palette</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data.theme?.colors || {}).map(([name, hex]: [any, any]) => (
            <div key={name} className="premium-glass p-3 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10" style={{ backgroundColor: hex }} />
              <div>
                <div className="text-[9px] text-white/40 uppercase font-bold tracking-widest">{name}</div>
                <div className="text-xs font-mono font-bold text-white/80 uppercase">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em] ml-2">Typography Scale</h4>
        <div className="premium-glass p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="group">
            <div className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
              <ChevronRight className="w-2 h-2 group-hover:translate-x-1 transition-transform" />
              Display Font
            </div>
            <div className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: data.theme?.typography?.display }}>
              {data.theme?.typography?.display}
            </div>
          </div>
          <div className="group">
            <div className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
              <ChevronRight className="w-2 h-2 group-hover:translate-x-1 transition-transform" />
              Body Font
            </div>
            <div className="text-sm opacity-60 font-light leading-relaxed" style={{ fontFamily: data.theme?.typography?.body }}>
              Experience the definitive standard for AI-driven luxury real estate marketing.
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Shadcn Config Export */}
    <div className="premium-glass rounded-2xl border border-white/10 bg-black/40 p-1 group">
      <div className="flex justify-between items-center p-3 px-5">
        <span className="text-[9px] font-space font-bold text-white/30 uppercase tracking-[0.2em]">shadcn-config.json</span>
        <button 
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data.shadcnConfig, null, 2))}
          className="text-[10px] font-space font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
        >
          <Zap className="w-3 h-3" />
          Copy JSON
        </button>
      </div>
      <div className="p-6 rounded-xl bg-black/60 font-mono text-[11px] overflow-x-auto custom-scrollbar h-40">
        <pre className="text-emerald-400/80">{JSON.stringify(data.shadcnConfig, null, 2)}</pre>
      </div>
    </div>
  </div>
);

function StudioContent() {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

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
        const job = data.job;

        if (job?.status) {
          setStatus(job.status as JobStatus);
          setProgress(job.progress || STATUS_PROGRESS[job.status as JobStatus]);
        }

        if (job?.propertyData) {
          setPropertyData(job.propertyData);
        }

        if (job?.status === "complete" && job.videoUrl) {
          setVideoUrl(job.videoUrl);
          clearInterval(pollInterval);
        }

        if (job?.status === "error" || job?.error) {
          setError(job.error || "An error occurred");
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
    <div className="min-h-screen relative overflow-hidden bg-[#050505] text-white">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/re-deck/re_studio_3d.png" 
          alt="Studio Background" 
          fill 
          className="object-cover opacity-40 scale-105 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-space font-bold tracking-tighter mb-2">
              Intelligence Studio
            </h1>
            <p className="text-white/40 font-light tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              Multimodal reasoning for high-end real estate production
            </p>
          </div>
          <div className="flex gap-4">
            <div className="premium-glass px-4 py-2 rounded-full border border-white/10 text-[10px] font-space font-bold uppercase tracking-widest text-white/40">
              Fleet Version: 2.1.0-Flash
            </div>
            <div className="status-badge status-live">
              <span className="status-pulse"></span>
              Gemini 1.5 Pro Live
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Panel - Control Center */}
          <div className="lg:col-span-4 space-y-8">
            {/* Intelligence Mode Selection */}
            <div className="premium-glass p-8 rounded-[2.5rem] border border-white/10">
              <label className="block text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-6">
                Strategic Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                {INTELLIGENCE_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = intelMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setIntelMode(mode.id)}
                      disabled={isGenerating}
                      className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                        isActive
                          ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                          : "border-white/5 hover:border-white/20 bg-white/[0.02]"
                      } disabled:opacity-50`}
                    >
                      {isActive && <motion.div layoutId="mode-active" className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />}
                      <Icon className={`w-6 h-6 mb-3 ${isActive ? "text-white" : "text-white/20"} group-hover:scale-110 transition-transform`} />
                      <div className="font-space font-bold text-xs mb-1 tracking-tight text-white">{mode.name}</div>
                      <div className="text-[10px] text-white/30 leading-tight font-light">{mode.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Module */}
            <div className="premium-glass p-8 rounded-[2.5rem] border border-white/10">
              {intelMode !== "agent-research" ? (
                <div className="space-y-4">
                  <label className="block text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-2">
                    Source Intelligence URL
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white/50 transition-colors">
                      <Globe className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste property listing or site URL..."
                      disabled={isGenerating}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm font-light placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-2">
                    Research Objective
                  </label>
                  <textarea
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    placeholder="Describe the research target (e.g., 'Analyze Seaport pricing trends and identify top 3 competitors')..."
                    disabled={isGenerating}
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm font-light placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all disabled:opacity-50 resize-none custom-scrollbar"
                  />
                </div>
              )}
            </div>

            {/* Format Options (Conditional) */}
            {intelMode === "video" && (
              <div className="premium-glass p-8 rounded-[2.5rem] border border-white/10">
                <label className="block text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-6">
                  Production Format
                </label>
                <div className="space-y-3">
                  {VIDEO_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setVideoType(type.id)}
                      disabled={isGenerating}
                      className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                        videoType === type.id
                          ? "bg-white/10 border-white/30"
                          : "border-white/5 hover:border-white/20 bg-white/[0.02]"
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${videoType === type.id ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.02] border-white/5 text-white/20"}`}>
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-space font-bold text-xs tracking-tight text-white">{type.name}</div>
                          <div className="text-[10px] text-white/30 font-light">{type.aspect} Aspect Ratio</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full group-hover:bg-white/10 transition-colors">
                        {type.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Execute Action */}
            <button
              onClick={isGenerating ? undefined : (status === "complete" || status === "error" ? handleReset : handleProcess)}
              disabled={(!url.trim() && intelMode !== "agent-research") && status === "idle"}
              className={`w-full py-6 rounded-[2rem] font-space font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                isGenerating
                  ? "bg-white/5 text-white/40 cursor-wait border border-white/10"
                  : status === "complete"
                  ? "premium-glass border-white/20 text-white hover:bg-white/10"
                  : "bg-white text-black hover:bg-gray-200 shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fleet Processing
                </>
              ) : status === "complete" ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  New Directive
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Initialize Studio
                </>
              )}
            </button>
          </div>

          {/* Right Panel - The Cinema / Intelligence Output */}
          <div className="lg:col-span-8">
            <div className="h-full flex flex-col space-y-8">
              {/* Output Container */}
              <div className="flex-1 min-h-[600px] premium-glass rounded-[3rem] border border-white/10 overflow-hidden relative group">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                {!isGenerating && status === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700">
                      <Layout className="w-10 h-10 text-white/10" />
                    </div>
                    <h2 className="text-3xl font-space font-bold tracking-tight mb-4 text-white/60">Awaiting Strategic Directive</h2>
                    <p className="text-white/20 font-light max-w-sm leading-relaxed">
                      Initialize the fleet by providing a source URL or research objective. The studio will synthesize high-fidelity multimodal data into actionable assets.
                    </p>
                    <div className="mt-12 flex gap-8 items-center text-[10px] font-space font-bold text-white/10 uppercase tracking-[0.3em]">
                      <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/10"></div> Video Rendering</span>
                      <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/10"></div> GEO Audits</span>
                      <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/10"></div> Design DNA</span>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <div className="relative mb-12">
                      <div className="w-32 h-32 rounded-full border-2 border-white/5 animate-[spin_10s_linear_infinite]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center relative overflow-hidden">
                          <motion.div 
                            animate={{ y: [-20, 20], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
                          />
                          <Loader2 className="w-8 h-8 text-white animate-spin-slow" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-space font-bold tracking-tight mb-2 uppercase tracking-[0.2em]">{STATUS_LABELS[status]}</h3>
                    <p className="text-white/40 font-light max-w-xs leading-relaxed">
                      Gemini 1.5 Pro is analyzing multimodal streams using massive token reasoning...
                    </p>
                    
                    {/* Precision Progress Bar */}
                    <div className="w-full max-w-md mt-16 space-y-3">
                      <div className="flex justify-between text-[10px] font-space font-bold uppercase tracking-[0.3em] text-white/20">
                        <span>Fleet Progress</span>
                        <span className="text-white/60">{progress}%</span>
                      </div>
                      <div className="h-[2px] w-full bg-white/5 rounded-full relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-white shadow-[0_0_20px_white]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {status === "complete" && (
                  <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-10 md:p-14">
                    {intelMode === "video" && videoUrl && (
                      <div className="space-y-8 animate-fade-in">
                        <div className="aspect-video rounded-[2rem] overflow-hidden bg-black shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 relative group/video">
                          <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
                          <div className="absolute top-6 right-6 z-20">
                            <div className="premium-glass px-4 py-2 rounded-full border border-white/20 text-[10px] font-space font-bold uppercase tracking-widest text-white backdrop-blur-xl">
                              4K Cinema Render
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6">
                          {[
                            { label: "Narrative Engine", value: "Gemini 2.0 Flash", icon: Sparkles },
                            { label: "Audio Profile", value: "Cinematic AI Voice", icon: Mic },
                            { label: "Render Tech", value: "Remotion Engine", icon: Film },
                          ].map((stat, i) => (
                            <div key={i} className="premium-glass p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                <stat.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{stat.label}</div>
                                <div className="text-xs font-bold text-white">{stat.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {intelMode === "geo-audit" && <GEOAuditResult data={intelResult} />}
                    {intelMode === "design-dna" && <DesignDNAResult data={intelResult} />}
                    {intelMode === "agent-research" && (
                      <div className="animate-fade-in space-y-8">
                        <div className="flex justify-between items-center">
                          <h3 className="text-4xl font-space font-bold tracking-tight">Autonomous Brief</h3>
                          <div className="premium-glass px-5 py-2 rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-space font-bold uppercase tracking-widest">
                            Deep Research Complete
                          </div>
                        </div>
                        <div className="premium-glass p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01] relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                          <div className="text-white/70 leading-[1.8] font-light whitespace-pre-wrap text-lg italic">
                            {intelResult}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-space font-bold text-rose-500 mb-2 uppercase tracking-[0.2em]">Strategic Failure</h3>
                    <p className="text-white/40 font-light max-w-sm mb-10 leading-relaxed">{error}</p>
                    <button onClick={handleReset} className="px-8 py-3 rounded-full border border-white/10 text-[10px] font-space font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Reset Environment</button>
                  </div>
                )}
              </div>

              {/* Utility Toolbar */}
              {status === "complete" && (
                <div className="flex gap-4 animate-fade-in">
                  <button className="flex-1 py-5 rounded-3xl premium-glass border border-white/10 hover:border-white/30 text-[11px] font-space font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                    <Download className="w-4 h-4 text-blue-400" />
                    Export Strategic Package
                  </button>
                  <button className="flex-1 py-5 rounded-3xl premium-glass border border-white/10 hover:border-white/30 text-[11px] font-space font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group">
                    <Maximize2 className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                    Full Screen View
                  </button>
                  <button className="px-10 py-5 rounded-3xl bg-white text-black text-[11px] font-space font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95">
                    Production Push
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-white/5 animate-spin-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          </div>
        </div>
        <span className="text-[10px] font-space font-bold uppercase tracking-[0.4em] text-white/30 animate-pulse">
          Initializing Intelligence
        </span>
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}
