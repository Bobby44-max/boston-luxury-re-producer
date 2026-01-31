"use client";

import Link from "next/link";
import {
  Video,
  Play,
  ArrowRight,
  Check,
  Zap,
  Globe,
  Mic,
  Star,
  BarChart3,
  Sparkles,
  Volume2,
} from "lucide-react";

// Metrics data
const METRICS = [
  { value: "4.2s", label: "Avg. render time", sublabel: "per 30s video" },
  { value: "340%", label: "Engagement lift", sublabel: "vs. static listings" },
  { value: "12K+", label: "Videos rendered", sublabel: "this quarter" },
];

// Features
const FEATURES = [
  {
    title: "Agentic Scraping",
    desc: "Zillow, Redfin, or bespoke agency portals—we extract every high-res asset and meta detail automatically.",
    icon: "🔗",
  },
  {
    title: "Editorial Copy",
    desc: "Gemini-powered scripts that move beyond features to describe the lifestyle and aura of the estate.",
    icon: "✨",
  },
  {
    title: "Cinematic Rendering",
    desc: "Remotion engine delivering 60fps glassmorphic overlays and studio-grade transitions in real-time.",
    icon: "🎬",
  },
  {
    title: "Omni-Channel Ops",
    desc: "9:16 for high-impact social, 16:9 for theater viewing. All optimized for conversion.",
    icon: "📱",
  },
  {
    title: "Brand Sovereignty",
    desc: "Persistent high-fidelity branding. Your font, your gold, your logo. No compromises.",
    icon: "🏷️",
  },
  {
    title: "Market Analysis",
    desc: "Real-time thermal data mapping and emerging luxury zone identification built into every clip.",
    icon: "📈",
  },
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

export default function MarketingHomePage() {
  return (
    <div className="relative z-10 overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-start gap-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest animate-fade-in">
              <Sparkles className="w-3 h-3" />
              Aura × Gemini Unified
            </div>

            <h1 className="text-7xl md:text-9xl font-bold font-syne leading-[0.9] tracking-tighter reveal animate-slide-up">
              Listing URL in. <br />
              <span className="gradient-gold">Studio-grade</span> <br />
              video out.
            </h1>

            <p className="text-xl md:text-2xl text-white/40 max-w-2xl mt-4 leading-relaxed reveal animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Our agentic pipeline scrapes the data, writes the script, generates voiceover,
              and renders with Remotion—in minutes, not hours.
            </p>

            <div className="flex flex-wrap gap-4 mt-8 reveal animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/studio"
                className="flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all text-lg"
              >
                Open Video Studio
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/studio"
                className="flex items-center gap-3 px-10 py-5 bg-transparent text-white font-bold rounded-full border border-white/20 hover:bg-white/10 transition-all text-lg backdrop-blur-sm"
              >
                <Video className="w-5 h-5 text-amber-500" />
                Watch Demo
              </Link>
            </div>
          </div>

          {/* AI Concierge Aura Bubble (Decorative for Landing) */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full hidden lg:block pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/20 via-transparent to-cyan-500/20 border border-white/10 backdrop-blur-3xl animate-pulse" />
              <div className="absolute w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px]" />
              <div className="absolute p-8 glass-panel-ultra border-amber-500/30 w-80 text-center animate-bounce duration-[4000ms]">
                <Volume2 className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-sm font-medium font-syne uppercase tracking-wider text-amber-500">AI Concierge</p>
                <p className="text-white/60 mt-2">"Welcome, Agent. How can I assist with your luxury market analysis today?"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="max-w-6xl mx-auto px-8 mb-20">
        <div className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-[32px] overflow-hidden">
          {METRICS.map((metric, i) => (
            <div key={i} className="bg-white/[0.02] backdrop-blur-md p-10 text-center relative group hover:bg-white/[0.04] transition-all">
              <div className="text-4xl md:text-5xl font-bold font-syne tracking-tighter text-white mb-2 group-hover:scale-110 transition-transform">{metric.value}</div>
              <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">{metric.label}</div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{metric.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold font-syne tracking-tighter">Market <span className="text-white/30">Intelligence.</span></h2>
              <p className="text-xl text-white/40 mt-4 max-w-xl">Deep domain expertise distilled into automated, cinematic sequences.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass-card-luxury p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all"
              >
                <div className="text-4xl mb-6 opacity-80 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold font-syne mb-3 tracking-tighter uppercase">{feature.title}</h3>
                <p className="text-lg text-white/40 leading-relaxed group-hover:text-white/60 transition-colors font-medium">{feature.desc}</p>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/5 py-32 px-8">
        <div className="max-w-6xl mx-auto">
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
                  <span className="text-5xl font-bold font-syne tracking-tighter text-white">
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
                <Link
                  href="/studio"
                  className={`block w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all text-center ${plan.featured
                    ? 'bg-white text-black hover:bg-neutral-200 shadow-xl'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/80'
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-[64px] bg-amber-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold font-syne tracking-tighter uppercase leading-[0.95] mb-8 text-black">
              Initiate Asset <br /> <span className="text-black/40">Automation.</span>
            </h2>
            <p className="text-lg font-bold uppercase tracking-widest mb-10 text-black opacity-60">
              Secure your competitive edge in the luxury indices.
            </p>
            <Link
              href="/studio"
              className="px-12 py-6 bg-black text-white rounded-full font-bold uppercase tracking-[0.3em] text-xs hover:scale-105 transition-transform inline-flex items-center gap-3"
            >
              Acquire Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
