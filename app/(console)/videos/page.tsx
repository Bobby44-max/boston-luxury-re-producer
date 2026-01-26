"use client";

import { useState } from "react";
import {
  FileVideo,
  Play,
  Download,
  Trash2,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";

// Mock data (would come from Convex in production)
const VIDEOS = [
  { id: "1", title: "123 Main St - Luxury Condo", status: "completed", duration: "0:32", createdAt: "2 hours ago", views: 145 },
  { id: "2", title: "456 Oak Ave - Family Home", status: "completed", duration: "0:28", createdAt: "5 hours ago", views: 89 },
  { id: "3", title: "789 Pine Blvd - Penthouse", status: "completed", duration: "0:45", createdAt: "1 day ago", views: 234 },
  { id: "4", title: "321 Elm St - Starter Home", status: "completed", duration: "0:30", createdAt: "2 days ago", views: 67 },
  { id: "5", title: "654 Maple Dr - Estate", status: "rendering", duration: "--", createdAt: "Just now", views: 0 },
];

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = VIDEOS.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Videos</h1>
          <p className="text-white/50">{VIDEOS.length} videos in your library</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm focus:outline-none focus:border-white/[0.12] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm hover:bg-white/[0.04] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-white/[0.04] relative flex items-center justify-center">
              <Play className="w-12 h-12 text-white/20" />

              {/* Duration Badge */}
              {video.duration !== "--" && (
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                  {video.duration}
                </span>
              )}

              {/* Status Badge */}
              {video.status === "rendering" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-amber-400">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Rendering...</span>
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <Play className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm truncate flex-1">{video.title}</h3>
                <button className="p-1 hover:bg-white/[0.04] rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-white/40" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                <span>{video.createdAt}</span>
                {video.views > 0 && (
                  <>
                    <span>•</span>
                    <span>{video.views} views</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <FileVideo className="w-16 h-16 mx-auto mb-4 text-white/10" />
          <h3 className="text-lg font-medium mb-2">No videos found</h3>
          <p className="text-white/40">
            {searchQuery ? "Try a different search term" : "Create your first video to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
