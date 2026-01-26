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
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-sm">RE</span>
            </div>
            <span className="font-semibold tracking-tight">Real Easy Realty</span>
          </div>

          <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.04] rounded-lg">
            <button
              onClick={() => setView("studio")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "studio"
                  ? "bg-white/[0.08] text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setView("overview")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "overview"
                  ? "bg-white/[0.08] text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              Overview
            </button>
          </div>

          <button className="px-4 py-2 bg-white text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
            Sign in
          </button>
        </div>
      </nav>

      <main className="pt-16">
        {view === "studio" ? (
          /* ═══════════════════════════════════════════════════════════════
             STUDIO VIEW - VideoStudio is the hero
             ═══════════════════════════════════════════════════════════════ */
          <div className="max-w-[1280px] mx-auto px-6">
            {/* Hero Header */}
            <section className="pt-16 pb-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-400/[0.08] border border-emerald-400/20 rounded-full mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Remotion + Firecrawl + AI
                  </span>
                </div>

                <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-4">
                  Listing URL in.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                    Studio-grade video out.
                  </span>
                </h1>

                <p className="text-lg text-white/50 leading-relaxed max-w-xl">
                  Paste any property link. Our agentic pipeline scrapes the data, writes the script,
                  generates voiceover, and renders with Remotion—in minutes, not hours.
                </p>
              </div>
            </section>

            {/* Metrics Bar */}
            <section className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden mb-12">
              {METRICS.map((metric, i) => (
                <div key={i} className="bg-[#0A0A0A] p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-white/40">{metric.label}</div>
                  <div className="text-xs text-white/25">{metric.sublabel}</div>
                </div>
              ))}
            </section>

            {/* VideoStudio Component */}
            <section className="mb-24">
              <VideoStudio />
            </section>

            {/* Process Section */}
            <section className="py-24 border-t border-white/[0.06]">
              <div className="mb-16">
                <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                  How it works
                </h2>
                <p className="text-2xl md:text-3xl font-semibold leading-tight max-w-lg">
                  Three steps from URL to deployment-ready video.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {PROCESS.map((step, i) => (
                  <div key={i} className="group">
                    <div className="text-5xl font-bold text-white/[0.06] mb-4 group-hover:text-white/[0.12] transition-colors">
                      {step.num}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonial */}
            <section className="py-24 border-t border-white/[0.06]">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center gap-1 mb-8">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                  "{TESTIMONIAL.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{TESTIMONIAL.author}</div>
                  <div className="text-sm text-white/40">
                    {TESTIMONIAL.role}, {TESTIMONIAL.company}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             OVERVIEW VIEW - Features, pricing, conversion
             ═══════════════════════════════════════════════════════════════ */
          <div>
            {/* Hero */}
            <section className="max-w-[1280px] mx-auto px-6 pt-24 pb-32">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full mb-6">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-medium text-white/60">
                      Video-as-Code Production
                    </span>
                  </div>

                  <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.05] tracking-tight mb-6">
                    The death of
                    <br />
                    manual editing.
                  </h1>

                  <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-md">
                    Traditional video production is operational debt. Our agentic pipeline
                    transforms natural language into studio-quality motion graphics.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setView("studio")}
                      className="px-6 py-3 bg-white text-[#0A0A0A] rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Open Studio <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-6 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg font-semibold hover:bg-white/[0.08] transition-colors">
                      Watch demo
                    </button>
                  </div>
                </div>

                {/* Hero Visual */}
                <div className="relative">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center cursor-pointer hover:bg-white/[0.12] transition-colors">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                      backgroundSize: '40px 40px'
                    }} />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-[#0A0A0A] border border-white/[0.08] rounded-lg">
                    <div className="text-xs text-white/40 mb-0.5">Render time</div>
                    <div className="text-lg font-bold">4.2 seconds</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Value Props */}
            <section className="border-t border-white/[0.06] py-24">
              <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: Globe, title: "Universal Scraping", desc: "Zillow, Redfin, Realtor, MLS—any listing URL works." },
                    { icon: Video, title: "React-Based Rendering", desc: "Remotion compiles every frame programmatically." },
                    { icon: Mic, title: "5 Voice Styles", desc: "11Labs integration for natural, professional narration." },
                    { icon: BarChart3, title: "Analytics Ready", desc: "Track engagement, A/B test, and optimize." },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="group">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-colors">
                          <Icon className="w-5 h-5 text-white/60" />
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Comparison */}
            <section className="border-t border-white/[0.06] py-24">
              <div className="max-w-[1280px] mx-auto px-6">
                <div className="max-w-xl mb-16">
                  <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                    The strategic flip
                  </h2>
                  <p className="text-2xl md:text-3xl font-semibold leading-tight">
                    Manual editing is linear. Agentic production is infinite.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
                  {/* Legacy */}
                  <div className="bg-[#0A0A0A] p-8">
                    <div className="text-xs font-medium text-white/30 uppercase tracking-wider mb-6">
                      Legacy Model
                    </div>
                    <ul className="space-y-4">
                      {[
                        "Hours of manual keyframing",
                        "High headcount & agency fees",
                        "Linear scaling (more content = more staff)",
                        "Static, brittle video files",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/40">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Agentic */}
                  <div className="bg-emerald-400/[0.03] p-8 border-l border-emerald-400/20">
                    <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-6">
                      Agentic Model
                    </div>
                    <ul className="space-y-4">
                      {[
                        "Minutes via natural language",
                        "Fixed API & compute costs",
                        "Infinite scaling (data-driven automation)",
                        "Reusable, modular React components",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="border-t border-white/[0.06] py-24">
              <div className="max-w-[1280px] mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                    Simple, transparent pricing
                  </h2>
                  <p className="text-white/40">
                    Start free. Scale as you grow.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden max-w-4xl mx-auto">
                  {PLANS.map((plan, i) => (
                    <div
                      key={i}
                      className={`p-8 ${plan.featured ? 'bg-white/[0.04]' : 'bg-[#0A0A0A]'}`}
                    >
                      {plan.featured && (
                        <div className="text-xs font-medium text-cyan-400 uppercase tracking-wider mb-4">
                          Most popular
                        </div>
                      )}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                        <p className="text-sm text-white/40">{plan.desc}</p>
                      </div>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">
                          {plan.price === "Custom" ? "" : "$"}{plan.price}
                        </span>
                        {plan.price !== "Custom" && (
                          <span className="text-white/40">/mo</span>
                        )}
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                          plan.featured
                            ? 'bg-white text-[#0A0A0A] hover:bg-white/90'
                            : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]'
                        }`}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/[0.06] py-24">
              <div className="max-w-[1280px] mx-auto px-6 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  Ready to automate your video production?
                </h2>
                <p className="text-white/40 mb-8 max-w-md mx-auto">
                  Join 2,100+ real estate professionals who've made the switch.
                </p>
                <button
                  onClick={() => setView("studio")}
                  className="px-8 py-3 bg-white text-[#0A0A0A] rounded-lg font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                >
                  Open Video Studio <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold text-[10px]">RE</span>
              </div>
              <span className="text-sm text-white/40">Real Easy Realty</span>
            </div>
            <div className="text-sm text-white/30">
              © 2026 Real Easy Realty. Built with Remotion.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
