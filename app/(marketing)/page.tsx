"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Video,
  ArrowRight,
  Check,
  Sparkles,
  Volume2,
  Layers,
  Zap,
  Shield,
  BarChart3,
  Cpu,
  Globe,
} from "lucide-react";

// Metrics data
const METRICS = [
  { value: "4.2s", label: "Render Velocity" },
  { value: "340%", label: "Engagement Lift" },
  { value: "12K+", label: "Assets Synthesized" },
];

// Features for Bento Grid
const BENTO_FEATURES = [
  {
    title: "Agentic Scraping",
    desc: "Autonomous Firecrawl extraction from Zillow, Redfin, and private MLS nodes.",
    icon: <Globe className="w-8 h-8 text-cyan-400" />,
    className: "col-span-2 row-span-1 bento-item bg-white/[0.02] border border-white/5",
  },
  {
    title: "Lifestyle Copy",
    desc: "Gemini-powered narratives that capture the 'aura' of elite properties.",
    icon: <Sparkles className="w-8 h-8 text-amber-400" />,
    className: "col-span-2 row-span-1 bento-item bg-white/[0.02] border border-white/5",
  },
  {
    title: "Glassmorphic Motion",
    desc: "Remotion-driven 60fps cinematic overlays.",
    icon: <Layers className="w-8 h-8 text-indigo-400" />,
    className: "col-span-1 row-span-1 bento-item bg-white/[0.02] border border-white/5",
  },
  {
    title: "Global Reach",
    desc: "Instant multi-format deployment for any channel.",
    icon: <Cpu className="w-8 h-8 text-rose-400" />,
    className: "col-span-2 row-span-1 bento-item bg-white/[0.02] border border-white/5",
  },
  {
    title: "Brand Sovereignty",
    desc: "Your identity, automated.",
    icon: <Shield className="w-8 h-8 text-emerald-400" />,
    className: "col-span-1 row-span-1 bento-item bg-white/[0.02] border border-white/5",
  },
];

export default function MarketingHomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Light-tracking effect
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".premium-glass");
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/10">
      {/* Hero Section */}
      <section className="relative pt-64 pb-40 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] reveal mb-10 text-white/60">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Intelligence Layer v4.0
          </div>

          <h1 className="text-8xl md:text-[11rem] leading-[0.85] tracking-tighter reveal mb-12">
            Instant <br />
            <span className="gradient-gold-premium">Masterpiece</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/40 leading-relaxed reveal mb-16 font-medium">
            Turn any listing URL into a cinematic production. Our agentic studio handles the script, voice, and rendering in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal">
            <Link href="/studio" className="btn-premium btn-premium-solid">
              Acquire Access <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="btn-premium btn-premium-outline">
              Review Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-1 bg-white/5 rounded-[48px] overflow-hidden premium-glass border-white/5 shadow-2xl">
            {METRICS.map((metric, i) => (
              <div key={i} className="bg-black/40 backdrop-blur-xl p-16 text-center group transition-all hover:bg-white/[0.02]">
                <div className="text-6xl md:text-7xl font-bold font-syne tracking-tighter mb-4 transition-transform group-hover:scale-105">{metric.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 reveal">
            <div>
              <h2 className="text-6xl md:text-8xl tracking-tighter leading-none mb-6">
                Engineered <br />
                <span className="text-white/20">Excellence.</span>
              </h2>
              <p className="text-xl text-white/40 max-w-xl font-medium">
                The fusion of agentic intelligence and programmatic rendering.
              </p>
            </div>
          </div>

          <div className="bento-grid grid-cols-1 md:grid-cols-4 reveal">
            {BENTO_FEATURES.map((feature, i) => (
              <div key={i} className={`${feature.className} premium-glass group hover:border-white/20 transition-all duration-500`}>
                <div className="mb-8 p-4 rounded-2xl bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-syne uppercase tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-lg text-white/30 font-medium leading-relaxed group-hover:text-white/60 transition-colors">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-40 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="reveal">
              <h2 className="text-5xl md:text-7xl tracking-tighter leading-tight mb-8">
                The New <br /> Standard.
              </h2>
              <ul className="space-y-8">
                {[
                  { title: "Universal Intake", desc: "Paste any URL from Zillow or Redfin." },
                  { title: "Synthetic Narrative", desc: "AI builds a localized script automatically." },
                  { title: "Cloud Synthesis", desc: "High-spec Remotion instances render in 4K." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-500 font-bold group-hover:bg-white/10 transition-all">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold uppercase tracking-tight mb-2">{item.title}</h4>
                      <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative reveal">
              <div className="aspect-square rounded-[64px] bg-gradient-to-br from-indigo-500/20 via-transparent to-rose-500/20 premium-glass border-white/5 flex items-center justify-center animate-pulse">
                <Volume2 className="w-32 h-32 text-white/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute -bottom-12 -right-12 p-10 premium-glass rounded-[40px] border-white/10 bg-black/60 backdrop-blur-3xl shadow-2xl max-w-xs animate-bounce duration-[6000ms]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-4">AI Concierge</p>
                <p className="text-lg font-medium text-white/80 leading-relaxed italic animate-pulse">
                  "Your listing for 42 Beacon St has been successfully synthesized."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Access Section */}
      <section id="pricing" className="py-60 px-8 bg-neutral-950/20 relative">
        <div className="max-w-7xl mx-auto text-center reveal">
          <h2 className="text-6xl md:text-[9rem] tracking-tighter leading-none mb-12">
            Ready to <br />
            <span className="text-white/20">Synthesize?</span>
          </h2>
          <div className="max-w-3xl mx-auto p-16 premium-glass rounded-[64px] border-white/10 bg-white/[0.01] shadow-2xl">
            <h3 className="text-4xl font-bold font-syne uppercase tracking-tight mb-8">Professional License</h3>
            <p className="text-xl text-white/40 mb-12 leading-relaxed">
              Unlock unlimited 4K renders, agentic scraping, and institutional-grade branding across all platforms.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/studio" className="btn-premium btn-premium-solid w-full sm:w-auto">
                Begin Activation
              </Link>
              <Link href="/studio" className="btn-premium btn-premium-outline w-full sm:w-auto">
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer Decoration */}
      <div className="py-20 text-center border-t border-white/5 reveal">
        <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/10">
          Apex Luxury Intelligence Suite &copy; 2026
        </p>
      </div>
    </div>
  );
}
