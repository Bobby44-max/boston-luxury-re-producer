"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import {
  User,
  Video,
  Loader2,
  LogOut,
  Sparkles,
  Play,
  Download,
  Volume2,
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
  const { signOut } = useClerk();
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

      // Poll for video completion
      if (data.videoId) {
        pollForVideo(data.videoId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setIsGenerating(false);
    }
  };

  const pollForVideo = async (videoId: string) => {
    const maxAttempts = 60; // 5 minutes max
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
          setTimeout(poll, 5000); // Poll every 5 seconds
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

  // Show loading spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center relative z-10">
        <div className="glass-panel p-12 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
            <Video className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold mb-2">AI Avatar Generator</h1>
          <p className="text-white/40 mb-8">
            Sign in to create AI-powered video avatars for your listings
          </p>

          <Link
            href="/sign-in"
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all mb-4"
          >
            Sign In to Continue
          </Link>

          <Link
            href="/tools"
            className="text-white/50 hover:text-white text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Use AI Tools Without Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated view
  return (
    <div className="min-h-screen bg-[#09090B] text-white relative z-10 pb-12">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-violet-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">
                  Apex Real Estate
                </h1>
                <p className="text-xs text-white/40">AI Avatar Studio</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-white/50" />
              )}
              <span className="text-sm text-white/70">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
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
                  <p className="text-white/50">
                    Generating your avatar video...
                  </p>
                  <p className="text-xs text-white/30 mt-2">
                    This may take 1-3 minutes
                  </p>
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
                  <p className="text-white/30">
                    Your video preview will appear here
                  </p>
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
