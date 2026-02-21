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

const VIDEO_TYPES = [
  { id: "property-showcase", name: "Property Showcase", duration: "30s", aspect: "16:9" },
  { id: "social-short", name: "Social Short", duration: "9s", aspect: "9:16" },
  { id: "just-listed", name: "Just Listed", duration: "12s", aspect: "9:16" },
];

const VOICES = [
  { id: "alloy", name: "Alloy", desc: "Neutral & professional" },
  { id: "echo", name: "Echo", desc: "Warm & inviting" },
  { id: "nova", name: "Nova", desc: "Energetic & dynamic" },
  { id: "onyx", name: "Onyx", desc: "Deep & authoritative" },
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

export default function StudioPage() {
  const searchParams = useSearchParams();

  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [videoType, setVideoType] = useState(searchParams.get("type") || "property-showcase");
  const [voice, setVoice] = useState("alloy");
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(true);

  const [status, setStatus] = useState<JobStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<any>(null);

  // Poll for job status
  useEffect(() => {
    if (!jobId || status === "complete" || status === "error") return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/video/status?id=${jobId}`);
        const data = await response.json();

        // API returns { success, job: { status, progress, ... } }
        const job = data.job || data;

        if (job.status) {
          // Map API statuses to UI statuses
          const statusMap: Record<string, JobStatus> = {
            pending: "pending",
            scraping: "scraping",
            scraped: "scraped",
            generating: "generating",
            script_ready: "script_ready",
            voiceover: "voiceover",
            voiceover_ready: "voiceover_ready",
            rendering: "rendering",
            complete: "complete",
            failed: "error",
          };
          const mappedStatus = statusMap[job.status] || (job.status as JobStatus);
          setStatus(mappedStatus);
          setProgress(job.progress || STATUS_PROGRESS[mappedStatus] || 0);
        }

        if (job.propertyData) {
          setPropertyData(job.propertyData);
        }

        if (job.status === "complete" && job.videoUrl) {
          setVideoUrl(job.videoUrl);
          clearInterval(pollInterval);
        }

        if (job.status === "failed" || job.error) {
          setError(job.error || "An error occurred");
          setStatus("error");
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error("Status poll error:", err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [jobId, status]);

  const handleGenerate = async () => {
    if (!url.trim()) return;

    setStatus("pending");
    setProgress(5);
    setError(null);
    setVideoUrl(null);
    setPropertyData(null);

    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingUrl: url,
          videoType,
          voiceoverEnabled,
          voice,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start generation");
      }

      setJobId(data.jobId);
      setStatus("scraping");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setJobId(null);
    setVideoUrl(null);
    setError(null);
    setPropertyData(null);
  };

  const isGenerating = status !== "idle" && status !== "complete" && status !== "error";

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Video Studio
        </h1>
        <p className="text-white/40">
          Generate cinematic property videos from any listing URL
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Panel - Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* URL Input */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Listing URL
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://zillow.com/..."
                disabled={isGenerating}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-4 pl-12 pr-4 text-[15px] placeholder:text-white/20 focus:outline-none focus:border-white/20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Video Type */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Video Type
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
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <span>{type.duration}</span>
                    <span className="text-white/10">·</span>
                    <span className="font-mono">{type.aspect}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                AI Voiceover
              </label>
              <button
                onClick={() => setVoiceoverEnabled(!voiceoverEnabled)}
                disabled={isGenerating}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  voiceoverEnabled
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/[0.05] text-white/30"
                } disabled:opacity-50`}
              >
                {voiceoverEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {voiceoverEnabled && (
              <div className="grid grid-cols-2 gap-2">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    disabled={isGenerating}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      voice === v.id
                        ? "bg-white/[0.05] border-white/20"
                        : "border-white/[0.06] hover:border-white/[0.12]"
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className={`w-3 h-3 ${voice === v.id ? "text-white" : "text-white/30"}`} />
                      <span className="font-medium text-sm">{v.name}</span>
                    </div>
                    <span className="text-[11px] text-white/30">{v.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={isGenerating ? undefined : (status === "complete" || status === "error" ? handleReset : handleGenerate)}
            disabled={!url.trim() && status === "idle"}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isGenerating
                ? "bg-white/[0.05] text-white/50 cursor-wait"
                : status === "complete"
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : status === "error"
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white text-black hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : status === "complete" ? (
              <>
                <RefreshCw className="w-5 h-5" />
                Generate Another
              </>
            ) : status === "error" ? (
              <>
                <RefreshCw className="w-5 h-5" />
                Try Again
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Video
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Preview & Progress */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Preview */}
          <div className="aspect-video rounded-2xl bg-black border border-white/[0.06] overflow-hidden relative">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
                    </div>
                    <p className="text-white/40 font-medium">{STATUS_LABELS[status]}</p>
                  </div>
                ) : status === "error" ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-400 font-medium mb-2">Generation Failed</p>
                    <p className="text-white/30 text-sm max-w-xs">{error}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/30">Your video will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {(isGenerating || status === "complete") && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">{STATUS_LABELS[status]}</span>
                <span className="text-sm text-white/40">{progress}%</span>
              </div>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    status === "complete" ? "bg-emerald-500" : "bg-white/40"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Step Indicators */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { key: "scraping", label: "Extract", icon: Globe },
                  { key: "generating", label: "Script", icon: Wand2 },
                  { key: "voiceover", label: "Voice", icon: Volume2 },
                  { key: "rendering", label: "Render", icon: Film },
                ].map((step) => {
                  const stepProgress = STATUS_PROGRESS[step.key as JobStatus];
                  const isComplete = progress >= stepProgress + 15;
                  const isActive = progress >= stepProgress && progress < stepProgress + 15;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl text-center transition-all ${
                        isComplete
                          ? "bg-emerald-500/10 text-emerald-400"
                          : isActive
                          ? "bg-white/[0.05] text-white"
                          : "text-white/20"
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[10px] font-medium">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Download Button */}
          {videoUrl && (
            <a
              href={videoUrl}
              download
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] font-medium hover:bg-white/[0.08] transition-all"
            >
              <Download className="w-5 h-5" />
              Download Video
            </a>
          )}

          {/* Property Data Preview */}
          {propertyData && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Extracted Data
              </h3>
              <div className="space-y-2 text-sm">
                {propertyData.address && (
                  <p><span className="text-white/40">Address:</span> {propertyData.address}</p>
                )}
                {propertyData.price && (
                  <p><span className="text-white/40">Price:</span> ${propertyData.price.toLocaleString()}</p>
                )}
                {propertyData.bedrooms && (
                  <p><span className="text-white/40">Beds/Baths:</span> {propertyData.bedrooms} bd / {propertyData.bathrooms} ba</p>
                )}
                {propertyData.sqft && (
                  <p><span className="text-white/40">Sqft:</span> {propertyData.sqft.toLocaleString()}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
