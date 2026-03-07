"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import {
  Video,
  FileVideo,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  ShieldCheck,
  Activity,
  ChevronRight,
  Monitor,
  Eye,
  History
} from "lucide-react";
import { motion } from "framer-motion";

// Quick stats (would come from Convex in production)
const STATS = [
  { label: "Assets Produced", value: "24", change: "+3 this week", icon: Video, color: "blue" },
  { label: "Reach Analytics", value: "12.4K", change: "+18% vs last month", icon: Eye, color: "emerald" },
  { label: "Manual Hours Saved", value: "48h", change: "Fleet efficiency", icon: Zap, color: "amber" },
];

// Recent videos (would come from Convex in production)
const RECENT_VIDEOS = [
  { id: "1", title: "123 Main St - Luxury Condo", status: "completed", thumbnail: null, createdAt: "2 hours ago", type: "16:9 Cinema" },
  { id: "2", title: "456 Oak Ave - Family Home", status: "rendering", thumbnail: null, createdAt: "5 hours ago", type: "9:16 Social" },
  { id: "3", title: "789 Pine Blvd - Penthouse", status: "completed", thumbnail: null, createdAt: "1 day ago", type: "16:9 Cinema" },
];

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Page Background */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/assets/re-deck/re_dashboard_3d.png" 
          alt="Dashboard Context" 
          fill 
          className="object-cover opacity-30 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-transparent"></div>
      </div>

      <div className="relative z-10 space-y-12">
        {/* Elite Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-space font-bold text-blue-400 uppercase tracking-[0.4em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Command Center
              </span>
              <div className="h-px w-8 bg-white/10" />
              <span className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">Operational Status: Normal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-space font-bold tracking-tighter text-white mb-2">
              Welcome, {user?.firstName || "Operator"}.
            </h1>
            <p className="text-lg text-white/40 font-light max-w-xl">
              The fleet is standing by. Your real-time market intelligence and production systems are fully synchronized.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link
              href="/studio"
              className="group px-8 py-4 bg-white text-black font-space font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all flex items-center gap-3 rounded-2xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Initialize Asset
            </Link>
          </motion.div>
        </div>

        {/* Tactical Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="premium-glass p-8 rounded-[2.5rem] border border-white/5 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    stat.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    stat.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">Real-time</div>
                </div>
                <div className="relative z-10">
                  <div className="text-4xl font-space font-bold mb-1 tracking-tight text-white group-hover:scale-105 transition-transform origin-left duration-500">{stat.value}</div>
                  <div className="text-xs font-space font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                  <div className="flex items-center gap-2 mt-4">
                    <TrendingUp className={`w-3 h-3 ${stat.color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`} />
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Recent Assets - The Vault Preview */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-white/20" />
                <h2 className="text-sm font-space font-bold uppercase tracking-[0.3em] text-white/60">Recent Directives</h2>
              </div>
              <Link href="/videos" className="text-[10px] font-space font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group">
                Access Vault <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {RECENT_VIDEOS.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                  className="group flex items-center gap-6 p-5 premium-glass rounded-[2rem] border border-white/5 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {/* Thumbnail Placeholder */}
                  <div className="w-32 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:border-white/20 transition-all">
                    <Play className="w-6 h-6 text-white/10 group-hover:text-white/40 transition-all duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-space font-bold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors truncate">{video.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {video.createdAt}</span>
                      <span className="flex items-center gap-1.5"><Monitor className="w-3 h-3" /> {video.type}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="relative z-10 px-6">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-space font-bold uppercase tracking-widest ${video.status === "completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                      }`}>
                      {video.status === "completed" ? (
                        <><CheckCircle2 className="w-3 h-3" /> Ready</>
                      ) : (
                        <><Activity className="w-3 h-3" /> Rendering</>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Modules - The Tactical Kit */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Zap className="w-4 h-4 text-white/20" />
              <h2 className="text-sm font-space font-bold uppercase tracking-[0.3em] text-white/60">Tactical Modules</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  title: "AI Studio", 
                  desc: "Cinema Production", 
                  href: "/studio", 
                  icon: Sparkles, 
                  color: "bg-blue-500",
                  bg: "bg-blue-500/10 border-blue-500/20"
                },
                { 
                  title: "Market Intel", 
                  desc: "Competitor Tracking", 
                  href: "/studio?mode=agent-research", 
                  icon: Activity, 
                  color: "bg-emerald-500",
                  bg: "bg-emerald-500/10 border-emerald-500/20"
                },
                { 
                  title: "GEO Audit", 
                  desc: "Search Optimization", 
                  href: "/studio?mode=geo-audit", 
                  icon: ShieldCheck, 
                  color: "bg-amber-500",
                  bg: "bg-amber-500/10 border-amber-500/20"
                }
              ].map((module, i) => (
                <Link
                  key={i}
                  href={module.href}
                  className={`group p-6 rounded-[2.5rem] border ${module.bg} hover:bg-white/[0.03] transition-all duration-500 flex items-center justify-between relative overflow-hidden`}
                >
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl ${module.color} flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-space font-bold text-sm tracking-tight text-white uppercase tracking-[0.1em]">{module.title}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">{module.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all duration-500 relative z-10" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}
