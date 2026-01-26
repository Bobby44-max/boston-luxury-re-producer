"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
  Home,
  Play,
  ChevronRight,
  Star,
  Zap,
  Globe,
  Shield,
  Clock,
  DollarSign,
  Award,
  Layers,
  Target,
  Mic,
  FileText,
  Share2,
  ArrowRight,
} from "lucide-react";
import VideoStudio from "@/components/VideoStudio";

// Feature cards for the dashboard
const FEATURES = [
  {
    icon: Video,
    title: "AI Video Studio",
    description: "Turn any listing URL into stunning property videos with Remotion",
    gradient: "from-cyan-500 to-violet-500",
    tag: "Core Feature",
  },
  {
    icon: Globe,
    title: "Firecrawl Scraping",
    description: "Extract property data from Zillow, Redfin, Realtor.com & more",
    gradient: "from-emerald-500 to-cyan-500",
    tag: "AI Powered",
  },
  {
    icon: Mic,
    title: "AI Voiceover",
    description: "Professional narration with OpenAI voices in 5 styles",
    gradient: "from-violet-500 to-pink-500",
    tag: "Premium",
  },
  {
    icon: Layers,
    title: "4 Video Formats",
    description: "Property showcase, social shorts, market stats & just listed",
    gradient: "from-orange-500 to-red-500",
    tag: "Templates",
  },
];

// Stats for the hero section
const STATS = [
  { label: "Videos Generated", value: "12,400+", icon: Play },
  { label: "Agents Using", value: "2,100+", icon: Users },
  { label: "Avg. Engagement", value: "+340%", icon: TrendingUp },
  { label: "Time Saved", value: "8hrs/week", icon: Clock },
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "This completely transformed how I market luxury properties. The AI videos get 5x more engagement than my photos.",
    author: "Sarah Chen",
    role: "Luxury Agent, Beacon Hill",
    avatar: "SC",
  },
  {
    quote: "I used to spend $500 per listing video. Now I create better ones in minutes. Game changer.",
    author: "Michael Torres",
    role: "Broker, Back Bay Realty",
    avatar: "MT",
  },
  {
    quote: "The Firecrawl integration is incredible - paste a URL and it pulls everything automatically.",
    author: "Jennifer Walsh",
    role: "Team Lead, Seaport Living",
    avatar: "JW",
  },
];

// Pricing tiers
const PRICING = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    features: ["10 videos/month", "720p export", "Basic templates", "Email support"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    features: ["Unlimited videos", "4K export", "All templates", "AI voiceover", "Priority support", "Custom branding"],
    popular: true,
  },
  {
    name: "Team",
    price: "$399",
    period: "/month",
    features: ["Everything in Pro", "5 team seats", "API access", "White label", "Dedicated success manager"],
    popular: false,
  },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"studio" | "dashboard">("studio");

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">Real Easy</span>
                  <span className="text-white/80"> Realty</span>
                </h1>
                <p className="text-sm text-white/40">AI-Powered Real Estate Production Suite</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab("studio")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "studio"
                    ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Video className="w-4 h-4 inline mr-2" />
                Video Studio
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
            </div>
          </div>

          {/* Conditional Content */}
          {activeTab === "studio" ? (
            <>
              {/* Hero Text */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-full border border-cyan-500/20 mb-6">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-300">Powered by Remotion + Firecrawl + AI</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                    Turn Any Listing Into a
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Stunning Video in Minutes
                  </span>
                </h2>
                <p className="text-lg text-white/50 max-w-2xl mx-auto">
                  Paste a Zillow, Redfin, or any listing URL. Our AI scrapes the data, writes the script,
                  generates professional voiceover, and renders a beautiful video with Remotion.
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="glass-panel p-4 flex items-center gap-3 hover:bg-white/5 transition-all cursor-default"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/40">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Video Studio Component */}
              <VideoStudio />

              {/* Features Grid */}
              <div className="mt-16 mb-12">
                <h3 className="text-2xl font-bold text-center mb-8">
                  <span className="gradient-text">How It Works</span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {FEATURES.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={i}
                        className="glass-panel p-6 hover:bg-white/5 transition-all group cursor-default"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-white">{feature.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-white/50">
                            {feature.tag}
                          </span>
                        </div>
                        <p className="text-sm text-white/50">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Process Steps */}
              <div className="glass-panel p-8 mb-12">
                <h3 className="text-xl font-bold text-center mb-8">
                  From URL to Video in <span className="gradient-text">4 Simple Steps</span>
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { step: "1", title: "Paste URL", desc: "Drop any listing link from Zillow, Redfin, Realtor.com" },
                    { step: "2", title: "AI Scrapes", desc: "Firecrawl extracts photos, price, beds, baths & features" },
                    { step: "3", title: "Script & Voice", desc: "AI writes narration and generates professional voiceover" },
                    { step: "4", title: "Render Video", desc: "Remotion creates a stunning video ready to share" },
                  ].map((item, i) => (
                    <div key={i} className="text-center relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {item.step}
                      </div>
                      <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-sm text-white/50">{item.desc}</p>
                      {i < 3 && (
                        <ChevronRight className="hidden md:block absolute right-0 top-6 w-6 h-6 text-white/20" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Dashboard View */
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Videos This Month", value: "24", change: "+12%", icon: Video },
                  { label: "Total Views", value: "18.4K", change: "+28%", icon: Play },
                  { label: "Leads Generated", value: "142", change: "+45%", icon: Users },
                  { label: "Avg. Watch Time", value: "42s", change: "+8%", icon: Clock },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="glass-panel p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-5 h-5 text-white/40" />
                        <span className="text-xs text-green-400 font-semibold">{stat.change}</span>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-white/40">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Videos */}
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Recent Videos</h3>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/30" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-white mb-1">123 Beacon St, Boston</h4>
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>Property Showcase</span>
                          <span>2 days ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("studio")}
                  className="glass-panel p-6 text-left hover:bg-white/5 transition-all group"
                >
                  <Video className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-white mb-2">Create New Video</h4>
                  <p className="text-sm text-white/50">Generate a stunning property video from any listing URL</p>
                </button>
                <div className="glass-panel p-6 text-left hover:bg-white/5 transition-all group cursor-pointer">
                  <Target className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-white mb-2">Market Analytics</h4>
                  <p className="text-sm text-white/50">View real-time market data and trends for your area</p>
                </div>
                <div className="glass-panel p-6 text-left hover:bg-white/5 transition-all group cursor-pointer">
                  <Share2 className="w-8 h-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-white mb-2">Social Scheduler</h4>
                  <p className="text-sm text-white/50">Schedule and auto-post videos to your social channels</p>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-center mb-2">
                  <span className="gradient-text">Upgrade Your Plan</span>
                </h3>
                <p className="text-white/50 text-center mb-8">Choose the plan that fits your business</p>
                <div className="grid md:grid-cols-3 gap-6">
                  {PRICING.map((plan, i) => (
                    <div
                      key={i}
                      className={`glass-panel p-6 relative ${
                        plan.popular ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10" : ""
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full text-xs font-bold">
                          Most Popular
                        </div>
                      )}
                      <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                        <span className="text-white/40">{plan.period}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${
                          plan.popular
                            ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:shadow-lg hover:shadow-cyan-500/30"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        Get Started
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Testimonials */}
          {activeTab === "studio" && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-8">
                Trusted by <span className="gradient-text">Top Agents</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((testimonial, i) => (
                  <div key={i} className="glass-panel p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white/70 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-sm font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{testimonial.author}</p>
                        <p className="text-xs text-white/40">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="glass-panel p-8 text-center bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10">
            <h3 className="text-2xl font-bold mb-2">
              Ready to <span className="gradient-text">Transform Your Listings</span>?
            </h3>
            <p className="text-white/50 mb-6">
              Join 2,100+ real estate professionals creating stunning videos with AI
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab("studio")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Creating Free
              </button>
              <button className="px-8 py-3 bg-white/10 rounded-xl font-semibold text-white hover:bg-white/20 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
