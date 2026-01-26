"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Video,
  FolderVideo,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";

// Quick stats (would come from Convex in production)
const STATS = [
  { label: "Videos Created", value: "24", change: "+3 this week", icon: Video },
  { label: "Total Views", value: "12.4K", change: "+18% vs last month", icon: TrendingUp },
  { label: "Render Time Saved", value: "48h", change: "vs manual editing", icon: Clock },
];

// Recent videos (would come from Convex in production)
const RECENT_VIDEOS = [
  { id: "1", title: "123 Main St - Luxury Condo", status: "completed", thumbnail: null, createdAt: "2 hours ago" },
  { id: "2", title: "456 Oak Ave - Family Home", status: "rendering", thumbnail: null, createdAt: "5 hours ago" },
  { id: "3", title: "789 Pine Blvd - Penthouse", status: "completed", thumbnail: null, createdAt: "1 day ago" },
];

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-white/50">
            Ready to create stunning property videos?
          </p>
        </div>
        <Link
          href="/studio"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-4 h-4" />
          Create New Video
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
              <div className="text-xs text-emerald-400 mt-2">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/studio"
          className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Video Studio</h3>
              <p className="text-sm text-white/50">Paste a listing URL to generate</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/videos"
          className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <FolderVideo className="w-6 h-6 text-white/60" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">My Videos</h3>
              <p className="text-sm text-white/50">View and manage your library</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent Videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Videos</h2>
          <Link href="/videos" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {RECENT_VIDEOS.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-24 h-14 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <Play className="w-6 h-6 text-white/30" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{video.title}</h3>
                <p className="text-sm text-white/40">{video.createdAt}</p>
              </div>

              {/* Status */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                video.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}>
                {video.status === "completed" ? "Ready" : "Rendering..."}
              </div>
            </div>
          ))}
        </div>

        {RECENT_VIDEOS.length === 0 && (
          <div className="text-center py-12 text-white/40">
            <FolderVideo className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No videos yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
