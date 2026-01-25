"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  User,
  Video,
  Loader2,
  Sparkles,
  Play,
  Download,
  Volume2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

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

export default function HomePage() {
  const { user, isLoaded, isSignedIn } = useUser();
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  // Landing page for non-authenticated users
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Real Estate Marketing
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Real Easy Realty
              </span>
              <br />
              <span className="text-white/90">Video in Minutes</span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
              Paste any listing URL. Get a stunning marketing video with AI voiceover.
              No filming. No editing. Just results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tools"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
              >
                Try AI Video Studio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/tools"
                className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white/70 font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <Video className="w-5 h-5" />
                Explore Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Why Realtors Love Us
            </h2>
            <p className="text-white/50 text-center mb-16 max-w-2xl mx-auto">
              Stop wasting hours on video production. We handle everything from data extraction to final render.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Paste Any URL",
                  desc: "Zillow, Redfin, Realtor.com - we extract everything automatically",
                  icon: "🔗",
                  color: "from-emerald-500/20 to-emerald-500/5",
                },
                {
                  title: "AI Script Writer",
                  desc: "Gemini generates compelling scripts tailored to each property",
                  icon: "✨",
                  color: "from-cyan-500/20 to-cyan-500/5",
                },
                {
                  title: "Pro Voiceover",
                  desc: "5 premium AI voices that sound natural and professional",
                  icon: "🎙️",
                  color: "from-violet-500/20 to-violet-500/5",
                },
                {
                  title: "Stunning Animations",
                  desc: "Remotion renders cinematic videos with smooth transitions",
                  icon: "🎬",
                  color: "from-pink-500/20 to-pink-500/5",
                },
                {
                  title: "Multiple Formats",
                  desc: "16:9 for YouTube, 9:16 for TikTok & Reels, all in one click",
                  icon: "📱",
                  color: "from-orange-500/20 to-orange-500/5",
                },
                {
                  title: "Your Branding",
                  desc: "Add your logo, colors, and contact info to every video",
                  icon: "🏷️",
                  color: "from-emerald-500/20 to-emerald-500/5",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`glass-panel p-6 bg-gradient-to-br ${feature.color} border-white/5`}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center glass-panel p-12 bg-gradient-to-br from-emerald-500/10 to-violet-500/10">
            <h2 className="text-3xl font-bold mb-4">Ready to 10x Your Listings?</h2>
            <p className="text-white/50 mb-8">
              Join thousands of realtors using AI to create scroll-stopping content.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated view - Avatar Studio
  return (
    <div className="min-h-screen bg-[#09090B] text-white relative z-10 pb-12">
      <main className="pt-8 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="glass-panel p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create AI Avatar Video</h2>
                <p className="text-sm text-white/50">Powered by HeyGen</p>
              </div>
            </div>

            {/* Script Input */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
                Video Script
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your script here... (e.g., 'Welcome to this stunning property featuring 4 bedrooms and panoramic city views...')"
                className="glass-input w-full h-40 resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-white/30 mt-1">
                {script.length}/1000 characters
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-white/40 mb-3">
                Select Avatar
              </label>
              <div className="grid grid-cols-2 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedAvatar === avatar.id
                        ? "bg-violet-500/20 border-violet-500"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <User className="w-8 h-8 mb-2 text-white/50" />
                    <p className="font-semibold text-sm">{avatar.name}</p>
                    <p className="text-xs text-white/40">{avatar.style}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selection */}
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-wider text-white/40 mb-3">
                Select Voice
              </label>
              <div className="grid grid-cols-2 gap-3">
                {VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                      selectedVoice === voice.id
                        ? "bg-cyan-500/20 border-cyan-500"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Volume2 className="w-5 h-5 text-white/50" />
                    <div>
                      <p className="font-semibold text-sm">{voice.name}</p>
                      <p className="text-xs text-white/40">{voice.accent}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !script.trim()}
              className="btn-primary w-full justify-center py-4"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Avatar Video
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="glass-panel p-8 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>

            <div className="flex-1 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center min-h-[400px] overflow-hidden">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-violet-400 animate-spin mx-auto mb-4" />
                  <p className="text-white/50">Generating your avatar video...</p>
                  <p className="text-xs text-white/30 mt-2">This may take 1-3 minutes</p>
                </div>
              ) : videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30">Your video preview will appear here</p>
                </div>
              )}
            </div>

            {videoUrl && (
              <a
                href={videoUrl}
                download="avatar-video.mp4"
                className="mt-4 btn-secondary w-full justify-center"
              >
                <Download className="w-5 h-5" />
                Download Video
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
