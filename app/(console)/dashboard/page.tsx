"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Video,
  FileVideo,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const userId = user?.id;

  const recentVideos = useQuery(
    api.videos.getRecent,
    userId ? { userId, limit: 5 } : "skip"
  );
  const allVideos = useQuery(
    api.videos.listByUser,
    userId ? { userId } : "skip"
  );

  const completedCount =
    allVideos?.filter((v: { status: string }) => v.status === "complete").length ?? 0;
  const activeCount =
    allVideos?.filter((v: { status: string }) =>
      ["pending", "scraping", "generating", "rendering"].includes(v.status)
    ).length ?? 0;

  const isLoading = recentVideos === undefined;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {user?.firstName || "there"}
          </h1>
          <p className="text-white/50 text-sm">
            Your video production dashboard
          </p>
        </div>
        <Link href="/studio" className="btn-premium-solid">
          <Sparkles className="w-4 h-4" />
          New Video
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            label: "Videos Created",
            value: completedCount.toString(),
            change:
              activeCount > 0
                ? `${activeCount} in progress`
                : "All complete",
            icon: Video,
          },
          {
            label: "Total Projects",
            value: (allVideos?.length ?? 0).toString(),
            change: "Lifetime total",
            icon: TrendingUp,
          },
          {
            label: "Active Jobs",
            value: activeCount.toString(),
            change: activeCount > 0 ? "Currently rendering" : "None active",
            icon: Clock,
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-6 glass-panel">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white/30" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-white/40">{stat.label}</div>
              <div className="text-xs text-amber-500/80 mt-2">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/studio"
          className="group p-6 glass-panel hover:border-amber-500/20 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">AI Video Studio</h3>
              <p className="text-sm text-white/50">
                Paste a listing URL to generate
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/videos"
          className="group p-6 glass-panel hover:border-white/10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <FileVideo className="w-6 h-6 text-white/60" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">My Videos</h3>
              <p className="text-sm text-white/50">
                View and manage your library
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent Videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Videos</h2>
          <Link
            href="/videos"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : recentVideos && recentVideos.length > 0 ? (
          <div className="space-y-3">
            {recentVideos.map((video: any) => (
              <div
                key={video._id}
                className="flex items-center gap-4 p-4 glass-panel"
              >
                <div className="w-24 h-14 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="w-6 h-6 text-white/20" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">
                    {video.propertyData?.address || video.listingUrl}
                  </h3>
                  <p className="text-sm text-white/40">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    video.status === "complete"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : video.status === "failed"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {video.status === "complete"
                    ? "Ready"
                    : video.status === "failed"
                      ? "Failed"
                      : "Processing..."}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-panel">
            <FileVideo className="w-12 h-12 mx-auto mb-4 text-white/10" />
            <p className="text-white/40 mb-4">No videos yet</p>
            <Link href="/studio" className="btn-primary inline-flex">
              <Sparkles className="w-4 h-4" />
              Create Your First Video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
