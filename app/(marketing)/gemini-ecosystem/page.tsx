"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Network, 
  Cpu, 
  Image as ImageIcon, 
  Terminal, 
  Layers, 
  BookOpen, 
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Search,
  PenTool
} from "lucide-react";

const slides = [
  {
    id: "hero",
    title: "The Gemini Ecosystem",
    subtitle: "Strategic Overview: Multimodal Intelligence at Scale",
    icon: <Sparkles className="w-12 h-12 text-blue-400 mb-6 animate-pulse" />,
    bg: "/assets/gemini-deck/gemini_hero_3d.png",
    content: (
      <div className="space-y-6 text-lg text-gray-200 font-medium">
        <p className="leading-relaxed">
          The Google Gemini ecosystem represents a significant leap in multimodal AI capabilities, spanning from on-device models (<span className="text-blue-400">Gemini Nano</span>) to highly complex reasoning systems (<span className="text-blue-400">Gemini Ultra</span>).
        </p>
        <p className="leading-relaxed border-l-2 border-blue-500/50 pl-6 italic text-gray-400">
          "Strategic workflows now treat Gemini as a specialized 'reader' within larger agentic environments, leveraging superior context handling alongside autonomous editing strengths."
        </p>
      </div>
    )
  },
  {
    id: "models",
    title: "1. The Gemini Model Family",
    subtitle: "Precision Engineering for Every Context",
    icon: <Cpu className="w-12 h-12 text-purple-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_models_3d.png",
    content: (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {[
          { name: "Ultra", desc: "Most capable for complex reasoning; first to achieve human-expert performance on MMLU benchmarks.", color: "rose" },
          { name: "Pro", desc: "Performance-optimized balance of cost, latency, and reasoning across multimodal tasks.", color: "blue" },
          { name: "Nano", desc: "On-device excellence for summarization and reading comprehension in memory-constrained environments.", color: "emerald" },
          { name: "2.5 Flash", desc: "Optimized for speed. Variant 'Nano Banana' specializes in high-quality image generation.", color: "yellow" },
        ].map((model) => (
          <div key={model.name} className="premium-glass p-5 rounded-3xl border border-white/5 group hover:border-white/20 transition-all">
            <h3 className={`text-xl font-bold mb-2 font-space text-${model.color}-400`}>Gemini {model.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{model.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "nano-banana",
    title: "2. Nano Banana",
    subtitle: "Gemini 2.5 Flash Image Specialization",
    icon: <ImageIcon className="w-12 h-12 text-yellow-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_nano_banana_3d.png",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl">
          <Zap className="text-yellow-400 w-6 h-6" />
          <span className="text-yellow-200 font-bold tracking-wider uppercase text-sm">Competitive Edge: $0.039 per image</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm uppercase tracking-tighter">Consistency</h5>
            <p className="text-xs text-gray-400">maintainCharacterConsistency flag ensures stability across scenes.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm uppercase tracking-tighter">Precision</h5>
            <p className="text-xs text-gray-400">Significant improvement in spelling and text rendering within visuals.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm uppercase tracking-tighter">Hacks</h5>
            <p className="text-xs text-gray-400">Aspect Ratio Extension via blank frames and 180-degree camera rotation rules.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "cli",
    title: "3. Gemini CLI Architecture",
    subtitle: "Command-Line Power for Enterprise Agents",
    icon: <Terminal className="w-12 h-12 text-cyan-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_security_3d.png",
    content: (
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="premium-glass p-6 rounded-3xl border border-white/5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 font-space">
            <Layers className="w-4 h-4 text-cyan-400" />
            Precedence Layers
          </h3>
          <ul className="text-xs space-y-2 text-gray-400 font-mono">
            <li className="flex justify-between"><span className="text-cyan-400">01</span> CMD Arguments</li>
            <li className="flex justify-between"><span className="text-cyan-400">02</span> Environment Vars</li>
            <li className="flex justify-between"><span className="text-cyan-400">03</span> System Settings</li>
            <li className="flex justify-between"><span className="text-cyan-400">04</span> Project .gemini/</li>
            <li className="flex justify-between"><span className="text-cyan-400">05</span> User ~/.gemini/</li>
          </ul>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Enterprise Auth</h4>
              <p className="text-xs text-gray-500">Service Account Impersonation & Native OAuth.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Contextual Memory</h4>
              <p className="text-xs text-gray-500">Hierarchical loading of GEMINI.md files.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "integration",
    title: "4. Strategic Integration",
    subtitle: "The Gemini + Claude Code Hybrid Workflow",
    icon: <Network className="w-12 h-12 text-orange-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_integration_3d.png",
    content: (
      <div className="mt-4">
        <div className="premium-glass p-8 rounded-[2.5rem] border border-white/5 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:w-1/3">
              <div className="text-orange-400 font-space font-bold text-2xl mb-1 uppercase tracking-tighter">Claude Plans</div>
              <p className="text-xs text-gray-500">Decision-Making</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="text-center md:w-1/3">
              <div className="text-blue-400 font-space font-bold text-2xl mb-1 uppercase tracking-tighter">Gemini Reads</div>
              <p className="text-xs text-gray-500">1M+ Token Analysis</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="text-center md:w-1/3">
              <div className="text-orange-400 font-space font-bold text-2xl mb-1 uppercase tracking-tighter">Claude Edits</div>
              <p className="text-xs text-gray-500">Code Execution</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6 uppercase tracking-[0.2em]">The 'Unix Way' of Agentic Orchestration</p>
      </div>
    )
  },
  {
    id: "tools",
    title: "5. Specialized Tools",
    subtitle: "Librarians, Researchers, and Gems",
    icon: <Sparkles className="w-12 h-12 text-emerald-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_models_3d.png",
    content: (
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="premium-glass p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-bold font-space">NotebookLM</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">Source-grounded research with Audio Overviews and automatic citations.</p>
        </div>
        <div className="premium-glass p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Search className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-bold font-space">Deep Research</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">Autonomous web crawling that bypasses ads to assemble data tables.</p>
        </div>
        <div className="premium-glass p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-bold font-space">Gemini Gems</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">Specialized AI assistants tailored for recurring business tasks.</p>
        </div>
        <div className="premium-glass p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <PenTool className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-bold font-space">Canvas Mode</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">Digital workspace for inline editing, quizzes, and code correction.</p>
        </div>
      </div>
    )
  },
  {
    id: "tech-specs",
    title: "6. Technical Requirements",
    subtitle: "Security, Sandboxing, and System Specs",
    icon: <ShieldCheck className="w-12 h-12 text-rose-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_security_3d.png",
    content: (
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
            <h4 className="text-rose-400 font-bold text-sm mb-2 uppercase">Safety Protocol</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Docker/Podman sandboxing with environment redaction for sensitive keys.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <h4 className="text-white font-bold text-sm mb-2 uppercase">Runtime</h4>
            <p className="text-xs text-gray-400">Node.js 20.0.0+ | macOS 15+ | Win 11 | Ubuntu 20.04+</p>
          </div>
        </div>
        <div className="premium-glass p-6 rounded-3xl border border-white/5">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            Type-Safe Output
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">Enforced validated responses using <span className="text-white">Instructor</span>. Native support for complex multimodal extractions.</p>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded-full uppercase font-bold tracking-widest">Sandbox Ready</span>
            <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-1 rounded-full uppercase font-bold tracking-widest">1M+ Token</span>
          </div>
        </div>
      </div>
    )
  }
];

export default function GeminiEcosystemPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-[#050505] text-white scroll-smooth selection:bg-blue-500/30 selection:text-blue-200"
    >
      {/* Navigation Branding */}
      <div className="fixed top-8 left-8 z-50 flex items-center gap-4">
        <div className="w-12 h-12 premium-glass rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
          <Network className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-space font-bold tracking-[0.2em] text-sm uppercase text-white">Gemini Fleet</span>
          <span className="text-[10px] uppercase tracking-widest text-white/40">Apex AI Systems</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 cursor-pointer"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Discover Ecosystem</span>
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent"></div>
            
            {/* Animated Light Streaks */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          </div>

          {/* Glassmorphic Content Card */}
          <motion.div 
            initial={{ opacity: 0, x: -100, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.5 }}
            className="relative z-10 max-w-5xl w-full mx-8 md:mx-16"
          >
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {slide.icon}
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-space font-bold tracking-tighter mb-4 text-white leading-[0.9]">
                  {slide.title}
                </h2>
                <h4 className="text-xl md:text-2xl text-blue-400/80 font-space font-medium mb-10 tracking-tight">
                  {slide.subtitle}
                </h4>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative"
              >
                {slide.content}
              </motion.div>
            </div>

            {/* Pagination Number */}
            <div className="absolute top-0 right-0 font-space font-bold text-[12rem] text-white/[0.03] leading-none pointer-events-none select-none">
              {String(index + 1).padStart(2, '0')}
            </div>
          </motion.div>

          {/* Background Ambient Glow */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        </section>
      ))}

      {/* Global Progress Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
