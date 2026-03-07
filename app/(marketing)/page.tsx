"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Sparkles, 
  Layers, 
  Camera, 
  Mic, 
  BrainCircuit,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  FileText,
  MessageSquare
} from "lucide-react";

const slides = [
  {
    id: "hero",
    title: "Boston Luxury RE Producer",
    subtitle: "The AI-powered content generation suite and architectural manual for Boston luxury real estate professionals.",
    icon: <Building2 className="w-12 h-12 text-yellow-500 mb-6" style={{ color: "#D4AF37" }} />,
    bg: "/assets/re-deck/re_hero_3d.png",
    content: (
      <div className="space-y-6 text-lg text-gray-200">
        <p className="leading-relaxed font-light">
          Proprietary Enterprise Software by Apex AI Technology.
        </p>
        <div className="flex gap-4 pt-4">
          <button 
            className="px-8 py-4 bg-white text-black font-space font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            Launch Studio <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  },
  {
    id: "philosophy",
    title: "The Content Suite Philosophy",
    subtitle: "1 Topic = 6 Synchronized Assets",
    icon: <Layers className="w-12 h-12 text-blue-400 mb-6" />,
    bg: "/assets/re-deck/re_content_suite_3d.png",
    content: (
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed font-light">
          Input a single market focus (e.g., 'Seaport luxury condos'). Automatically generate a synchronized, multi-channel campaign with zero manual formatting required.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {[
            { name: "Video Scripts", icon: <Camera className="w-4 h-4" /> },
            { name: "Social Posts", icon: <MessageSquare className="w-4 h-4" /> },
            { name: "Proposals", icon: <FileText className="w-4 h-4" /> },
            { name: "Competitor Intel", icon: <TrendingUp className="w-4 h-4" /> },
            { name: "Sales Materials", icon: <Layers className="w-4 h-4" /> },
            { name: "VEO Prompts", icon: <Sparkles className="w-4 h-4" /> }
          ].map((item) => (
            <div key={item.name} className="premium-glass p-4 rounded-xl flex items-center gap-3 border border-white/10 hover:border-white/30 transition-colors">
              <div className="text-blue-400">{item.icon}</div>
              <span className="text-xs font-space font-bold uppercase tracking-wider text-white">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "visual",
    title: "Visual Storytelling",
    subtitle: "Video & VEO Animator",
    icon: <Camera className="w-12 h-12 text-rose-400 mb-6" />,
    bg: "/assets/re-deck/re_visual_storytelling_3d.png",
    content: (
      <div className="space-y-6 mt-4">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
          <h4 className="text-rose-400 font-space font-bold uppercase text-sm mb-2">Nano Banana Pro Engine</h4>
          <p className="text-sm text-gray-300 font-light">Utilizes Gemini 2.5 Flash Image capabilities to maintain strict property consistency across generated media.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
          <h4 className="text-rose-400 font-space font-bold uppercase text-sm mb-2">Cinematic Camera Controls</h4>
          <p className="text-sm text-gray-300 font-light">Prompts adhere to real-world filmmaking physics—apply "70mm lens," "dolly zoom," and "shallow depth of field" directly to showcases.</p>
        </div>
        <div className="bg-black/50 border border-white/10 p-4 rounded-xl font-mono text-xs text-rose-200">
          {`{
  "subject": "Luxury Seaport condo interior living room",
  "lens": "70mm",
  "camera_movement": "dolly zoom",
  "depth_of_field": "shallow"
}`}
        </div>
      </div>
    )
  },
  {
    id: "consultant",
    title: "The Live Consultant",
    subtitle: "Real-time voice AI for ultra-high-net-worth clients",
    icon: <Mic className="w-12 h-12 text-emerald-400 mb-6" />,
    bg: "/assets/re-deck/re_live_consultant_3d.png",
    content: (
      <div className="space-y-6 mt-4">
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400"></div>
            <p className="text-gray-300 font-light">Powered by the <strong className="text-white">Gemini Live API</strong> for instantaneous, natural conversation latency.</p>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400"></div>
            <p className="text-gray-300 font-light">Supports dynamic avatar video integration via the HeyGen API.</p>
          </li>
        </ul>
        <div className="flex gap-4 pt-4">
          <div className="premium-glass px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-300 text-xs font-space uppercase tracking-widest font-bold">
            Median Comp: $4.2M
          </div>
          <div className="premium-glass px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-300 text-xs font-space uppercase tracking-widest font-bold">
            Tax History Searched
          </div>
        </div>
      </div>
    )
  },
  {
    id: "engine",
    title: "The AI Engine",
    subtitle: "Why Gemini?",
    icon: <BrainCircuit className="w-12 h-12 text-purple-400 mb-6" />,
    bg: "/assets/re-deck/re_ai_engine_3d.png",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="premium-glass p-6 rounded-2xl border border-white/10 group hover:border-purple-500/50 transition-colors">
          <h4 className="text-purple-400 font-space font-bold uppercase text-sm mb-3">1-Million Token Context Window</h4>
          <p className="text-sm text-gray-300 font-light leading-relaxed">
            Process massive property histories, complex market comps, and decade-long tax records in a single interaction.
          </p>
        </div>
        <div className="premium-glass p-6 rounded-2xl border border-white/10 group hover:border-purple-500/50 transition-colors">
          <h4 className="text-purple-400 font-space font-bold uppercase text-sm mb-3">ReAct Agent Loop</h4>
          <p className="text-sm text-gray-300 font-light leading-relaxed">
            The internal reasoning engine autonomously decides when to query the filesystem, search the web, or answer directly.
          </p>
        </div>
        <div className="premium-glass p-6 rounded-2xl border border-white/10 group hover:border-purple-500/50 transition-colors md:col-span-2">
          <h4 className="text-purple-400 font-space font-bold uppercase text-sm mb-3">Multimodal Native</h4>
          <p className="text-sm text-gray-300 font-light leading-relaxed">
            Processes text, property images, audio, and code repositories simultaneously.
          </p>
        </div>
      </div>
    )
  }
];

export default function MarketingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const router = useRouter();

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-[#050505] text-white scroll-smooth selection:bg-yellow-500/30 selection:text-yellow-200"
    >
      {/* Navigation Branding */}
      <div className="fixed top-8 left-8 z-50 flex items-center gap-4 cursor-pointer" onClick={() => router.push('/studio')}>
        <div className="w-12 h-12 premium-glass rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-space font-bold tracking-[0.2em] text-sm uppercase text-white">RE Producer</span>
          <span className="text-[10px] uppercase tracking-widest text-white/40">Boston Luxury</span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
        <button 
          onClick={() => router.push('/studio')}
          className="premium-glass px-6 py-3 rounded-full border border-white/20 text-xs font-space font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          Open Studio
        </button>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
        <ChevronDown className="w-4 h-4 text-white/40 animate-bounce" />
      </motion.div>

      {slides.map((slide, index) => (
        <section 
          key={slide.id} 
          className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
        >
          {/* High-End Cinematic Background */}
          <div className="absolute inset-0 z-0">
            <Image 
              src={slide.bg} 
              alt={slide.title} 
              fill 
              className="object-cover opacity-60 scale-105"
              priority={index === 0}
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/40 to-transparent"></div>
          </div>

          {/* Glassmorphic Content Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.5 }}
            className="relative z-10 max-w-5xl w-full mx-8 md:mx-16"
          >
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {slide.icon}
                <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-space font-bold tracking-tighter mb-4 text-white leading-[0.95]">
                  {slide.title}
                </h2>
                <h4 className="text-xl md:text-2xl text-white/70 font-space font-medium mb-10 tracking-tight max-w-xl">
                  {slide.subtitle}
                </h4>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative"
              >
                {slide.content}
              </motion.div>
            </div>

            {/* Pagination Number */}
            <div className="absolute top-0 right-0 font-space font-bold text-[10rem] md:text-[14rem] text-white/[0.02] leading-none pointer-events-none select-none">
              {String(index + 1).padStart(2, '0')}
            </div>
          </motion.div>
        </section>
      ))}

      {/* Global Progress Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-400 z-50 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: "#D4AF37" }}
      />
    </div>
  );
}