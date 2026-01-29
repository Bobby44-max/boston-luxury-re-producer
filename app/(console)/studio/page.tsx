"use client";

import { useState } from "react";
import {
  User,
  Video,
  Loader2,
  Sparkles,
  Play,
  Download,
  Volume2,
} from "lucide-react";

// HeyGen Avatar options
const AVATARS = [
  { id: "josh_lite3_20230714", name: "Josh", style: "Professional Male" },
  { id: "anna_costume1_20220908", name: "Anna", style: "Professional Female" },
  { id: "tyler-incasualsuit-20220721", name: "Tyler", style: "Casual Male" },
  { id: "sophia_costume1_20220804", name: "Sophia", style: "Casual Female" },
];

const VOICES = [
  { id: "en-US-AriaNeural", name: "Aria", accent: "US Female" },
  { id: "en-US-GuyNeural", name: "Guy", accent: "US Male" },
  { id: "en-US-JennyNeural", name: "Jenny", accent: "US Female" },
  { id: "en-GB-RyanNeural", name: "Ryan", accent: "British Male" },
];

export default function StudioPage() {
  const [script, setScript] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!script.trim()) return;

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          avatarId: selectedAvatar,
          voiceId: selectedVoice,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate video");
      }

      if (data.videoId) {
        pollForVideo(data.videoId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setIsGenerating(false);
    }
  };

  const pollForVideo = async (videoId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      attempts++;
      try {
        const response = await fetch(`/api/avatar/status?videoId=${videoId}`);
        const data = await response.json();

        if (data.status === "completed" && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setIsGenerating(false);
        } else if (data.status === "failed") {
          setError("Video generation failed");
          setIsGenerating(false);
        } else if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setError("Video generation timed out");
          setIsGenerating(false);
        }
      } catch {
        setError("Failed to check video status");
        setIsGenerating(false);
      }
    };

    poll();
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-bold font-syne tracking-tighter uppercase">Intelligence <span className="text-white/20">Studio.</span></h1>
        <p className="text-white/40 mt-2 font-medium tracking-wide">Generate high-fidelity luxury assets with Aura × Gemini.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Input Panel */}
        <div className="glass-panel-ultra p-10 border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Video className="w-7 h-7 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-syne tracking-tight uppercase">AI Digital <span className="text-amber-500">Twin</span></h2>
              <p className="text-xs font-bold tracking-widest text-white/30 uppercase mt-1">Powered by HeyGen Engine</p>
            </div>
          </div>

          {/* Script Input */}
          <div className="mb-8">
            <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mb-3">
              Asset Narrative
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Define the narrative... (e.g., 'Discover an unparalleled architectural masterpiece...')"
              className="glass-input w-full h-48 resize-none bg-white/[0.02] border-white/10 rounded-2xl focus:border-amber-500 transition-all font-medium py-6 px-8"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-[10px] font-bold tracking-widest text-white/20">
                {script.length} / 1000
              </p>
              <div className="h-[2px] w-24 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(script.length / 1000) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="mb-8">
            <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mb-4">
              Persona Selection
            </label>
            <div className="grid grid-cols-2 gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${selectedAvatar === avatar.id
                    ? "bg-amber-500/10 border-amber-500"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20"
                    }`}
                >
                  <User className={`w-8 h-8 mb-4 transition-colors ${selectedAvatar === avatar.id ? "text-amber-500" : "text-white/20"}`} />
                  <p className="font-bold text-sm tracking-tight">{avatar.name}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{avatar.style}</p>
                  {selectedAvatar === avatar.id && (
                    <div className="absolute top-0 right-0 p-3">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="mb-10">
            <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mb-4">
              Tonal Character
            </label>
            <div className="grid grid-cols-2 gap-4">
              {VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`p-5 rounded-2xl border transition-all text-left flex items-center gap-4 ${selectedVoice === voice.id
                    ? "bg-amber-500/10 border-amber-500"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20"
                    }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${selectedVoice === voice.id ? "bg-amber-500 text-black" : "bg-white/5 text-white/20"}`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{voice.name}</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{voice.accent}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !script.trim()}
            className="w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-all relative overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white group-hover:bg-neutral-200 transition-colors" />
            <div className="relative flex items-center justify-center gap-3 text-black">
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Commence Generation
                </>
              )}
            </div>
          </button>

          {error && (
            <div className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col h-full">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-white/30">Asset Preview</h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="flex-1 rounded-[32px] bg-black border border-white/5 flex items-center justify-center min-h-[500px] overflow-hidden relative group shadow-2xl">
            {isGenerating ? (
              <div className="text-center relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-amber-500/20 blur-3xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto relative z-10" />
                </div>
                <p className="text-lg font-syne font-bold uppercase tracking-widest">Synthesizing Luxury</p>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mt-3">Est. Time: 60-180s</p>
              </div>
            ) : videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center group-hover:scale-105 transition-transform duration-700">
                <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center mx-auto mb-6 bg-white/[0.02]">
                  <Play className="w-8 h-8 text-white/10 group-hover:text-amber-500 transition-colors" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20">Await selection</p>
              </div>
            )}

            {/* Glass overlay hint */}
            <div className="absolute inset-0 border-[24px] border-black/20 pointer-events-none" />
          </div>

          {videoUrl && (
            <a
              href={videoUrl}
              download="luxury-asset.mp4"
              className="mt-8 flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
            >
              <Download className="w-4 h-4 text-amber-500" />
              Archive Intelligence
            </a>
          )}

          <div className="mt-8 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Aura Pro-Tip</h4>
                <p className="text-sm text-white/40 mt-1">High-fidelity renders are optimized for theatre viewing. Ensure your narrative aligns with the luxury archetype for maximum conversion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
