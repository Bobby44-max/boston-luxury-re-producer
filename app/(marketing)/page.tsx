"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Play,
  Sparkles,
  Globe,
  Wand2,
  Film,
  Clock,
  CheckCircle2,
  Loader2,
  Volume2,
  Zap,
} from "lucide-react";

const VIDEO_TYPES = [
  {
    id: "property-showcase",
    name: "Property Showcase",
    duration: "30s",
    aspect: "16:9",
    desc: "Cinematic property tour with AI voiceover",
  },
  {
    id: "social-short",
    name: "Social Short",
    duration: "9s",
    aspect: "9:16",
    desc: "TikTok & Reels optimized vertical",
  },
  {
    id: "just-listed",
    name: "Just Listed",
    duration: "12s",
    aspect: "9:16",
    desc: "New listing announcement",
  },
];

const WORKFLOW_STEPS = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Paste URL",
    desc: "Any Zillow, Redfin, or MLS link",
  },
  {
    icon: <Wand2 className="w-5 h-5" />,
    title: "AI Extracts",
    desc: "Photos, specs & description",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Script Written",
    desc: "Gemini crafts the narrative",
  },
  {
    icon: <Film className="w-5 h-5" />,
    title: "Video Rendered",
    desc: "Cinema-grade Remotion output",
  },
];

export default function MarketingPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [selectedType, setSelectedType] = useState("property-showcase");
  const [isHovering, setIsHovering] = useState(false);

  // Reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleGenerate = () => {
    if (!url.trim()) return;
    router.push(`/studio?url=${encodeURIComponent(url)}&type=${selectedType}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && url.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center reveal">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-white/50 tracking-wide">
              Remotion Video Engine · Live
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[3.5rem] md:text-[4.5rem] leading-[1.05] font-bold tracking-tight mb-6">
            Listing URL to
            <br />
            <span className="gradient-gold-premium">Video in Minutes</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg text-white/40 max-w-lg mx-auto mb-12 leading-relaxed">
            Paste any real estate listing. Get a professionally narrated,
            beautifully rendered marketing video.
          </p>

          {/* URL Input */}
          <div className="max-w-xl mx-auto mb-8">
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                isHovering ? "bg-white/[0.04]" : "bg-white/[0.02]"
              } border border-white/[0.06] hover:border-white/[0.12]`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="flex items-center">
                <div className="pl-5">
                  <Globe className="w-5 h-5 text-white/20" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste Zillow, Redfin, or any listing URL..."
                  className="flex-1 bg-transparent py-5 px-4 text-[15px] text-white placeholder:text-white/25 focus:outline-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!url.trim()}
                  className={`m-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                    url.trim()
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  Generate
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Video Type Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {VIDEO_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                  selectedType === type.id
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/40 hover:text-white/60 border border-transparent"
                }`}
              >
                {type.name}
                <span className="ml-1.5 text-white/30">{type.duration}</span>
              </button>
            ))}
          </div>

          {/* Trust Row */}
          <div className="flex items-center justify-center gap-8 text-[13px] text-white/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
              <span>No watermarks</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>~2 min render</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>4K quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-20 px-6 reveal">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <div
                key={i}
                className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:border-white/[0.1] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 text-white/40 group-hover:text-white/60 transition-colors">
                  {step.icon}
                </div>
                <div className="text-[10px] font-bold text-white/20 tracking-widest mb-1.5">
                  STEP {i + 1}
                </div>
                <div className="font-semibold text-sm mb-1">{step.title}</div>
                <div className="text-xs text-white/30">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Types Section */}
      <section className="py-20 px-6 border-t border-white/[0.04] reveal">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Choose Your Format
            </h2>
            <p className="text-white/40">
              Optimized for every platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {VIDEO_TYPES.map((type) => (
              <div
                key={type.id}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      type.aspect === "16:9"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    <Film className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-white/20">
                    {type.aspect}
                  </span>
                </div>
                <h3 className="font-bold mb-1.5">{type.name}</h3>
                <p className="text-sm text-white/30 mb-4">{type.desc}</p>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Clock className="w-3.5 h-3.5" />
                  {type.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 border-t border-white/[0.04] reveal">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-xs font-medium text-white/30">Powered by</span>
            <div className="flex items-center gap-4 text-sm font-medium text-white/50">
              <span>Firecrawl</span>
              <span className="text-white/10">·</span>
              <span>Gemini</span>
              <span className="text-white/10">·</span>
              <span>OpenAI TTS</span>
              <span className="text-white/10">·</span>
              <span>Remotion</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/[0.04] reveal">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Create?
          </h2>
          <p className="text-white/40 mb-8">
            Transform your next listing into cinema.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
          >
            <Play className="w-4 h-4" />
            Open Studio
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <span>&copy; 2026 Apex Luxury Intelligence Suite</span>
          <span>Real Estate Video Generation</span>
        </div>
      </footer>
    </div>
  );
}
