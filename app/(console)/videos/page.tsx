"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  FileVideo,
  Play,
  Download,
  Trash2,
  Search,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function VideosPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [searchQuery, setSearchQuery] = useState("");

  const videos = useQuery(
    api.videos.listByUser,
    userId ? { userId } : "skip"
  );
  const removeVideo = useMutation(api.videos.remove);

  const isLoading = videos === undefined;

  const filteredVideos = (videos ?? []).filter((video: any) => {
    const address = video.propertyData?.address || video.listingUrl || "";
    return address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = async (videoId: string) => {
    if (!confirm("Delete this video? This cannot be undone.")) return;
    try {
      await removeVideo({ id: videoId as any });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Videos</h1>
          <p className="text-sm text-white/40">
            {isLoading
              ? "Loading..."
              : `${videos?.length ?? 0} video${(videos?.length ?? 0) !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/studio" className="btn-premium-solid">
          <Sparkles className="w-4 h-4" />
          New Video
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input pl-11"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-white/30" />
        </div>
      ) : filteredVideos.length > 0 ? (
        /* Videos Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video: any) => (
            <div
              key={video._id}
              className="group glass-panel overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-white/[0.03] relative flex items-center justify-center">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Play className="w-12 h-12 text-white/10" />
                )}

                {/* Duration Badge */}
                {video.duration && (
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-[10px] font-semibold">
                    {Math.floor(video.duration / 60)}:
                    {(video.duration % 60).toString().padStart(2, "0")}
                  </span>
                )}

                {/* Status Badge */}
                {video.status !== "complete" && video.status !== "failed" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-semibold capitalize">
                        {video.status}...
                      </span>
                    </div>
                  </div>
                )}

                {video.status === "failed" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-xs font-semibold text-red-400">
                      Failed
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                {video.status === "complete" && video.videoUrl && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener"
                      className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                    </a>
                    <a
                      href={video.videoUrl}
                      download
                      className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm truncate flex-1">
                    {video.propertyData?.address || "Processing..."}
                  </h3>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="p-1 hover:bg-red-500/10 rounded transition-colors text-white/20 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-white/30">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-white/10">·</span>
                  <span className="text-xs text-white/30 capitalize">
                    {video.videoType.replace("-", " ")}
                  </span>
                </div>
                {video.propertyData?.price && (
                  <div className="text-xs text-amber-500/80 mt-1 font-semibold">
                    $
                    {video.propertyData.price >= 1000000
                      ? `${(video.propertyData.price / 1000000).toFixed(1)}M`
                      : `${(video.propertyData.price / 1000).toFixed(0)}K`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 glass-panel">
          <FileVideo className="w-16 h-16 mx-auto mb-4 text-white/10" />
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? "No videos found" : "No videos yet"}
          </h3>
          <p className="text-white/40 mb-6">
            {searchQuery
              ? "Try a different search term"
              : "Create your first video to get started"}
          </p>
          {!searchQuery && (
            <Link href="/studio" className="btn-primary inline-flex">
              <Sparkles className="w-4 h-4" />
              Create Video
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
