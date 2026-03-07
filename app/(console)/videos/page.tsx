"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileVideo,
  Play,
  Download,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Clock,
  Eye,
  Calendar,
  Share2,
  Maximize2,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data (would come from Convex in production)
const VIDEOS = [
  { id: "1", title: "123 Main St - Luxury Condo", status: "completed", duration: "0:32", createdAt: "2 hours ago", views: 145, type: "16:9 Cinema" },
  { id: "2", title: "456 Oak Ave - Family Home", status: "completed", duration: "0:28", createdAt: "5 hours ago", views: 89, type: "9:16 Social" },
  { id: "3", title: "789 Pine Blvd - Penthouse", status: "completed", duration: "0:45", createdAt: "1 day ago", views: 234, type: "16:9 Cinema" },
  { id: "4", title: "321 Elm St - Starter Home", status: "completed", duration: "0:30", createdAt: "2 days ago", views: 67, type: "9:16 Social" },
  { id: "5", title: "654 Maple Dr - Estate", status: "rendering", duration: "--", createdAt: "Just now", views: 0, type: "16:9 Cinema" },
];

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = VIDEOS.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/assets/re-deck/re_library_3d.png" 
          alt="Vault Context" 
          fill 
          className="object-cover opacity-30 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-[#020617]"></div>
      </div>

      <div className="relative z-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-space font-bold text-blue-400 uppercase tracking-[0.4em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Asset Vault
              </span>
              <div className="h-px w-8 bg-white/10" />
              <span className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">{VIDEOS.length} Intelligence Units</span>
            </div>
            <h1 className="text-5xl font-space font-bold tracking-tighter text-white">
              Secured <span className="text-white/20">Archive.</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="premium-glass p-1 rounded-2xl border border-white/10 flex gap-1">
              <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-space font-bold uppercase tracking-widest text-white">All Assets</button>
              <button className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-space font-bold uppercase tracking-widest text-white/40 transition-colors">Cinema</button>
              <button className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-space font-bold uppercase tracking-widest text-white/40 transition-colors">Social</button>
            </div>
          </div>
        </div>

        {/* Search & Intelligence Filtering */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <div className="flex-1 relative group w-full">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search Strategic Assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 premium-glass border border-white/5 rounded-2xl text-sm font-light placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all bg-white/[0.01] focus:bg-white/[0.03]"
            />
            {/* Search Glow Effect */}
            <div className="absolute inset-0 -z-10 bg-blue-500/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          </div>
          <button className="flex items-center gap-3 px-8 py-5 premium-glass border border-white/5 rounded-2xl text-[10px] font-space font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-white/20 transition-all group w-full md:w-auto">
            <Filter className="w-4 h-4 transition-transform group-hover:rotate-180" />
            Advanced Filter
          </button>
        </motion.div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, i) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group premium-glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
                
                {/* Cinema Preview Container */}
                <div className="aspect-[16/10] bg-black/40 relative flex items-center justify-center group-hover:bg-black/20 transition-colors duration-700">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 relative">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                    <Play className="w-6 h-6 text-white/20 group-hover:text-white transition-colors relative z-10" />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                      <span className="text-[9px] font-space font-bold uppercase tracking-widest text-white/80">{video.type}</span>
                    </div>
                    <button className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full hover:bg-white/10 transition-colors">
                      <Share2 className="w-3.5 h-3.5 text-white/60" />
                    </button>
                  </div>

                  {/* Bottom Badges */}
                  <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] font-space font-bold text-white/80">{video.duration === "--" ? "SYNTH" : video.duration}</span>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[10px] group-hover:translate-y-0">
                      <button className="bg-white text-black p-2.5 rounded-xl hover:bg-gray-200 transition-all active:scale-90">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="bg-black/60 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl hover:bg-rose-500/20 hover:border-rose-500/30 transition-all text-white/60 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rendering Progress Overlay */}
                  {video.status === "rendering" && (
                    <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 relative">
                        <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping"></div>
                      </div>
                      <span className="text-[10px] font-space font-bold uppercase tracking-[0.3em] text-blue-400 mb-1">Synthesizing Asset</span>
                      <div className="w-32 h-[1px] bg-white/10 rounded-full overflow-hidden mt-4">
                        <motion.div 
                          animate={{ x: [-128, 128] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-full h-full bg-blue-500 shadow-[0_0_10px_blue]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-space font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors leading-tight mb-1">{video.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {video.createdAt}</span>
                      </div>
                    </div>
                    <button className="text-white/20 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-space font-bold text-white/20 uppercase tracking-widest mb-0.5">Reach</span>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span className="text-xs font-bold text-white/80 tabular-nums">{video.views > 0 ? video.views : '--'}</span>
                        </div>
                      </div>
                      <div className="w-px h-6 bg-white/5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-space font-bold text-white/20 uppercase tracking-widest mb-0.5">Engine</span>
                        <span className="text-[10px] font-bold text-white/60">v2.60-PRO</span>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 text-[9px] font-space font-bold text-blue-400 uppercase tracking-widest group/btn">
                      Analyze <Maximize2 className="w-3 h-3 group-hover/btn:scale-125 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 premium-glass rounded-[3rem] border border-white/5"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-8">
              <FileVideo className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-2xl font-space font-bold text-white/60 mb-2">No Strategic Assets Found</h3>
            <p className="text-white/20 font-light max-w-sm mx-auto leading-relaxed">
              {searchQuery ? `The query "${searchQuery}" returned no results from the vault.` : "Initialize your first production directive to populate the archive."}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-8 text-[10px] font-space font-bold text-blue-400 uppercase tracking-widest hover:text-white transition-colors"
              >
                Clear Search Parameters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
