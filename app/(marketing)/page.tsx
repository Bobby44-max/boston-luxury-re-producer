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
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Remotion + Firecrawl + AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white/90">Listing URL in.</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Studio-grade video out.
            </span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
            Paste any property link. Our agentic pipeline scrapes the data, writes the script,
            generates voiceover, and renders with Remotion—in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
            >
              Open Video Studio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demo"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white/70 font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
          {METRICS.map((metric, i) => (
            <div key={i} className="bg-[#0A0A0A] p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-white/40">{metric.label}</div>
              <div className="text-xs text-white/25">{metric.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Realtors Love Us
          </h2>
          <p className="text-white/50 text-center mb-16 max-w-2xl mx-auto">
            Stop wasting hours on video production. We handle everything from data extraction to final render.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/5 backdrop-blur-sm`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
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
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-white/[0.06] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Universal Scraping", desc: "Zillow, Redfin, Realtor, MLS—any listing URL works." },
              { icon: Video, title: "React-Based Rendering", desc: "Remotion compiles every frame programmatically." },
              { icon: Mic, title: "5 Voice Styles", desc: "ElevenLabs integration for natural, professional narration." },
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

      {/* Testimonial */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-8">
            {[1,2,3,4,5].map(n => (
              <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
            &ldquo;{TESTIMONIAL.quote}&rdquo;
          </blockquote>
          <div>
            <div className="font-semibold">{TESTIMONIAL.author}</div>
            <div className="text-sm text-white/40">
              {TESTIMONIAL.role}, {TESTIMONIAL.company}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/[0.06] py-24 px-6">
        <div className="max-w-6xl mx-auto">
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
                <Link
                  href={plan.price === "Custom" ? "/contact" : "/dashboard"}
                  className={`block w-full py-2.5 rounded-lg text-sm font-semibold transition-colors text-center ${
                    plan.featured
                      ? 'bg-white text-[#0A0A0A] hover:bg-white/90'
                      : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]'
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
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-white/5">
          <h2 className="text-3xl font-bold mb-4">Ready to 10x Your Listings?</h2>
          <p className="text-white/50 mb-8">
            Join thousands of realtors using AI to create scroll-stopping content.
          </p>
          <Link
            href="/dashboard"
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
