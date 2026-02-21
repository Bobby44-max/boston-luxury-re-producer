"use client";

import React, { useState, useCallback } from "react";
import {
  Video,
  Link2,
  Sparkles,
  Loader2,
  Check,
  Play,
  Download,
  Share2,
  RefreshCw,
  Volume2,
  VolumeX,
  Eye,
  Home,
  Smartphone,
  BarChart3,
  Megaphone,
} from "lucide-react";

interface PropertyData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  description: string;
  features: string[];
  images: string[];
  neighborhood?: string;
}

interface VideoJob {
  id: string;
  status: "pending" | "scraping" | "scraped" | "generating" | "script_ready" | "voiceover" | "voiceover_ready" | "rendering" | "complete" | "failed";
  progress: number;
  propertyData?: PropertyData;
  script?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

type VideoType = "property-showcase" | "social-short" | "market-stats" | "just-listed";

const VIDEO_TYPES: { id: VideoType; label: string; icon: React.ElementType; duration: string; aspect: string }[] = [
  { id: "property-showcase", label: "Property Showcase", icon: Home, duration: "30s", aspect: "16:9" },
  { id: "social-short", label: "Social Short", icon: Smartphone, duration: "9s", aspect: "9:16" },
  { id: "market-stats", label: "Market Stats", icon: BarChart3, duration: "20s", aspect: "16:9" },
  { id: "just-listed", label: "Just Listed", icon: Megaphone, duration: "12s", aspect: "9:16" },
];

const VOICE_OPTIONS = [
  { id: "alloy", name: "Alloy", desc: "Neutral & balanced" },
  { id: "echo", name: "Echo", desc: "Warm & conversational" },
  { id: "nova", name: "Nova", desc: "Friendly & energetic" },
  { id: "onyx", name: "Onyx", desc: "Deep & authoritative" },
  { id: "shimmer", name: "Shimmer", desc: "Clear & professional" },
];

const formatPrice = (price: number) => {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${(price / 1000).toFixed(0)}K`;
};

// Progress Step Component
const ProgressStep: React.FC<{
  label: string;
  status: string;
  step: string;
  isActive: boolean;
  isComplete: boolean;
}> = ({ label, isActive, isComplete }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        isComplete
          ? "bg-green-500 text-white"
          : isActive
            ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white animate-pulse"
            : "bg-white/10 text-white/40"
      }`}
    >
      {isComplete ? <Check className="w-4 h-4" /> : isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : "○"}
    </div>
    <span className={`text-sm ${isActive ? "text-white" : isComplete ? "text-green-400" : "text-white/40"}`}>{label}</span>
  </div>
);

// Property Preview Card
const PropertyPreview: React.FC<{ data: PropertyData }> = ({ data }) => (
  <div className="glass-panel p-4 animate-fade-in">
    <div className="flex gap-4">
      {data.images[0] && (
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img src={data.images[0]} alt="Property" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-white truncate">{data.address}</h4>
            <p className="text-sm text-white/50">
              {data.city}, {data.state} {data.zipCode}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold gradient-text">{formatPrice(data.price)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>🛏️ {data.bedrooms} beds</span>
          <span>🛁 {data.bathrooms} baths</span>
          <span>📐 {data.sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </div>
  </div>
);

export default function VideoStudio() {
  // Form State
  const [listingUrl, setListingUrl] = useState("");
  const [videoType, setVideoType] = useState<VideoType>("property-showcase");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("alloy");

  // Job State
  const [currentJob, setCurrentJob] = useState<VideoJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Branding State
  const [agentName, setAgentName] = useState("");
  const [brokerageName, setBrokerageName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!listingUrl.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setCurrentJob({
      id: "",
      status: "pending",
      progress: 0,
    });

    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingUrl,
          videoType,
          voiceoverEnabled: voiceEnabled,
          voice: selectedVoice,
          branding: {
            agentName: agentName || undefined,
            brokerageName: brokerageName || undefined,
            phone: phone || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start video generation");
      }

      // Start polling for status
      pollJobStatus(data.jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setCurrentJob(null);
    } finally {
      setIsSubmitting(false);
    }
  }, [listingUrl, videoType, voiceEnabled, selectedVoice, agentName, brokerageName, phone]);

  const pollJobStatus = useCallback(async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/video/status?id=${jobId}`);
        const data = await response.json();

        if (data.success && data.job) {
          setCurrentJob({
            id: jobId,
            status: data.job.status,
            progress: data.job.progress,
            propertyData: data.job.propertyData,
            script: data.job.script,
            videoUrl: data.job.videoUrl,
            thumbnailUrl: data.job.thumbnailUrl,
            error: data.job.error,
          });

          // Continue polling if not complete
          if (!["complete", "failed"].includes(data.job.status)) {
            setTimeout(poll, 2000);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    poll();
  }, []);

  const resetForm = () => {
    setCurrentJob(null);
    setListingUrl("");
    setError(null);
  };

  const getStepStatus = (step: string) => {
    if (!currentJob) return { isActive: false, isComplete: false };

    // Map all statuses to their pipeline phase for step tracking
    const statusToPhase: Record<string, string> = {
      pending: "pending",
      scraping: "scraping",
      scraped: "scraping",
      generating: "generating",
      script_ready: "generating",
      voiceover: "generating",
      voiceover_ready: "generating",
      rendering: "rendering",
      complete: "complete",
      failed: "failed",
    };

    const phases = ["pending", "scraping", "generating", "rendering", "complete"];
    const currentPhase = statusToPhase[currentJob.status] || currentJob.status;
    const currentIndex = phases.indexOf(currentPhase);
    const stepIndex = phases.indexOf(step);

    return {
      isActive: currentPhase === step,
      isComplete: currentIndex > stepIndex,
    };
  };

  return (
    <div className="glass-panel p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Video className="w-7 h-7 text-black" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">AI Video Studio</h3>
          <p className="text-sm text-white/50">Paste any listing URL to generate a professional video</p>
        </div>
      </div>

      {/* Main Content */}
      {!currentJob ? (
        // Input Form
        <div className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Listing URL</label>
            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="url"
                placeholder="Paste Zillow, Redfin, Realtor.com, or any listing URL..."
                className="glass-input pl-12 w-full text-lg"
                value={listingUrl}
                onChange={(e) => setListingUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Video Type Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 mb-3">Video Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {VIDEO_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = videoType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setVideoType(type.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      isSelected
                        ? "bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-cyan-400" : "text-white/40"}`} />
                    <div className={`font-semibold text-sm ${isSelected ? "text-white" : "text-white/70"}`}>{type.label}</div>
                    <div className="text-xs text-white/40 mt-1">
                      {type.duration} • {type.aspect}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-wider text-white/40">AI Voiceover</label>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  voiceEnabled ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-white/40 border border-white/10"
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {voiceEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {voiceEnabled && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {VOICE_OPTIONS.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedVoice === voice.id
                        ? "bg-violet-500/20 border-violet-500/50"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className={`font-semibold text-sm ${selectedVoice === voice.id ? "text-violet-300" : "text-white/70"}`}>
                      {voice.name}
                    </div>
                    <div className="text-xs text-white/40">{voice.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Branding Options (Collapsible) */}
          <details className="glass-panel p-4">
            <summary className="cursor-pointer text-sm font-semibold text-white/70 hover:text-white">
              + Add Agent Branding (Optional)
            </summary>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input
                type="text"
                placeholder="Agent Name"
                className="glass-input"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Brokerage Name"
                className="glass-input"
                value={brokerageName}
                onChange={(e) => setBrokerageName(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="glass-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </details>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !listingUrl.trim()}
            className="btn-primary w-full justify-center py-4 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Video
              </>
            )}
          </button>
        </div>
      ) : (
        // Processing / Results View
        <div className="space-y-6">
          {/* Property Preview */}
          {currentJob.propertyData && <PropertyPreview data={currentJob.propertyData} />}

          {/* Progress Steps */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-white">Generation Progress</h4>
              <span className="text-sm text-white/50">{currentJob.progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
                style={{ width: `${currentJob.progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ProgressStep label="Scraping Data" step="scraping" {...getStepStatus("scraping")} status={currentJob.status} />
              <ProgressStep label="Generating Script" step="generating" {...getStepStatus("generating")} status={currentJob.status} />
              <ProgressStep label="Rendering Video" step="rendering" {...getStepStatus("rendering")} status={currentJob.status} />
              <ProgressStep label="Complete" step="complete" {...getStepStatus("complete")} status={currentJob.status} />
            </div>
          </div>

          {/* Script Preview */}
          {currentJob.script && (
            <div className="glass-panel p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-violet-400">Generated Script</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{currentJob.script}</p>
            </div>
          )}

          {/* Video Preview (when complete) */}
          {currentJob.status === "complete" && currentJob.videoUrl && (
            <div className="glass-panel p-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-black mb-4">
                <video src={currentJob.videoUrl} controls className="w-full h-full" poster={currentJob.thumbnailUrl} />
              </div>
              <div className="flex items-center gap-3">
                <a href={currentJob.videoUrl} download className="btn-primary flex-1 justify-center">
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <button className="btn-secondary flex-1 justify-center">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="btn-secondary flex-1 justify-center">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {currentJob.status === "failed" && (
            <div className="glass-panel p-6 border-red-500/30">
              <p className="text-red-400 text-center mb-4">{currentJob.error || "Video generation failed"}</p>
              <button onClick={resetForm} className="btn-secondary w-full justify-center">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {/* New Video Button */}
          {currentJob.status === "complete" && (
            <button onClick={resetForm} className="btn-secondary w-full justify-center">
              <RefreshCw className="w-4 h-4" />
              Create Another Video
            </button>
          )}
        </div>
      )}
    </div>
  );
}
