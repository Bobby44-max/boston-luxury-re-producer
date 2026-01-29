"use client";

import React, { useState } from "react";
import {
  Video,
  Play,
  ArrowRight,
  Check,
  Zap,
  Globe,
  Mic,
  ChevronRight,
  Star,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import VideoStudio from "@/components/VideoStudio";

// Metrics data
const METRICS = [
  { value: "4.2s", label: "Avg. render time", sublabel: "per 30s video" },
  { value: "340%", label: "Engagement lift", sublabel: "vs. static listings" },
  { value: "12K+", label: "Videos rendered", sublabel: "this quarter" },
];

// Process steps
const PROCESS = [
  {
    num: "01",
    title: "Paste any listing URL",
    desc: "Zillow, Redfin, Realtor.com, or direct MLS links. Our Firecrawl engine extracts everything.",
  },
  {
    num: "02",
    title: "AI builds your narrative",
    desc: "Property features become compelling scripts. Choose from 5 professional voice styles.",
  },
  {
    num: "03",
    title: "Remotion renders in minutes",
    desc: "React-based video generation. Every frame programmatically perfect, ready to deploy.",
  },
];

// Testimonial
const TESTIMONIAL = {
  quote: "We replaced our entire video production workflow. What took our team 6 hours now takes 4 minutes.",
  author: "Sarah Chen",
  role: "Director of Marketing",
  company: "Beacon Hill Properties",
};

// Pricing
const PLANS = [
  {
    name: "Essential",
    price: "49",
    desc: "For individual agents",
    features: ["10 videos/month", "720p export", "3 templates", "Email support"],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Professional",
    price: "149",
    desc: "For growing teams",
    features: ["Unlimited videos", "4K export", "All templates", "AI voiceover", "Priority support", "Custom branding"],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For brokerages",
    features: ["Everything in Pro", "Unlimited seats", "API access", "White-label", "Dedicated CSM", "SLA guarantee"],
    cta: "Contact sales",
    featured: false,
  },
];

export default function ToolsPage() {
  const [view, setView] = useState<"studio" | "overview">("studio");

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] relative overflow-hidden font-sans">
      {/* Ambient Auras */}
      <div className="aura-glow-gold -top-24 -left-24 opacity-20" />
      <div className="aura-glow-cyan bottom-0 -right-24 opacity-10" />

      {/* Sub-Navigation / Tabs */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 backdrop-blur-2xl rounded-full shadow-2xl">
          <button
            onClick={() => setView("studio")}
            className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${view === "studio"
              ? "bg-white text-black shadow-lg"
              : "text-white/40 hover:text-white/60"
              }`}
          >
            Studio
          </button>
          <button
            onClick={() => setView("overview")}
            className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${view === "overview"
              ? "bg-white text-black shadow-lg"
              : "text-white/40 hover:text-white/60"
              }`}
          >
            Overview
          </button>
        </div>
      </div>

      <main className="pt-32 relative z-10">
        {view === "studio" ? (
          /* ═══════════════════════════════════════════════════════════════
             STUDIO VIEW
             ═══════════════════════════════════════════════════════════════ */
          <div className="max-w-7xl mx-auto px-8">
            {/* Hero Header */}
            <section className="pt-16 pb-16 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-500/[0.05] border border-amber-500/10 rounded-full mb-8">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">
                    Aura Engine × Gemini Intelligence
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-syne tracking-tighter leading-[0.95] mb-8 uppercase">
                  Listing <span className="text-white/20">Input.</span>
                  <br />
                  <span className="gradient-gold">Luxury Asset.</span>
                </h1>

                <p className="text-xl text-white/40 leading-relaxed max-w-2xl mx-auto font-medium">
                  Transform any property URL into high-fidelity cinematic media.
                  Scripted, narrated, and rendered by our autonomous luxury pipeline.
                </p>
              </div>
            </section>

            {/* Metrics Bar */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-[32px] overflow-hidden mb-20 bg-white/[0.01] backdrop-blur-md">
              {METRICS.map((metric, i) => (
                <div key={i} className="p-10 text-center relative group hover:bg-white/[0.02] transition-colors">
                  <div className="text-4xl md:text-5xl font-bold font-syne tracking-tighter mb-2 group-hover:scale-110 transition-transform">{metric.value}</div>
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">{metric.label}</div>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{metric.sublabel}</div>
                </div>
              ))}
            </section>

            {/* VideoStudio Component */}
            <section className="mb-32">
              <div className="glass-panel-ultra p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent border-white/10 shadow-2xl">
                <div className="rounded-[38px] overflow-hidden bg-black/60 backdrop-blur-3xl">
                  <VideoStudio />
                </div>
              </div>
            </section>

            {/* Process Section */}
            <section className="py-32 border-t border-white/5">
              <div className="mb-20">
                <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">
                  The Protocol
                </h2>
                <p className="text-4xl md:text-5xl font-bold font-syne tracking-tighter uppercase leading-[0.95]">
                  Automated <span className="text-white/20">Intelligence.</span>
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                {PROCESS.map((step, i) => (
                  <div key={i} className="group glass-card-luxury p-10 border-white/5 bg-white/[0.01]">
                    <div className="text-7xl font-bold font-syne text-white/[0.03] mb-6 group-hover:text-amber-500/10 transition-colors">
                      {step.num}
                    </div>
                    <h3 className="text-2xl font-bold font-syne tracking-tight mb-4 uppercase">{step.title}</h3>
                    <p className="text-lg text-white/40 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonial */}
            <section className="py-32 border-t border-white/5">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-1.5 mb-10">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <blockquote className="text-3xl md:text-4xl font-syne font-bold leading-tight uppercase tracking-tighter mb-12">
                  <span className="text-white/20">"</span>{TESTIMONIAL.quote}<span className="text-white/20">"</span>
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white/20" />
                  </div>
                  <div className="font-bold font-syne tracking-widest uppercase">{TESTIMONIAL.author}</div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">
                    {TESTIMONIAL.role} — {TESTIMONIAL.company}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             OVERVIEW VIEW
             ═══════════════════════════════════════════════════════════════ */
          <div className="max-w-7xl mx-auto px-8 pb-32">
            {/* Hero */}
            <section className="pt-24 pb-32">
              <div className="grid lg:grid-cols-2 gap-24 items-center">
                <div>
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-10">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                      Non-Linear Production Suite
                    </span>
                  </div>

                  <h1 className="text-6xl md:text-8xl font-bold font-syne tracking-tighter leading-[0.85] mb-10 uppercase">
                    The end of
                    <br />
                    <span className="text-white/20">Legacy</span> Edit.
                  </h1>

                  <p className="text-xl text-white/40 leading-relaxed mb-12 max-w-lg font-medium">
                    Manual production is operational drag. Our ecosystem converts
                    raw data into studio-grade intelligence assets at scale.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setView("studio")}
                      className="px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                      Enter Studio <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all text-white/60">
                      View Dossier
                    </button>
                  </div>
                </div>

                {/* Hero Visual */}
                <div className="relative">
                  <div className="aspect-square rounded-[48px] bg-white/[0.01] border border-white/5 overflow-hidden shadow-2xl group flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
                    <div className="relative z-10 w-24 h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform duration-500">
                      <Play className="w-8 h-8 text-amber-500 ml-1" />
                    </div>
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                      backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                      backgroundSize: '80px 80px'
                    }} />

                    {/* Decorative aura bubble */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full animate-pulse" />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-8 -left-8 p-8 glass-panel-ultra border-white/10 bg-black/40 shadow-2xl">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-2 font-syne">Synthetics latency</div>
                    <div className="text-3xl font-bold font-syne tracking-tighter">4.20s <span className="text-amber-500 font-sans text-sm font-bold">AVG.</span></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Value Props */}
            <section className="border-t border-white/5 py-32">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  { icon: Globe, title: "Data Ingestion", desc: "Universal scraping of all major real estate indices via Firecrawl." },
                  { icon: Video, title: "Code-to-Asset", desc: "Remotion compiles every frame programmatically for pixel perfection." },
                  { icon: Mic, title: "Neural Audio", desc: "Studio-grade neural voice synthesis for authoritative narration." },
                  { icon: BarChart3, title: "Intelligence IQ", desc: "Embedded analytics layer to track high-net-worth engagement." },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="group">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                        <Icon className="w-6 h-6 text-white/20 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <h3 className="font-bold underline decoration-amber-500/30 underline-offset-8 mb-6 uppercase tracking-tighter font-syne text-xl">{item.title}</h3>
                      <p className="text-lg text-white/40 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Comparison */}
            <section className="border-t border-white/5 py-32">
              <div className="max-w-2xl mb-20">
                <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">
                  The Paradigm Shift
                </h2>
                <p className="text-4xl md:text-5xl font-bold font-syne tracking-tighter uppercase leading-[0.95]">
                  From Production <span className="text-white/20">Debt</span> <br /> to <span className="gradient-gold">Asset Intelligence.</span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Legacy */}
                <div className="glass-panel-ultra p-12 border-white/5 bg-white/[0.01]">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-10">
                    Legacy Workflow
                  </div>
                  <ul className="space-y-6">
                    {[
                      "Manual editing & keyframing fatigue",
                      "Fragmented agency communication",
                      "Heavy operational overhead per asset",
                      "Static, non-adaptable deliverables",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-2 shrink-0" />
                        <span className="text-lg font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Agentic */}
                <div className="glass-panel-ultra p-12 border-amber-500/20 bg-amber-500/[0.02]">
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mb-10">
                    Apex Architecture
                  </div>
                  <ul className="space-y-6">
                    {[
                      "Zero-latency automated synthesis",
                      "Fixed compute-based asset costs",
                      "Infinite scalability via URL ingress",
                      "Programmatic React-based modularity",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <Check className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                        <span className="text-lg font-bold text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="border-t border-white/5 py-32">
              <div className="text-center mb-24">
                <h2 className="text-5xl font-bold font-syne tracking-tighter uppercase mb-6">
                  Intelligence <span className="text-white/20">Access.</span>
                </h2>
                <p className="text-white/40 font-medium tracking-widest text-[10px] uppercase">
                  Institutional-grade precision for every scale.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {PLANS.map((plan, i) => (
                  <div
                    key={i}
                    className={`p-10 rounded-[32px] border relative transition-all duration-500 hover:scale-[1.02] ${plan.featured ? 'bg-white/[0.02] border-amber-500/30' : 'bg-white/[0.01] border-white/5'}`}
                  >
                    {plan.featured && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-amber-500 rounded-full">
                        <span className="text-[10px] font-bold text-black uppercase tracking-widest">Selected Choice</span>
                      </div>
                    )}
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold font-syne tracking-tight mb-2 uppercase">{plan.name}</h3>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{plan.desc}</p>
                    </div>
                    <div className="mb-10">
                      <span className="text-5xl font-bold font-syne tracking-tighter">
                        {plan.price === "Custom" ? "" : "$"}{plan.price}
                      </span>
                      {plan.price !== "Custom" && (
                        <span className="text-white/20 text-xs font-bold ml-2">/ MTH</span>
                      )}
                    </div>
                    <ul className="space-y-5 mb-12">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/40">
                          <Check className="w-4 h-4 text-amber-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${plan.featured
                        ? 'bg-white text-black hover:bg-neutral-200 shadow-xl'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/80'
                        }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-amber-500 text-black rounded-[64px] relative overflow-hidden text-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-2xl mx-auto px-8">
                <h2 className="text-5xl md:text-6xl font-bold font-syne tracking-tighter uppercase leading-[0.95] mb-8">
                  Initiate Asset <br /> <span className="text-black/40">Automation.</span>
                </h2>
                <p className="text-lg font-bold uppercase tracking-widest mb-10 opacity-60">
                  Secure your competitive edge in the luxury indices.
                </p>
                <button
                  onClick={() => setView("studio")}
                  className="px-12 py-6 bg-black text-white rounded-full font-bold uppercase tracking-[0.3em] text-xs hover:scale-105 transition-transform inline-flex items-center gap-3"
                >
                  Acquire Access <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="py-20 px-8 border-t border-white/5 opacity-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="font-syne font-bold uppercase tracking-tighter text-white">Apex Luxury</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">Automated Intelligence × 2026 Protocol</p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
